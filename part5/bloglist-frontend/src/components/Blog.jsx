import { useState } from 'react'

const Blog = ({ blog }) => { 
  const[showAll, setShowAll] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
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