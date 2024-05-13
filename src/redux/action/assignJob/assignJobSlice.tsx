import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    assignJobs: [],
}
const assignJobSlice = createSlice({
    name: 'SET_ASSIGNJOBS',
    initialState,
    reducers: {
        setAssignJobs: (state: any, action) => {
            state.assignJobs = action.payload
        },
        addAssignJobs: (state: any, action) => {
            state.assignJobs = [...state.assignJobs, action.payload]
        },
        editAssignJob: (state: any, action) => {
            const findIndex = state.assignJobs.findIndex((item: any) => item.id === action.payload.id)
            state.assignJobs[findIndex] = action.payload
        },
        deleteAssignJob: (state: any, action) => {
            state.assignJobs = state.assignJobs.filter((item: any) => item.id !== action.payload.id)
        },

    }
})
export const { setAssignJobs, addAssignJobs, editAssignJob, deleteAssignJob } = assignJobSlice.actions;

const assignJobReducer = assignJobSlice.reducer;
export default assignJobReducer;
