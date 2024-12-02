// reducers/notificationReducer.js
import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    },
  },
})

export const { setNotification, clearNotification } = notificationSlice.actions


export const showNotification = (message, timeout) => {
  return (dispatch) => {
    dispatch(setNotification(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, timeout * 1000) // Convert seconds to milliseconds
  }
}

export default notificationSlice.reducer
