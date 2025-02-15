import { $fetch } from "../fetch";

export const getSingleViewUserAPI = async (userId: string | undefined) => {
  try {
    return await $fetch.get(`/users/${userId}`);
  } catch (err) {
    throw err;
  }
};
export const uploadProfileAPI = async (userId: any, payload: any) => {
  try {
    return await $fetch.patch(`/users/${userId}/profile-pic`, payload);
  } catch (err: any) {
    throw err;
  }
};
export const getSingleUserApi = async (userId: any) => {
  try {
    return await $fetch.get(`/users/${userId}`);
  } catch (err: any) {
    throw err;
  }
};
export const updateUserDetailsAPI = async (id: any, payload: any) => {
  try {
    return await $fetch.patch(`/users/${id}`, payload);
  } catch (err) {
    throw err;
  }
};
