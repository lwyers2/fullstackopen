import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {

  const dispatch = useDispatch()
  
  const anecdotes = useSelector((state) => {
    const { anecdotes, filter } = state
    if (!filter) return anecdotes
    return anecdotes.filter((anecdote) =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
  })


  return (
    <div>
    {anecdotes.map(anecdote =>
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => dispatch(vote(anecdote.id))}>vote</button>
        </div>
      </div>
      
  )}
  </div>
)
}

export default AnecdoteList