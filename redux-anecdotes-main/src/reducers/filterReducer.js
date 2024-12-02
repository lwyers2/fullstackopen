const initialState = ''

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return action.payload
    default: 
    return state
  }
}

export const setFilter = (filterText) => {
  return {
    type: 'SET_FILTER',
    payload: filterText,
  }
}

export default filterReducer