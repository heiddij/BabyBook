import { createSlice } from '@reduxjs/toolkit'
import postService from '../services/posts'

const postSlice = createSlice({
  name: 'posts',
  initialState: [],
  reducers: {
    setPosts(state, action) {
      return action.payload
    },
    appendPost(state, action) {
      state.push(action.payload)
    },
    update(state, action) {
      const updatedPost = action.payload
      return state.map((post) => (post.id !== updatedPost.id ? post : updatedPost))
    }
  }
})

export const { setPosts, appendPost, update } = postSlice.actions

export const initializeUserPosts = (userId) => {
  return async (dispatch) => {
    const posts = await postService.getUserPosts(userId)
    dispatch(setPosts(posts))
  }
}

export const createPost = (babyId, formData) => {
  return async (dispatch) => {
    const newPost = await postService.create(babyId, formData)
    dispatch(appendPost(newPost))
  }
}

export const likePost = (postId) => {
  return async (dispatch) => {
    const likedPost = await postService.like(postId)
    dispatch(update(likedPost))
  }
}

export const unlikePost = (postId) => {
  return async (dispatch) => {
    const unlikedPost = await postService.unlike(postId)
    dispatch(update(unlikedPost))
  }
}

export default postSlice.reducer