import { $fetch } from "@/lib/fetch";

interface GetAllPaginatedUsersPropTypes {
  pageIndex: number;
  pageSize: number;
  order_by: any;
  search: any;
}

export const getAllPaginatedProjectss = async ({
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
    return await $fetch.get("/projects", queryParams);
  } catch (err) {
    throw err;
  }
};
export const addProjectAPI = async (payload: any) => {
  try {
    return await $fetch.post("/projects", payload);
  } catch (err: any) {
    throw err;
  }
};
export const updateProjectAPI = async (projectId: any, payload: any) => {
  try {
    return await $fetch.post(`/projects/${projectId}`, payload);
  } catch (err: any) {
    throw err;
  }
};
export const viewProjectAPI = async (projectId: any) => {
  try {
    return await $fetch.post(`/projects/${projectId}`);
  } catch (err: any) {
    throw err;
  }
};
