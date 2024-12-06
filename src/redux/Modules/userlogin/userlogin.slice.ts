"use client";
import { createSlice } from "@reduxjs/toolkit";
import { IReduxUserLogin } from "./userlogin";

const reducerName = "auth";

export const initialState: IReduxUserLogin.IInitialLoginState = {
  user: {},
  emailWhilePasswordReset: "",
  refId: "",
  subRefId: "",
};

export const userLoginSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    setUserDetails: (state: any, action: any) => {
      state.user = { ...action.payload };
    },

    removeUserDetails: (state: any) => {
      state.user = {};
    },
    setProfileDetails: (state: any, action: any) => {
      state.profile = action.payload;
    },
    deleteProfileDetails: (state: any) => {
      state.profile = {};
    },
    setRefId: (state: any, action: any) => {
      state.refId = action.payload;
    },
    setSubRefId: (state: any, action: any) => {
      state.subRefId = action.payload;
    },

    setSelectId: (state: any, action: any) => {
      state.selectId = action.payload;
    },
    deleteSetSubRefId: (state: any) => {
      state.subRefId = "";
    },
  },
});

export const {
  setUserDetails,
  removeUserDetails,
  setProfileDetails,
  deleteProfileDetails,
  setRefId,
  setSubRefId,
  deleteSetSubRefId,
} = userLoginSlice.actions;

export const userLoginSliceReducer = { [reducerName]: userLoginSlice.reducer };
