import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './reducers/usersReducer'
import babyReducer from './reducers/babyReducer'
import userReducer from './reducers/userReducer'
import postReducer from './reducers/postReducer'
import followedPostsReducer from './reducers/followedPostsReducer'
import commentReducer from './reducers/commentReducer'

const rootReducer = {
  users: usersReducer,
  user: userReducer,
  babies: babyReducer,
  posts: postReducer,
  followedPosts: followedPostsReducer,
  comments: commentReducer
}

const store = configureStore({
  reducer: rootReducer
})

export const setupStore = preloadedState => {
  return configureStore({
    reducer: rootReducer,
    preloadedState
  })
}

export default store
