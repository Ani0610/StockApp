import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    perDayWorks: [],
}
const workPerDaySlice = createSlice({
    name: 'SET_JOB_PER_DAY_WORK',
    initialState,
    reducers: {
        setperDayWork: (state: any, action) => {
            state.perDayWorks = action.payload
        },
        addperDayWork: (state: any, action) => {
            state.perDayWorks = [...state.perDayWorks, action.payload]
        },
        editperDayWork: (state: any, action) => {
            const findIndex = state.perDayWorks.findIndex((item: any) => item.id === action.payload.id)
            state.perDayWorks[findIndex] = action.payload
        },
        deleteperDayWork: (state: any, action) => {
            state.perDayWorks = state.perDayWorks.filter((item: any) => item.id !== action.payload.id)
        },

    }
})
export const { setperDayWork, addperDayWork, editperDayWork, deleteperDayWork } = workPerDaySlice.actions;

const worPerDayReducer = workPerDaySlice.reducer;
export default worPerDayReducer;
