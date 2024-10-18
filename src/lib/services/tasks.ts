import { $fetch } from "../fetch";
interface GetAllPaginatedUsersPropTypes {
  pageIndex: number;
  pageSize: number;
  order_by: any;
  search: any;
}

export const getAllPaginatedTasks = async ({
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
    return await $fetch.get("/tasks", queryParams);
  } catch (err) {
    throw err;
  }
};
export const getSingleTaskAPI = async (taskId: string) => {
  try {
    return await $fetch.get(`/tasks/${taskId}`);
  } catch (err) {
    throw err;
  }
};
export const addTasksAPI = async (payload: any) => {
  try {
    return await $fetch.post(`/tasks`, payload);
  } catch (err) {
    throw err;
  }
};
export const updateTasksAPI = async (taskId: any, payload: any) => {
  try {
    return await $fetch.patch(`/tasks/${taskId}`, payload);
  } catch (err) {
    throw err;
  }
};
export const postCommentsAPI = async (taskId: any, payload: any) => {
  try {
    return await $fetch.post(`/tasks/${taskId}/comments`, payload);
  } catch (err: any) {
    throw err;
  }
};
export const getCommentsAPI = async (taskId: any) => {
  try {
    return await $fetch.get(`/tasks/${taskId}/comments`);
  } catch (err: any) {
    throw err;
  }
};
