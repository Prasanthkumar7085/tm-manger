import { $fetch } from "@/lib/fetch";

interface GetAllPaginatedUsersPropTypes {
  pageIndex: number;
  pageSize: number;
  order_by: any;
}

export const addMembersAPI = async (projectId: any, payload: any) => {
  try {
    return await $fetch.post(`/projects/${projectId}/members`, payload);
  } catch (err: any) {
    throw err;
  }
};

export const getAllMembers = async () => {
  try {
    return await $fetch.get(`/users/all`);
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
