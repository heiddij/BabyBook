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
    }
})

export const { setPosts, appendPost } = postSlice.actions

export const initializePosts = () => {
    return async (dispatch) => {
      const posts = await postService.getAll()
      dispatch(setPosts(posts))
    }
}

export const createPost = (babyId, formData) => {
    return async (dispatch) => {
      const newPost = await postService.create(babyId, formData)
      dispatch(appendPost(newPost))
    }
}

export default postSlice.reducer