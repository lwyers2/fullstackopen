import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => (
    <div>
      <h2>log in to Application</h2>
      <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type="submit">login</button>
    </form>
    </div>      
  )

  const blogForm = () => (
    <div>
    <h2>blogs</h2>
    <p>{user.name} logged-in
    <button type="button" onClick={handleLogout}>logout</button>
    </p>
    </div>
  )

  const createBlogForm = () => (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          title:
        <input
        type="text"
        value={title}
        onChange={({ target }) => setTitle(target.value)} 
        />
        </div>
        <div>
          author:
        <input
        type="text"
        value={author}
        onChange={({ target }) => setAuthor(target.value)} 
        />
        </div>
        <div>
          url:
        <input
        type="url"
        value={url}
        onChange={({ target }) => setUrl(target.value)} 
        />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )

  const handleLogin = async (event) => {
    event.preventDefault()
    try{
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBloglistappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(exception) {
      console.log("Wrong credentials")
    }
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    const blogObject = {
      author: author,
      title: title,
      url: url
    }

    blogService
    .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlog('')
      })
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.clear()
    setUser(null)
    setUsername('')
    setPassword('')
  }


  return (
    <div>
      {user === null ?
      <div>
      {loginForm()}
      </div> 
      :
      <div>
      {blogForm()}
      {createBlogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      </div>
    }
    </div>
  )
}

export default App