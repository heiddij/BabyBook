import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    },
    appendUser(state, action) {
      state.push(action.payload)
    },
  }
})

export const { setUsers, appendUser } = usersSlice.actions

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll()
    dispatch(setUsers(users))
  }
}

export const createUser = (userObject) => {
  return async (dispatch) => {
    const newUser = await userService.create(userObject)
    dispatch(appendUser(newUser))
  }
}

export default usersSlice.reducer
