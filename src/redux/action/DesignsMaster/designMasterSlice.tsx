import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    designsMasterMaster: [],
}
const designMasterSlice = createSlice({
    name: 'SET_DESIGN_MASTER',
    initialState,
    reducers: {
        setDesignMaster: (state: any, action) => {
            state.designsMaster = action.payload
        },
        addDesignMaster: (state: any, action) => {
            state.designsMaster = [...state.designsMaster, action.payload]
        },
        editDesignMaster: (state: any, action) => {
            const findIndex = state.designsMaster.findIndex((item: any) => item.id === action.payload.id)
            state.designsMaster[findIndex] = action.payload
        },
        deleteDesignMaster: (state: any, action) => {
            state.designsMaster = state.designsMaster.filter((item: any) => item.id !== action.payload.id)
        },

    }
})
export const { setDesignMaster, addDesignMaster, editDesignMaster, deleteDesignMaster } = designMasterSlice.actions;

const designMasterReducer = designMasterSlice.reducer;
export default designMasterReducer;
