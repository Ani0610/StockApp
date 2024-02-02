import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    designs: [],
}
const designSlice = createSlice({
    name: 'SET_DESIGN',
    initialState,
    reducers: {
        setDesign: (state: any, action) => {
            state.designs = action.payload
        },
        addDesign: (state: any, action) => {
            state.designs = [...state.designs, action.payload]
        },
        editDesign: (state: any, action) => {
            const findIndex = state.designs.findIndex((item: any) => item.id === action.payload.id)
            state.designs[findIndex] = action.payload
        },
        deleteDesign: (state: any, action) => {
            state.designs = state.designs.filter((item: any) => item.id !== action.payload.id)
        },

    }
})
export const { setDesign, addDesign, editDesign, deleteDesign } = designSlice.actions;

const designReducer = designSlice.reducer;
export default designReducer;
