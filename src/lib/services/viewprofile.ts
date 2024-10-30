import { $fetch } from "../fetch";

export const getSingleViewUserAPI = async (id: string | undefined) => {
     const queryParams = {
       metadata: true,
     };
    try {
      return await $fetch.get(`/users/${id}`,queryParams);
    } catch (err) {
      throw err;
    }
  };