import { useState } from 'react'
import blogService from '../services/blogs'


const Blog = ({ blog, updatedLikes }) => { 
  const[showAll, setShowAll] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLike = () => {
    const updatedBlog = {
      ...blog, 
      likes: blog.likes + 1
    }
    updatedLikes(blog.id, updatedBlog)
  }
  
  return (
  <div style={blogStyle}>
    {showAll ? (
      <div>
       {blog.title} {blog.author}
       <button onClick={() => setShowAll(false)}>hide</button>
       <br />
       {blog.url}
       <br />
       likes {blog.likes} 
       <button onClick={() => addLike()}>like</button>
       <br />
       {blog.author}
       </div>
    ) : (
      <div>
      {blog.title} {blog.author}
      <button onClick={() => setShowAll(true)}>view</button>
      </div>
    )}
    </div>
  )  
}

export default Blog