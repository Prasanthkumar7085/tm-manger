import { $fetch } from "../fetch";
interface GetAllPaginatedUsersPropTypes {
  pageIndex: number;
  pageSize: number;
  order_by: any;
  search: any;
}
export const getAllPaginatedUsers = async ({
  pageIndex,
  pageSize,
  order_by,
  search,
}: GetAllPaginatedUsersPropTypes) => {
  try {
    const queryParams = {
      page: pageIndex,
      page_size: pageSize,
      order_by: order_by,
      search_string: search,
    };
    return await $fetch.get("/users", queryParams);
  } catch (err) {
    throw err;
  }
};
export const addUsersAPI = async (payload: any) => {
  try {
    return await $fetch.post(`/users`, payload);
  } catch (err) {
    throw err;
  }
};
export const deleteUsersAPI = async (id: string) => {
  try {
    return await $fetch.delete(`/users/${id}`);
  } catch (err) {
    throw err;
  }
};
export const updateUserStatueAPI = async (userId: any, payload: any) => {
  try {
    return await $fetch.patch(`/users/${userId}/status`, payload);
  } catch (err) {
    throw err;
  }
};
export const updateUserSelectStatueAPI = async (userId: any, payload: any) => {
  try {
    return await $fetch.patch(`/users/${userId}/status`, payload);
  } catch (err) {
    throw err;
  }
};
export const resetPasswordUsersAPI = async (id: string, payload: any) => {
  try {
    return await $fetch.patch(`/users/${id}/reset-password`, payload);
  } catch (err) {
    throw err;
  }
};
export const getSingleUserAPI = async (id: string | undefined) => {
  const queryParams = {
    metadata: true,
  };
  try {
    return await $fetch.get(`/users/${id}`, queryParams);
  } catch (err) {
    throw err;
  }
};
export const updateUsersAPI = async (id: any, payload: any) => {
  try {
    return await $fetch.patch(`/users/${id}`, payload);
  } catch (err) {
    throw err;
  }
};
export const deleteProjectAPI = async (id: number) => {
  try {
    return await $fetch.delete(`/projects/${id}`);
  } catch (err) {
    throw err;
  }
};
