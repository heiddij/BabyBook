import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './reducers/usersReducer'
import babyReducer from './reducers/babyReducer'
import userReducer from './reducers/userReducer'
import postReducer from './reducers/postReducer'
import followedPostsReducer from './reducers/followedPostsReducer'

const store = configureStore({
  reducer: {
    users: usersReducer,
    user: userReducer,
    babies: babyReducer,
    posts: postReducer,
    followedPosts: followedPostsReducer
  }
})

export default store
