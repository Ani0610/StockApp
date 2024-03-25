import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  toast:{
    message:'',
    isVisible:false,
    type:''
  }
};
const uiSlice = createSlice({
  name: "SET_USER_INTERFACE",
  initialState,
  reducers: {
    setLoading: (state: any, action) => {
      state.isLoading = action.payload;
    },
    setToast:(state:any,action)=>{
      state.toast=action.payload;
    }
  },
});
export const { setLoading,setToast } = uiSlice.actions;

const uiReducer = uiSlice.reducer;
export default uiReducer;
