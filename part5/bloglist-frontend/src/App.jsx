import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [notificationType, setNotificationType] = useState('')


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

  const handleLogin = async (event) => {
    event.preventDefault()
    try{
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBloglistappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(exception) {
      setNotificationType('error')
      setMessage('Wrong username or password')
      setTimeout(() => {
        setMessage(null)
        setNotificationType(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.clear()
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const loginForm = () => (
    <div>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </div>
  )

  const blogFormRef = useRef()

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })

    setNotificationType('notification')
    setMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
    setTimeout(() => {
      setMessage(null)
      setNotificationType(null)
    }, 5000)
  }

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const updateBlogLikes = async (id, updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map(blog => (blog.id !== id ? blog : returnedBlog)))
      setNotificationType('notification')
      setMessage(`Blog "${returnedBlog.title}" has been liked!`)
      setTimeout(() => {
        setMessage(null)
        setNotificationType(null)
      }, 5000)
    } catch (error) {
      setNotificationType('error')
      setMessage('Failed to update blog likes')
      setTimeout(() => {
        setMessage(null)
        setNotificationType(null)
      }, 5000)
    }
  }

  const deleteBlog = async (id) => {
    const blog = blogs.find(b => b.id === id)
    try{
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
        await blogService.remove(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
        setNotificationType('notification')
        setMessage('Blog successfully deleted')
        setTimeout(() => {
          setMessage(null)
          setNotificationType(null)
        }, 5000)
      }
    } catch (error) {
      setNotificationType('error')
      setMessage('Failed to update blog likes')
      setTimeout(() => {
        setMessage(null)
        setNotificationType(null)
      }, 5000)
    }
  }

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={message} notificationType={notificationType}/>
      {user === null ?
        loginForm():
        <div>
          <p>{user.name} logged-in</p>
          <button type="button" onClick={handleLogout}>logout</button>
          {blogForm()}
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map(blog =>
              <Blog key={blog.id} blog={blog} updatedLikes={updateBlogLikes} deleteBlog={deleteBlog} user = {user}/>
            )}
        </div>
      }
    </div>
  )
}

export default App