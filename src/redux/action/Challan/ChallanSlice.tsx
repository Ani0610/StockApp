import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    challan: [],
}
const challanSlice = createSlice({
    name: 'SET_CHALLAN',
    initialState,
    reducers: {
        setChallan: (state: any, action) => {
            state.challan = action.payload
        },
        addChallan: (state: any, action) => {
            state.challan = [...state.challan, action.payload]
        },
        editChallan: (state: any, action) => {
            const findIndex = state.challan.findIndex((item: any) => item.id === action.payload.id)
            state.challan[findIndex] = action.payload
        },
        deleteChallan: (state: any, action) => {
            state.challan = state.challan.filter((item: any) => item.id !== action.payload.id)
        },

    }
})
export const { setChallan, addChallan, editChallan, deleteChallan } = challanSlice.actions;

const challanReducer = challanSlice.reducer;
export default challanReducer;
