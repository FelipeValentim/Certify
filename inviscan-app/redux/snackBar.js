import { createSlice } from "@reduxjs/toolkit";

const defaultValue = {
  visible: false,
  duration: 5000,
  text: "Algum problema aconteceu",
};

const slice = createSlice({
  name: "snackBar",
  initialState: { ...defaultValue },
  reducers: {
    toast: (_, action) => {
      return { ...defaultValue, visible: true, text: action.payload };
    },
    close: () => {
      return { ...defaultValue, visible: false };
    },
  },
});

export const { toast, close } = slice.actions;
export default slice.reducer;
