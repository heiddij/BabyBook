import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'
import followService from '../services/follow'

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
    follow(state, action) {
      const { followerUser, followingUser } = action.payload

      return state.map((user) => {
        if (user.id === followerUser.id) {
          return {
            ...user,
            following: [...user.following, followingUser]
          }
        } else if (user.id === followingUser.id) {
          return {
            ...user,
            followers: [...user.followers, followerUser]
          }
        }
        return user
      })
    },
    unfollow(state, action) {
      const { followingId, followerId } = action.payload

      return state.map((user) => {
        if (user.id === followingId) {
          return {
            ...user,
            followers: user.followers.filter((follower) => follower.id !== followerId),
          }
        } else if (user.id === followerId) {
          return {
            ...user,
            following: user.following.filter((following) => following.id !== followingId),
          }
        }
        return user
      })
    }
  },
})

export const { setUsers, appendUser, follow, unfollow } = usersSlice.actions

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

export const followUser = (followerId, followingId) => {
  return async (dispatch) => {
    const response = await followService.follow(followingId)
    dispatch(follow({ followerUser: response.follower, followingUser: response.following }))
  }
}

export const unfollowUser = (followerId, followingId) => {
  return async (dispatch) => {
    await followService.unfollow(followingId)
    dispatch(unfollow({ followerId: followerId, followingId: followingId }))
  }
}

export default usersSlice.reducer
