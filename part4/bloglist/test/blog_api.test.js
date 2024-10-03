const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')




describe('When there is initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

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

    test.only('a valid blog can be added', async () => {

        await api
        .post('/api/blogs')
        .send(helper.validBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
    
        const titles = response.body.map(r => r.title)
    
        assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    
        assert(titles.includes('First class tests'))
    })
    
    test.only('a blog with likes field missing returns 0', async () => {
    
        await api
        .post('/api/blogs')
        .send(helper.noLikesFieldBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
    
        //I am using the title as the identifier here, I could also do the below
        // const newBlogAdded = response.body[response.body.length -1]
        const newBlogAdded = response.body.find(r => r.title === helper.noLikesFieldBlog.title)
    
        assert.strictEqual(newBlogAdded.likes, 0)
    })
    
    test.only('a blog with missing url returns 400', async () => {
        
        await api 
        .post('/api/blogs')
        .send(helper.noUrlBlog)
        .expect(400)
    
        const response = await api.get('/api/blogs')

        const blogsAtEnd = await helper.blogsInDb()
    
        assert.strictEqual(response.body.length, blogsAtEnd.length)
    })
    
    test.only('a blog with missing title returns 400', async () => {
    
        await api 
        .post('/api/blogs')
        .send(helper.noTitleBlog)
        .expect(400)
    
        const response = await api.get('/api/blogs')

        const blogsAtEnd = await helper.blogsInDb()
    
        assert.strictEqual(response.body.length, blogsAtEnd.length)
    })

})

describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

        const id = blogsAtEnd.map(r => r.id)
        assert(!id.includes(blogToDelete.id))

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
        .expect(200)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
        
         const updatedLikesBlog = blogsAtEnd.find(r => r.id === blogToUpdate.id)
        
         assert.strictEqual(updatedLikesBlog.likes, originalLikes+1)

    })
})












after(async () => {
    await mongoose.connection.close()
})
