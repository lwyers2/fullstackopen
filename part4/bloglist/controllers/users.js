const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  if(!request.body.username) {
    return response.status(400).json({ error: `username missing `})
  }

  if(!request.body.password) {
    return response.status(400).json({ error: `password missing `})
  }

 if(password.length < 3) {
  return response.status(400).json({ error: `password invalid`})
 }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  //I have no idea what I am missing, but I have to put this in a try catch to get the error to return
try{
  const savedUser = await user.save()

  response.status(201).json(savedUser)
}
catch (error) {
  next(error)
}
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

module.exports = usersRouter