import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    updateVote(state, action) {
      console.log('Payload:', action.payload) // Debug log
      return state.map(anecdote => 
        anecdote.id === action.payload.id ? action.payload: anecdote
      )
    }
  }
})

export const { updateVote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}


export const vote = id => {
  return async (dispatch, getState) => {
  const state = getState().anecdotes
  const anecdoteToChange = state.find((anecdote) => anecdote.id === id)
  if(anecdoteToChange) {
    const updatedAnecdote = {
      ...anecdoteToChange,
      votes: anecdoteToChange.votes +1,
    }
    console.log('Updated anecdote before API call:', updatedAnecdote)

    const newAnecdote = await anecdoteService.update(id, updatedAnecdote)
    console.log('Backend response:', newAnecdote)
    dispatch(updateVote(newAnecdote)) // Ensure this passes the correct object
    } else {
      console.error(`Anecdote with id ${id} not found in state.`)
  }
  }
  
}

export default anecdoteSlice.reducer