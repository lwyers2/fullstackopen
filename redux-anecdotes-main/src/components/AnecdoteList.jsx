import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { showNotification} from '../reducers/notificationReducer'

const AnecdoteList = () => {

  const dispatch = useDispatch()
  
  const anecdotes = useSelector((state) => {
    const { anecdotes, filter } = state
    // Apply filtering if a filter exists
    const filteredAnecdotes = filter
      ? anecdotes.filter((anecdote) =>
          anecdote.content.toLowerCase().includes(filter.toLowerCase())
        )
      : anecdotes

    // Sort by votes in descending order
    return [...filteredAnecdotes].sort((a, b) => b.votes - a.votes)
  })

  const handleVote = (id, content) => {
    dispatch(vote(id))
    dispatch(showNotification(`You voted for '${content}'`, 5))
  }

  return (
    <div>
    {anecdotes.map(anecdote =>
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => handleVote(anecdote.id, anecdote.content)}>vote</button>
        </div>
      </div>
      
  )}
  </div>
)
}

export default AnecdoteList