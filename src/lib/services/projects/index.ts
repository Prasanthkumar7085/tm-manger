import { $fetch } from "@/lib/fetch";

interface GetAllPaginatedUsersPropTypes {
  pageIndex: number;
  pageSize: number;
  order_by: any;
  search_string: any;
  projectId: any;
  status: any;
  from_date: any;
  to_date: any;
}

export const getAllPaginatedProjectss = async ({
  pageIndex,
  pageSize,
  order_by,
  search_string,
  status,
  from_date,
  to_date,
}: GetAllPaginatedUsersPropTypes) => {
  try {
    const queryParams = {
      page: pageIndex,
      page_size: pageSize,
      order_by: order_by,
      search_string: search_string,
      status: status,
      from_date,
      to_date,
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

export const getDropDownForProjects = async () => {
  try {
    return await $fetch.get(`/projects/projects-all`);
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
