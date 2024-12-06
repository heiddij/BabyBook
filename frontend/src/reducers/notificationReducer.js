import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    notify(state, action) {
      return action.payload
    }
  }
})

export const { notify } = notificationSlice.actions

export const setNotification = (message, timer) => {
  return async (dispatch) => {
    dispatch(notify(message))
    setTimeout(() => {
      dispatch(notify(null))
    }, timer * 1000)
  }
}

export default notificationSlice.reducer
