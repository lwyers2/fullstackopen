import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    setFilter(state, action) {
      return action.payload
    },
  },
})

// const filterReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case 'SET_FILTER':
//       return action.payload
//     default: 
//     return state
//   }
// }

// export const setFilter = (filterText) => {
//   return {
//     type: 'SET_FILTER',
//     payload: filterText,
//   }
// }

export const { setFilter } = filterSlice.actions
export default filterSlice.reducer