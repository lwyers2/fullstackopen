import { useSelector, useDispatch } from 'react-redux'
import  AnecdoteForm  from './components/AnecdoteForm'

const App = () => {
  const anecdotes = useSelector((state) => 
    [...state].sort((a, b) => b.votes - a.votes)
  )
  const dispatch = useDispatch()

  const vote = (id) => {
    return {
      type: 'VOTE',
      payload: { id }
    }
  }






  return (
    <div>
      <h2>Anecdotes</h2>
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
      <AnecdoteForm />


    </div>
  )
}

export default App