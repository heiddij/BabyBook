import { createSlice } from '@reduxjs/toolkit'
import babyService from '../services/babies'

const babySlice = createSlice({
    name: 'babies',
    initialState: [],
    reducers: {
        setBabies(state, action) {
            return action.payload
        }
    }
})

export const { setBabies } = babySlice.actions

export const initializeBabies = () => {
    return async (dispatch) => {
      const babies = await babyService.getAll()
      dispatch(setBabies(babies))
    }
}  

export default babySlice.reducer