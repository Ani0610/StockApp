import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    stoneStock: [],
}
const stoneStockSlice = createSlice({
    name: 'SET_STONE_STOCK',
    initialState,
    reducers: {
        setStoneStock: (state: any, action) => {
            state.stoneStock = action.payload
        },
        addStonestock: (state: any, action) => {
            state.stoneStock = [...state.stoneStock, action.payload]
        },
        editstoneStock: (state: any, action) => {
            const findIndex = state.stoneStock.findIndex((item: any) => item.id === action.payload.id)
            state.stoneStock[findIndex] = action.payload
        },
        deleteStockStone: (state: any, action) => {
            state.stoneStock = state.stoneStock.filter((item: any) => item.id !== action.payload.id)
        },

    }
})
export const { setStoneStock, addStonestock, editstoneStock, deleteStockStone } = stoneStockSlice.actions;

const stoneStockReducer = stoneStockSlice.reducer;
export default stoneStockReducer;
