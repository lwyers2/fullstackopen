import { useState } from 'react'

const Blog = ({ blog, updatedLikes, deleteBlog, user }) => {
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

  const removeBlog = () => {
    deleteBlog(blog.id)
  }

  return (
    <div style={blogStyle}>
      {showAll ? (
        <div className="showBlog">
          {blog.title} {blog.author} &#9;
          <button onClick={() => setShowAll(false)}>hide</button>
          <br />
          {blog.url}
          <br />
          likes {blog.likes}&#9;
          <button onClick={() => addLike()}>like</button>
          <br />
          {blog.user.username}
          <br />
          {user.username === blog.user.username ?
            <button onClick={() => removeBlog()}>remove</button> : ''
          }
        </div>
      ) : (
        <div className="hideBlog">
          {blog.title} {blog.author}&#9;
          <button onClick={() => setShowAll(true)}>view</button>
        </div>
      )}
    </div>
  )
}

export default Blog