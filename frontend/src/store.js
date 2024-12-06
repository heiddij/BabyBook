import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userReducer'
import babyReducer from './reducers/babyReducer'

const store = configureStore({
    reducer: {
      users: userReducer,
      babies: babyReducer
    }
  })
  
  export default store
  