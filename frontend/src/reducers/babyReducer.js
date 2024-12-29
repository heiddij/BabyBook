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
        modifyBaby(state, action) {
            return state.map((baby) =>
            baby.id !== action.payload.id
                ? baby
                : action.payload)
        },
        remove(state, action) {
           return state.filter((baby) => baby.id !== action.payload)
        }
    }
})

export const { setBabies, appendBaby, modifyBaby, remove } = babySlice.actions

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

export const updateBaby = (id, formData) => {
    return async (dispatch) => {
        const updatedBaby = await babyService.update(id, formData)
        dispatch(modifyBaby(updatedBaby))
    }
}

export const deleteBaby = (id) => {
    return async (dispatch) => {
      await babyService.deleteBaby(id)
      dispatch(remove(id))
    }
}

export default babySlice.reducer