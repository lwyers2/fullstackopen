const blogsRouter = require('express').Router()
const Blog = require('../models/blog')




blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
  })
  
  blogsRouter.post('/', async (request, response) => {
    const body = request.body

    if(!body.title || !body.url) {
      return response.status(400).json({error : `url or title missing`})
    }
    const blog = new Blog({
      id: body.id,
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    })
  
    const savedBlog = await blog.save()
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