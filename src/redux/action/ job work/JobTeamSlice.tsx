import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    teams: [],
}
const jobTeamSlice = createSlice({
    name: 'SET_JOB_WORK_TEAM',
    initialState,
    reducers: {
        setjobTeam: (state: any, action) => {
            state.teams = action.payload
        },
        addjobTeam: (state: any, action) => {
            state.teams = [...state.teams, action.payload]
        },
        editjobTeam: (state: any, action) => {
            const findIndex = state.teams.findIndex((item: any) => item.id === action.payload.id)
            state.teams[findIndex] = action.payload
        },
        deletejobTeam: (state: any, action) => {
            state.teams = state.teams.filter((item: any) => item.id !== action.payload.id)
        },

    }
})
export const { setjobTeam, addjobTeam, editjobTeam, deletejobTeam } = jobTeamSlice.actions;

const jobTeamReducer = jobTeamSlice.reducer;
export default jobTeamReducer;
