import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    jobWorks: [],
}
const jobWorkSlice = createSlice({
    name: 'SET_JOB_WORK',
    initialState,
    reducers: {
        setJobWork: (state: any, action) => {
            state.jobWorks = action.payload
        },
        addJobWork: (state: any, action) => {
            state.jobWorks = [...state.jobWorks, action.payload]
        },
        editJobWork: (state: any, action) => {
            const findIndex = state.jobWorks.findIndex((item: any) => item.id === action.payload.id)
            state.jobWorks[findIndex] = action.payload
        },
        deleteJobWork: (state: any, action) => {
            state.jobWorks = state.jobWorks.filter((item: any) => item.id !== action.payload.id)
        },

    }
})
export const { setJobWork, addJobWork, editJobWork, deleteJobWork } = jobWorkSlice.actions;

const jobworkReducer = jobWorkSlice.reducer;
export default jobworkReducer;
