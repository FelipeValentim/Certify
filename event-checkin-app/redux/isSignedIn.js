import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "isSignedIn",
  initialState: false,
  reducers: {
    signIn: () => {
      return true;
    },
    signOut: () => {
      return false;
    },
  },
});

export const { signIn, signOut } = slice.actions;
export default slice.reducer;
