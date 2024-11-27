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
      username: 'user'
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

describe('<Blog /> showAll', () => {
  const blog = {
    id: '1',
    title: 'Title',
    author: 'author',
    url: 'url',
    likes: 5,
    user: {
      username: 'test',
    },
  }
  const user = 'test'
  let mockUpdatedLikes

  beforeEach(async () => {
    mockUpdatedLikes = vi.fn() // Mock the updatedLikes function
    render(
      <Blog
        blog={blog}
        user={user}
        updatedLikes={mockUpdatedLikes}
      />
    )

    const userEventInstance = userEvent.setup()
    const button = screen.getByText('view')
    await userEventInstance.click(button) // Expand the blog details
  })

  test('clicking the like button twice calls updatedLikes twice', async () => {
    const userEventInstance = userEvent.setup()
    const likeButton = screen.getByText('like')

    // Simulate two clicks on the "like" button
    await userEventInstance.click(likeButton)
    await userEventInstance.click(likeButton)

    // Verify the updatedLikes function was called twice
    expect(mockUpdatedLikes).toHaveBeenCalledTimes(2)
  })
})




