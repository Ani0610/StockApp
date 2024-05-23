import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teams: [],
  jobworkTeams: [],
  jobworkTeamPersons: [],
};
const jobTeamSlice = createSlice({
  name: "SET_JOB_WORK_TEAM",
  initialState,
  reducers: {
    setjobTeam: (state: any, action) => {
      state.teams = action.payload;
    },
    addjobTeam: (state: any, action) => {
      state.teams = [...state.teams, action.payload];
    },
    editjobTeam: (state: any, action) => {
      const findIndex = state.teams.findIndex(
        (item: any) => item.id === action.payload.id
      );
      state.teams[findIndex] = action.payload;
    },
    deletejobTeam: (state: any, action) => {
      state.teams = state.teams.filter(
        (item: any) => item.id !== action.payload.id
      );
    },

    // JobworkTeam reducers
    setJobworkTeam: (state, action) => {
      state.jobworkTeams = action.payload;
    },
    addJobworkTeam: (state, action) => {
      state.jobworkTeams = [...state.jobworkTeams, action.payload];
    },
    editTeamJobwork: (state, action) => {
      const findIndex = state.jobworkTeams.findIndex(
        (item) => item.id === action.payload.id
      );
      state.jobworkTeams[findIndex] = action.payload;
    },
    deleteJobworkTeam: (state, action) => {
      state.jobworkTeams = state.jobworkTeams.filter(
        (item) => item.id !== action.payload.id
      );
    },


    // JobworkTeamPerson reducers
    setJobworkTeamPerson: (state, action) => {
      state.jobworkTeamPersons = action.payload;
    },
    addJobworkTeamPerson: (state, action) => {
      state.jobworkTeamPersons = [...state.jobworkTeamPersons, action.payload];
    },
    editJobworkTeamPerson: (state, action) => {
      const findIndex = state.jobworkTeamPersons.findIndex(
        (item) => item.id === action.payload.id
      );
      state.jobworkTeamPersons[findIndex] = action.payload;
    },
    deleteJobworkTeamPerson: (state, action) => {
      state.jobworkTeamPersons = state.jobworkTeamPersons.filter(
        (item) => item.id !== action.payload.id
      );
    },
  },
});
export const {
  setjobTeam,addjobTeam,editjobTeam,deletejobTeam,
  setJobworkTeam,addJobworkTeam,editTeamJobwork,deleteJobworkTeam,
  setJobworkTeamPerson, addJobworkTeamPerson, editJobworkTeamPerson, deleteJobworkTeamPerson 
} = jobTeamSlice.actions;

const jobTeamReducer = jobTeamSlice.reducer;
export default jobTeamReducer;
