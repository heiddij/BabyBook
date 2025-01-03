import { createSlice } from '@reduxjs/toolkit'
import postService from '../services/posts'

const followedPostsSlice = createSlice({
  name: 'followedPosts',
  initialState: [],
  reducers: {
    setPosts(state, action) {
      return action.payload
    },
  }
})

export const { setPosts } = followedPostsSlice.actions

export const initializeFollowedUsersPosts = () => {
  return async (dispatch) => {
    const posts = await postService.getPostsOfFollowedUsers()
    dispatch(setPosts(posts))
  }
}

export default followedPostsSlice.reducer