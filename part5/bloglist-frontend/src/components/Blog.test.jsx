import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Title',
    author: 'author',
    url: 'url',
    likes: 5
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText(`${blog.title} ${blog.author}`)

  screen.debug(element)

  expect(element).toBeDefined()

})
