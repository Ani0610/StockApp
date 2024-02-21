import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  designsMaster: [],
};
const designMasterSlice = createSlice({
  name: "SET_DESIGN_MASTER",
  initialState,
  reducers: {
    setDesignMaster: (state: any, action) => {
      state.designsMaster = action.payload;
    },
    addDesignMaster: (state: any, action) => {
      const data: any = state.designsMaster.find(
        (obj: any) =>
          obj.partyUID === action.payload.partyUID &&
          obj.designNo == action.payload.designNo
      );

      if (data) {
        const newData = {
          ...data,
          availableStocks:
            Number(data.availableStocks) +
            Number(action.payload.availableStocks),
        };

        const findIndex = state.designsMaster.findIndex(
          (item: any) => item.id === data.id
        );
        state.designsMaster[findIndex] = newData;
      } else {
        state.designsMaster = [...state.designsMaster, action.payload];
      }
    },
    addMaster: (state: any, action) => {
      console.log("action", action.payload);
      state.designsMaster = [...state.designsMaster, action.payload];
    },
    editDesignMaster: (state: any, action) => {
      const findIndex = state.designsMaster.findIndex(
        (item: any) => item.id === action.payload.id
      );
      state.designsMaster[findIndex] = action.payload;
    },
    deleteDesignMaster: (state: any, action) => {
      state.designsMaster = state.designsMaster.filter(
        (item: any) => item.id !== action.payload.id
      );
    },
  },
});
export const {
  setDesignMaster,
  addDesignMaster,
  editDesignMaster,
  deleteDesignMaster,
} = designMasterSlice.actions;

const designMasterReducer = designMasterSlice.reducer;
export default designMasterReducer;
