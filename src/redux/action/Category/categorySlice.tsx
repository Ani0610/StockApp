import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
};
const categorySlice = createSlice({
  name: "SET_CATEGORY",
  initialState,
  reducers: {
    setCategory: (state: any, action) => {
      state.categories = action.payload;
    },
    addCategory: (state: any, action) => {
      state.categories = [...state.categories, action.payload];
    },
    editCategory: (state: any, action) => {
      const findIndex = state.categories.findIndex(
        (item: any) => item.id === action.payload.id
      );
      state.categories[findIndex] = action.payload;
    },
    deleteCategory: (state: any, action) => {
      state.categories = state.categories.filter(
        (item: any) => item.id !== action.payload.id
      );
    },
  },
});
export const { setCategory, addCategory, editCategory, deleteCategory } =
  categorySlice.actions;

const categoryReducer = categorySlice.reducer;
export default categoryReducer;
