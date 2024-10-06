const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const helper = require('./test_helper')

const Blog = require('../models/blog')

let token // Store the token globally to be reused in the tests

beforeEach(async () => {
    // Clear the blogs and users collections
    await Blog.deleteMany({})
    await User.deleteMany({})
  
    // Create a new user and hash the password
    const passwordHash = await bcrypt.hash('password123', 10)
    const user = new User({
      username: 'testuser',
      name: 'Test User',
      passwordHash
    })
    const savedUser = await user.save()
  
    // Generate a JWT token for the created user (this will be passed in Authorization header)
    const userForToken = {
      username: savedUser.username,
      id: savedUser._id
    }
  
    token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' }) // Token valid for 1 hour
  
    // Insert initial blogs and associate them with the created user
    const initialBlogs = helper.initialBlogs.map(blog => ({
      ...blog,
      user: savedUser._id // Associate each blog with the user
    }))
    await Blog.insertMany(initialBlogs)
  })


describe('When there is initially some blogs saved', () => {

    test.only('blogs are returned as json', async () => {
        await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test.only('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test.only('the first blog is about React', async () => {
        const response = await api.get('/api/blogs')
        const contents = response.body.map(e => e.title)
        assert(contents.includes('React patterns'))
    })

    test.only('id field is named id', async () => {
        const response =await api.get('/api/blogs')
        const contents = response.body.map(e => Object.keys(e))
        contents.forEach(e => {
            assert(e.includes('id'))
        })         
    })

})

describe('addition of a new blog', () => {

    test('a valid blog can be added', async () => {

        await api
        .post('/api/blogs')
        .send(helper.validBlog)
        .set('Authorization', `Bearer ${token}`) // Include token here
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
    
        const titles = response.body.map(r => r.title)
    
        assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    
        assert(titles.includes('First class tests'))
    })
    
    test('a blog with likes field missing returns 0', async () => {
    
        await api
        .post('/api/blogs')
        .send(helper.noLikesFieldBlog)
        .set('Authorization', `Bearer ${token}`) // Include token here
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
    
        //I am using the title as the identifier here, I could also do the below
        // const newBlogAdded = response.body[response.body.length -1]
        const newBlogAdded = response.body.find(r => r.title === helper.noLikesFieldBlog.title)
    
        assert.strictEqual(newBlogAdded.likes, 0)
    })
    
    test('a blog with missing url returns 400', async () => {
        
        await api 
        .post('/api/blogs')
        .send(helper.noUrlBlog)
        .set('Authorization', `Bearer ${token}`) // Include token here
        .expect(400)
    
        const response = await api.get('/api/blogs')

        const blogsAtEnd = await helper.blogsInDb()
    
        assert.strictEqual(response.body.length, blogsAtEnd.length)
    })
    
    test('a blog with missing title returns 400', async () => {
    
        await api 
        .post('/api/blogs')
        .send(helper.noTitleBlog)
        .set('Authorization', `Bearer ${token}`) // Include token here
        .expect(400)
    
        const response = await api.get('/api/blogs')

        const blogsAtEnd = await helper.blogsInDb()
    
        assert.strictEqual(response.body.length, blogsAtEnd.length)
    })

})

describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      // Fetch all blogs in DB, including their associated users
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0] // Select the first blog to delete

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`) // Include token of the logged-in user
        .expect(204)
  
      // Fetch blogs after deletion
      const blogsAtEnd = await helper.blogsInDb()
  
      assert.strictEqual(blogsAtStart.length -1 , blogsAtEnd.length)
  
      // Ensure that the deleted blog's ID is no longer present
      const id = blogsAtEnd.map(r => r.id)
        assert(!id.includes(blogToDelete.id))
    })
  
    test('fails with status code 403 if user tries to delete a blog they do not own', async () => {
      // Create another user who will attempt the deletion
      const anotherUser = new User({
        username: 'otheruser',
        name: 'Other User',
        passwordHash: await bcrypt.hash('otherpassword', 10),
      })
      await anotherUser.save()
  
      const anotherToken = jwt.sign({ username: anotherUser.username, id: anotherUser._id }, process.env.SECRET)
  
      // Fetch blogs and attempt to delete one belonging to the original user
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]
  
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${anotherToken}`) // Token of another user
        .expect(403) // Should fail with forbidden status code
  
      const blogsAtEnd = await helper.blogsInDb()
  
      // Ensure no blogs were deleted
      assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
    })
  })

describe('editing of a blog', () => {
    test('succeeds with status code if likes updated', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const originalLikes = blogToUpdate.likes
        const updatedBlog = {
            likes: blogToUpdate.likes + 1
        }
        await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .set('Authorization', `Bearer ${token}`) // Token of another user
        .expect(200)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
        
         const updatedLikesBlog = blogsAtEnd.find(r => r.id === blogToUpdate.id)
        
         assert.strictEqual(updatedLikesBlog.likes, originalLikes+1)

    })
})

describe('when there is initially one user in db', () => {
beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash})

    await user.save()
})

test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

})

describe('users with invalid name and password are not added', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', name: 'admin', passwordHash})
    
        await user.save()
    })

    test('a user with missing username returns 400', async () => {

        const usersAtStart = await helper.usersInDb()

        await api 
        .post('/api/users')
        .send(helper.emptyUserName)
        .expect(400)


        const usersAtEnd = await helper.usersInDb()
    
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('a user with missing password returns 400', async () => {

        const usersAtStart = await helper.usersInDb()

        await api 
        .post('/api/users')
        .send(helper.emptyPassword)
        .expect(400)


        const usersAtEnd = await helper.usersInDb()
    
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
    
        assert(result.body.error.includes('expected `username` to be unique'))
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })

    test('creation fails if password below three characters', async () => {
        const usersAtStart = await helper.usersInDb()

        await api 
        .post('/api/users')
        .send(helper.invalidPassword)
        .expect(400)


        const usersAtEnd = await helper.usersInDb()
    
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('creation fails if username below three characters', async () => {
        const usersAtStart = await helper.usersInDb()

        await api 
        .post('/api/users')
        .send(helper.invalidUserName)
        .expect(400)


        const usersAtEnd = await helper.usersInDb()
    
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

})


describe('unverified token fails', () => {
    test('adding blog fails with 401 status code if no token provided', async () => {
        const blogsAtStart = await helper.blogsInDb()
        
        await api
        .post('/api/blogs')
        .send(helper.validBlog)
        .expect(401)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
    })
})



after(async () => {
    await mongoose.connection.close()
})
