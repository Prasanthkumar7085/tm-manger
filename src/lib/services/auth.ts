import { $fetch } from "../fetch";

export const loginAPI = async (payload: {
  email: string;
  password: string;
}) => {
  try {
    const response = await $fetch.post("/auth/login", payload);
    return response;
  } catch (err) {
    throw err;
  }
};
export const forgotAPI = async (payload: {
  email: string;
}) => {
  try {
    const response = await $fetch.post("/auth/forgot-password", payload);
    return response;
  } catch (err) {
    throw err;
  }
};
