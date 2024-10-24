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

export const getAllMembers = async (projectId: any) => {
  try {
    // const queryParams = {
    //   page: pageIndex,
    //   page_size: pageSize,
    //   order_by: order_by,
    // };

    return await $fetch.get(`projects/${projectId}/members`);
  } catch (err) {
    throw err;
  }
};
