import { createSlice } from '@reduxjs/toolkit'
import babyService from '../services/babies'

const babySlice = createSlice({
    name: 'babies',
    initialState: [],
    reducers: {
        setBabies(state, action) {
            return action.payload
        },
        appendBaby(state, action) {
            state.push(action.payload)
        },
    }
})

export const { setBabies, appendBaby } = babySlice.actions

export const initializeBabies = () => {
    return async (dispatch) => {
      const babies = await babyService.getAll()
      dispatch(setBabies(babies))
    }
}

export const createBaby = (formData) => {
    return async (dispatch) => {
      const newBaby = await babyService.create(formData)
      dispatch(appendBaby(newBaby))
    }
}

export default babySlice.reducer