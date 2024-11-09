import { $fetch } from "../fetch";

export const getSingleViewUserAPI = async (userId: string | undefined) => {
  const queryParams = {
    metadata: true,
  };
  try {
    return await $fetch.get(`/users/${userId}`, queryParams);
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
