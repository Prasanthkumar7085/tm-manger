import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  selectedId: string | null;
}

const initialState: UserState = {
  selectedId: null,
};

const userSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setSelectedId(state, action: PayloadAction<string>) {
      state.selectedId = action.payload;
    },
  },
});

export const { setSelectedId } = userSlice.actions;
export default userSlice.reducer;