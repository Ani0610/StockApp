import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jobworkTeams: [],
  jobworkTeamPersons: [],
};
const jobTeamSlice = createSlice({
  name: "SET_JOB_WORK_TEAM",
  initialState,
  reducers: {
    // JobworkTeam reducers
    setJobworkTeam: (state, action) => {
      state.jobworkTeams = action.payload;
    },
    addJobworkTeam: (state:any, action) => {
      state.jobworkTeams = [...state.jobworkTeams, action.payload];
    },
    editTeamJobwork: (state:any, action) => {
      const findIndex = state.jobworkTeams.findIndex(
        (item:any) => item.id === action.payload.id
      );
      state.jobworkTeams[findIndex] = action.payload;
    },
    deleteJobworkTeam: (state, action) => {
      state.jobworkTeams = state.jobworkTeams.filter(
        (item:any) => item.id !== action.payload.id
      );
    },


    // JobworkTeamPerson reducers
    setJobworkTeamPerson: (state, action) => {
      state.jobworkTeamPersons = action.payload;
    },
    addJobworkTeamPerson: (state:any, action) => {
      state.jobworkTeamPersons = [...state.jobworkTeamPersons, action.payload];
    },
    editJobworkTeamPerson: (state:any, action) => {
      const findIndex = state.jobworkTeamPersons.findIndex(
        (item:any) => item.id === action.payload.id
      );
      state.jobworkTeamPersons[findIndex] = action.payload;
    },
    deleteJobworkTeamPerson: (state, action) => {
      state.jobworkTeamPersons = state.jobworkTeamPersons.filter(
        (item:any) => item.id !== action.payload.id
      );
    },
  },
});
export const {
  setJobworkTeam,addJobworkTeam,editTeamJobwork,deleteJobworkTeam,
  setJobworkTeamPerson, addJobworkTeamPerson, editJobworkTeamPerson, deleteJobworkTeamPerson 
} = jobTeamSlice.actions;

const jobTeamReducer = jobTeamSlice.reducer;
export default jobTeamReducer;
