import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery } from '@tanstack/react-query'
import {getAnecdotes} from './requests'

const App = () => {

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  })

  if (result.isLoading) {
    return <div>Loading data...</div>
  }

  if (result.isError) {
    return <div>Sorry, the anecdote service is not available due to server issues.</div>
  }

  const anecdotes = result.data

  const handleVote = (anecdote) => {
    console.log('Voting for anecdote', anecdote)
  }

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
