import { createSlice } from '@reduxjs/toolkit'
import commentService from '../services/comments'
import { createSelector } from 'reselect'

const commentSlice = createSlice({
  name: 'comments',
  initialState: {},
  reducers: {
    setComments(state, action) {
      const { postId, comments } = action.payload
      state[postId] = comments
    },
    appendComment(state, action) {
      const { postId, comment } = action.payload
      if (!state[postId]) state[postId] = []
      state[postId].push(comment)
    },
  },
})

export const { setComments, appendComment } = commentSlice.actions

export const initializePostComments = (postId) => {
  return async (dispatch) => {
    const comments = await commentService.getPostComments(postId)
    dispatch(setComments({ postId, comments }))
  }
}

export const createComment = (postId, comment) => {
  return async (dispatch) => {
    const newComment = await commentService.create(postId, comment)
    dispatch(appendComment({ postId, comment: newComment }))
  }
}

export const makeSelectPostComments = () =>
  createSelector(
    [(state) => state.comments, (_, postId) => postId],
    (comments, postId) => comments[postId] || []
  )

export default commentSlice.reducer