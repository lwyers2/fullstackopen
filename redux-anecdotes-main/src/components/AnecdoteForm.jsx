import { useDispatch } from 'react-redux'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {

  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value= ''
    dispatch(createAnecdote(content))
    dispatch(setNotificationWithTimeout(`You added '${content}'`, 10))
  }
  
  return (
    <div>
    <h2>create new</h2>
    <form onSubmit={addAnecdote}>
          <div>
            <input name="anecdote"/>
            </div>
          <button>create</button>
        </form>
    </div>
  )

}

export default AnecdoteForm



