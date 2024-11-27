import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  const blog = {
    title: 'Title',
    author: 'author',
    url: 'url',
    likes: 5,
    user: {
      username: 'test'
    }
  }
  const user = 'user'
  beforeEach(() => {

    container = render(
      <Blog blog={blog} user={user}/>
    ).container
  })

  test('renders content', () => {

    const element = screen.getByText(`${blog.title} ${blog.author}`)

    //screen.debug(element)

    expect(element).toBeDefined()

  })

  test('clicking the view button shows full details of blog', async () => {

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    //screen.debug(container)

    const div = container.querySelector('.showBlog')

    expect(div).toBeDefined()

  })

})




