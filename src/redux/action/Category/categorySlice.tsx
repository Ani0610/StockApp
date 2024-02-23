import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categoryes: [],
};
const categorySlice = createSlice({
  name: "SET_CATEGORY",
  initialState,
  reducers: {
    setCategory: (state: any, action) => {
      state.categoryes = action.payload;
    },
    addCategory: (state: any, action) => {
      state.categoryes = [...state.categoryes, action.payload];
    },
    editCategory: (state: any, action) => {
      const findIndex = state.categoryes.findIndex(
        (item: any) => item.id === action.payload.id
      );
      state.categoryes[findIndex] = action.payload;
    },
    deleteCategory: (state: any, action) => {
      state.categoryes = state.categoryes.filter(
        (item: any) => item.id !== action.payload.id
      );
    },
  },
});
export const { setCategory, addCategory, editCategory, deleteCategory } =
  categorySlice.actions;

const categoryReducer = categorySlice.reducer;
export default categoryReducer;
