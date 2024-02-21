import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  deliveredDesigns: [],
};
const deliveredDesignSlice = createSlice({
  name: "SET_DELIVERED_DESIGN",
  initialState,
  reducers: {
    setDeliveredDesign: (state: any, action) => {
      state.deliveredDesigns = action.payload;
    },
    addDeliveredDesign: (state: any, action) => {
      const data: any = state.deliveredDesigns.find(
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
        const findIndex = state.deliveredDesigns.findIndex(
          (item: any) => item.id === data.id
        );
        state.deliveredDesigns[findIndex] = newData;
      } else {
        state.deliveredDesigns = [...state.deliveredDesigns, action.payload];
      }
    },
    addMaster: (state: any, action) => {
      console.log("action", action.payload);
      state.deliveredDesigns = [...state.deliveredDesigns, action.payload];
    },
    editDeliveredDesign: (state: any, action) => {
      const findIndex = state.deliveredDesigns.findIndex(
        (item: any) => item.id === action.payload.id
      );
      state.deliveredDesigns[findIndex] = action.payload;
    },
    deleteDeliveredDesign: (state: any, action) => {
      state.deliveredDesigns = state.deliveredDesigns.filter(
        (item: any) => item.id !== action.payload.id
      );
    },
  },
});
export const {
  setDeliveredDesign,
  addDeliveredDesign,
  editDeliveredDesign,
  deleteDeliveredDesign,
} = deliveredDesignSlice.actions;

const deliveredDesignReducer = deliveredDesignSlice.reducer;
export default deliveredDesignReducer;
