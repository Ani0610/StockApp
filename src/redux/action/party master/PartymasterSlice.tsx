import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  partyMaster: [],
};
const partyMasterSlice = createSlice({
  name: "SET_PARTY_MASTER",
  initialState,
  reducers: {
    setPartyMaster: (state: any, action) => {
      state.partyMaster = action.payload;
    },
    addPartyMaster: (state: any, action) => {
      state.partyMaster = [...state.partyMaster, action.payload];
    },
    editpartyMaster: (state: any, action) => {
      const findIndex = state.partyMaster.findIndex(
        (item: any) => item.id === action.payload.id
      );
      state.partyMaster[findIndex] = action.payload;
    },
    deletePartyMaster: (state: any, action) => {
      state.partyMaster = state.partyMaster.filter(
        (item: any) => item.id !== action.payload.id
      );
    },
  },
});
export const {
  setPartyMaster,
  addPartyMaster,
  editpartyMaster,
  deletePartyMaster,
} = partyMasterSlice.actions;

const partyMasterReducer = partyMasterSlice.reducer;
export default partyMasterReducer;
