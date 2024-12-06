import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './reducers/usersReducer'
import babyReducer from './reducers/babyReducer'
import notificationReducer from './reducers/notificationReducer'
import userReducer from './reducers/userReducer'

const store = configureStore({
    reducer: {
      users: usersReducer,
      user: userReducer,
      babies: babyReducer,
      notification: notificationReducer
    }
})
  
export default store
  