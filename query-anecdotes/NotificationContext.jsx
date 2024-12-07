import React, { createContext, useReducer, useContext } from 'react'

// Define the notification reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload // Set the notification message
    case 'CLEAR_NOTIFICATION':
      return '' // Clear the notification message
    default:
      return state
  }
}

// Create the NotificationContext
const NotificationContext = createContext()

// Custom hook for accessing the context
export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

// NotificationProvider for wrapping the application
export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}