import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  selectedId: string | null;
  refId: null;
  subRefId: null;
}

const initialState: UserState = {
  selectedId: null,
  refId: null,
  subRefId: null,
};

const userSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setSelectedId(state, action: PayloadAction<string>) {
      state.selectedId = action.payload;
    },
    setRefId: (state: any, action: any) => {
      state.refId = action.payload;
    },
    setSubRefId: (state: any, action: any) => {
      state.subRefId = action.payload;
    },
    deleteSetSubRefId: (state: any) => {
      state.subRefId = "";
    },
  },
});

export const { setSelectedId, setRefId, setSubRefId, deleteSetSubRefId } =
  userSlice.actions;

export default userSlice.reducer;
