import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    stone: [],
}
const stoneSlice = createSlice({
    name: 'SET_STONE',
    initialState,
    reducers: {
        setStone: (state: any, action) => {
            state.stone = action.payload
        },
        addStone: (state: any, action) => {
            state.stone = [...state.stone, action.payload]
        },
        editStone: (state: any, action) => {
            const findIndex = state.stone.findIndex((item: any) => item.id === action.payload.id)
            state.stone[findIndex] = action.payload
        },
        deleteStone: (state: any, action) => {
            state.stone = state.stone.filter((item: any) => item.id !== action.payload.id)
        },

    }
})
export const { setStone, addStone, editStone, deleteStone } = stoneSlice.actions;

const stoneReducer = stoneSlice.reducer;
export default stoneReducer;
