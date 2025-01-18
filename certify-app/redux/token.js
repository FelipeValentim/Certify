import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "token",
  initialState: null,
  reducers: {
    signIn: (_, action) => {
      return action.payload;
    },
    signOut: () => {
      return null;
    },
  },
});

export const { signIn, signOut } = slice.actions;
export default slice.reducer;
