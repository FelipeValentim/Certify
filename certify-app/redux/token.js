import { createSlice } from "@reduxjs/toolkit";
import { removeToken, setToken } from "@/storage/SecurityStorage";

const slice = createSlice({
  name: "token",
  initialState: null,
  reducers: {
    signIn: (_, action) => {
      setToken(action.payload);
      return action.payload;
    },
    signOut: () => {
      removeToken();
      return null;
    },
  },
});

export const { signIn, signOut } = slice.actions;
export default slice.reducer;
