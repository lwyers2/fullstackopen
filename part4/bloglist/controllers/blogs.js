const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')




blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
    .find({}).populate('user')

    response.json(blogs)
  })
  
  blogsRouter.post('/', middleware.userExtractor,  async (request, response) => {
    const body = request.body

   const user = request.user

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

  blogsRouter.delete('/:id', middleware.userExtractor,  async (request, response) => {
    const user = request.user // Extracted by middleware
    const blog = await Blog.findById(request.params.id)
  
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }
  
    // Check if the user trying to delete is the same user who created the blog
    if (blog.user.toString() !== user.id.toString()) {
      return response.status(403).json({ error: 'Unauthorized action, blog belongs to another user' })
    }
  
    // Proceed with deletion if the user owns the blog
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  })

  blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }
    if (blog.user.toString() !== user.id.toString()) {
      return response.status(403).json({ error: 'Unauthorized action, blog belongs to another user' })
    }
    const updatedLikesBlog = {
      likes: body.likes,
    }

    const  updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updatedLikesBlog, { new: true })
    response.json(updatedBlog)
  })

  module.exports = blogsRouter