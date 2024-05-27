import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "token",
  initialState: null,
  reducers: {
    setToken: (_, action) => {
      return action.payload;
    },
    removeToken: () => {
      return null;
    },
  },
});

export const { setToken, removeToken } = slice.actions;
export default slice.reducer;
