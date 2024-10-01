require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.TEST_MONGODB_URI
console.log(url)

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  const Blog = mongoose.model('Blog', blogSchema)

  
  const blog = new Blog({
    title: "Test2",
    author: "Mr. Test",
    url: "www.test.com",
    likes: 11
  })

  blog.save().then(result => {
    console.log('blog saved!')
    mongoose.connection.close()
  })


  
  /*
  const note = new Note({
    content: 'HTML is x',
    important: true,
  })

  note.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
  })
  */


})