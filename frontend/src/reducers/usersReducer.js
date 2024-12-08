import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    },
    updateUser(state, action) {
      const updatedUser = action.payload;
      return state.map((user) => (user.id === updatedUser.id ? updatedUser : user));
    },
  }
})

export const { setUsers, updateUser } = usersSlice.actions

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll()
    dispatch(setUsers(users))
  }
}

export const updateUserInStore = (updatedUser) => {
  return async (dispatch) => {
    dispatch(updateUser(updatedUser));
  };
};

export default usersSlice.reducer
