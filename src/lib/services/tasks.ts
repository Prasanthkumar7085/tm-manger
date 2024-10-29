import { $fetch } from "../fetch";
interface GetAllPaginatedUsersPropTypes {
  pageIndex: number;
  pageSize: number;
  order_by: any;
  search_string: any;
  from_date: string;
  to_date: string;
  status:string;
  priority: string;
  project_id:any;
}

export const getAllPaginatedTasks = async ({
  pageIndex,
  pageSize,
  order_by,
  search_string,
  from_date,
  to_date,
  status,
  priority,
  project_id,
}: GetAllPaginatedUsersPropTypes) => {
  try {
    const queryParams = {
      page: pageIndex,
      page_size: pageSize,
      order_by: order_by,
      search_string: search_string,
      from_date: from_date,
      to_date: to_date,
      status: status,
      priority: priority,
      project_id: project_id,
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
export const addPostCommentsAPI = async (task_id: any, payload: any) => {
  try {
    return await $fetch.post(`/tasks/${task_id}/comments`, payload);
  } catch (err: any) {
    throw err;
  }
};
export const getCommentsAPI = async () => {
  try {
    return await $fetch.get(`/tasks/2/comments`);
  } catch (err: any) {
    throw err;
  }
};

export const getDropDownForProjectsTasksAPI = async () => {
  try {
    return await $fetch.get(`/projects/projects-all`);
  } catch (err: any) {
    throw err;
  }
};

export const deleteTaskAPI = async (id: string) => {
  try {
    return await $fetch.delete(`/tasks/${id}`);
  } catch (err: any) {
    throw err;
  }
};
