import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useField } from '../hooks'



const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const anecdoteField = useField('text')

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      // Fetch the current list of anecdotes from the cache
      const anecdotes = queryClient.getQueryData(['anecdotes'])

      // Update the query cache with the new anecdote
      queryClient.setQueryData(['anecdotes'], [...anecdotes, newAnecdote])
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    anecdoteField.onChange({ target: { value: ''} })
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  // const onReset = (event) => {
  //   event.preventDefault()
    
  // }


  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
      <input {...anecdoteField} />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
