import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {getAnecdotes, updateAnecdote} from './requests'

const App = () => {

  const queryClient = useQueryClient()

  const updateAnecdotesMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess:() => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes']})
    },
  })


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
    updateAnecdotesMutation.mutate({
      ...anecdote,
      votes: anecdote.votes + 1})
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
