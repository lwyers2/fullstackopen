import { createSlice } from '@reduxjs/toolkit'



const getId = () => (100000 * Math.random()).toFixed(0)




// export const createAnecdote = (content) => {
//   return {
//     type: 'NEW_ANECDOTE',
//     payload: {
//       content,
//       id: getId(),
//       votes: 0 
//     }
//   }
// }


// export const vote = (id) => {
//   return {
//     type: 'VOTE',
//     payload: { id }
//   }
// }


const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    vote(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find((anecdote) => anecdote.id === id) 
      if(anecdoteToChange) {
        anecdoteToChange.votes += 1
      } 
    },
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes( action) {
      return action.payload
    }
  }
})

// const anecdoteReducer = (state = initialState, action) => {
//   console.log('state now: ', state)
//   console.log('action', action)
//   switch(action.type) {
//     case 'VOTE': {
//     const id = action.payload.id
//     const anecdoteToChange = state.find(n => n.id === id)
//     const changedAnecdote = {
//       ...anecdoteToChange,
//       votes: anecdoteToChange.votes + 1
//     }
//     return state.map(anecdote => 
//       anecdote.id !== id? anecdote : changedAnecdote
//     )
//     }
//     case 'NEW_ANECDOTE': {
//       return [...state, action.payload]
//     }
//     default:
//       return state
//   }
// }

export const { vote, createAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer