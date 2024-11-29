import { babies } from "../data"
import { createSlice } from '@reduxjs/toolkit'

const generateId = () =>
    Number((Math.random() * 1000000).toFixed(0))

const initialState = babies

const babySlice = createSlice({
    name: 'babies',
    initialState,
    reducers: {
        createBabyProfile(state, action) {
            const id = generateId()
            const baby = {
                id: id,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                birthDate: action.payload.birthDate,
                birthPlace: action.payload.birthPlace
            }

            state.push(baby)
            // babies.push(baby)
        }
    }
})

export const { createBabyProfile } = babySlice.actions
export default babySlice