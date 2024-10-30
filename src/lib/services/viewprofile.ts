import { $fetch } from "../fetch";

export const getSingleViewUserAPI = async () => {
     const queryParams = {
       metadata: true,
     };
    try {
      return await $fetch.get(`/users/6`,queryParams);
    } catch (err) {
      throw err;
    }
  };