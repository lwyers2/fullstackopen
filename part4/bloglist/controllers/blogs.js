const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
    .find({}).populate('user')

    response.json(blogs)
  })
  
  blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if(!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid '})
    }

    let userId
    if(!body.userId) {
      const user = await User.findOne({})
      userId = user.id
    } else {
      userId = body.userId
    } 

    const user = await User.findById(decodedToken.id)

    if(!body.title || !body.url) {
      return response.status(400).json({error : `url or title missing`})
    }
    const blog = new Blog({
      id: body.id,
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id
    })
  
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  })

  blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  })

  blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
      likes: body.likes,
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
  })

  module.exports = blogsRouter