import { $fetch } from "../fetch";
interface GetAllPaginatedUsersPropTypes {
  pageIndex: number;
  pageSize: number;
  order_by: any;
  search: any;
  active: any;
}

export const getAllPaginatedUsers = async ({
  pageIndex,
  pageSize,
  order_by,
  search,
  active,
}: GetAllPaginatedUsersPropTypes) => {
  try {
    const queryParams = {
      page: pageIndex,
      page_size: pageSize,
      order_by: order_by,
      search_string: search,
      active: active,
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
export const updatePasswordUsersAPI = async (payload: any) => {
  try {
    return await $fetch.patch(`/users/update-password`, payload);
  } catch (err) {
    throw err;
  }
};
export const getAllPaginatedUsersAPI = async ({ pageIndex, pageSize }: any) => {
  try {
    const queryParams = {
      page: pageIndex,
      page_size: pageSize,
    };
    return await $fetch.get("/users", queryParams);
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
