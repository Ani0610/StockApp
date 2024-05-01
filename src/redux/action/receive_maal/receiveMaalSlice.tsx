import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    receiveMaal: [],
}
const receiveMaalSlice = createSlice({
    name: 'SET_RECEIVEMAAL',
    initialState,
    reducers: {
        setReceiveMaal: (state: any, action) => {
            state.receiveMaal = action.payload
        },
        addReceiveMaal: (state: any, action) => {
            state.receiveMaal = [...state.receiveMaal, action.payload]
        },
        editReceiveMaal: (state: any, action) => {
            const findIndex = state.receiveMaal.findIndex((item: any) => item.id === action.payload.id)
            state.receiveMaal[findIndex] = action.payload
        },
        deleteReceiveMaal: (state: any, action) => {
            state.receiveMaal = state.receiveMaal.filter((item: any) => item.id !== action.payload.id)
        },

    }
})
export const { setReceiveMaal, addReceiveMaal, editReceiveMaal, deleteReceiveMaal } = receiveMaalSlice.actions;

const receiveMaalReducer = receiveMaalSlice.reducer;
export default receiveMaalReducer;
