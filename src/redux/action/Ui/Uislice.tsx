import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};
const uiSlice = createSlice({
  name: "SET_USER_INTERFACE",
  initialState,
  reducers: {
    setLoading: (state: any, action) => {
      state.isLoading = action.payload;
    },
  },
});
export const { setLoading } = uiSlice.actions;

const uiReducer = uiSlice.reducer;
export default uiReducer;
