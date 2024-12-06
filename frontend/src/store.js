import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/usersReducer'
import babyReducer from './reducers/babyReducer'
import notificationReducer from './reducers/notificationReducer'

const store = configureStore({
    reducer: {
      users: userReducer,
      babies: babyReducer,
      notification: notificationReducer
    }
})
  
export default store
  