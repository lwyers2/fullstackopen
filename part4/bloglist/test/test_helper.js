const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs =[
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
        
      },
      {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5
        
      },
      {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12
       
      }
]

const validBlog = {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10
}

const noLikesFieldBlog = {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html"
}

const noUrlBlog = {
    title: "No Url",
    author: "Robert C. Martin",
    likes: 14
}

const noTitleBlog = {
    url: "www.notitle.com",
    author: "Robert C. Martin",
    likes: 14
}

const nonExistingId = async () => {
    const blog = newBlog({
        title: 'Will be removed',
        author: 'Removed name',
        url: 'www.nonexisting.com'
    })
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs,
    validBlog,
    noLikesFieldBlog,
    noUrlBlog,
    noTitleBlog,
    nonExistingId,
    blogsInDb,
    usersInDb 
}