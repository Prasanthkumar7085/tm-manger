import { $fetch } from "../fetch";
interface GetAllPaginatedUsersPropTypes {
  pageIndex: number;
  pageSize: number;
  order_by: any;
  search_string: any;
  from_date: string;
  to_date: string;
  status: string;
  priority: string;
  project_id: any;
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
export const getSingleTaskAPI = async (taskId: any) => {
  try {
    return await $fetch.get(`/tasks/${taskId}`);
  } catch (err) {
    throw err;
  }
};

export const getTasksBasedTagsAPI = async (taskId: any) => {
  try {
    return await $fetch.get(`/tasks/${taskId}/tags`);
  } catch (err) {
    throw err;
  }
};
export const getTagsAPI = async (taskId: any) => {
  try {
    return await $fetch.get(`/tasks/${taskId}/tags`);
  } catch (err) {
    throw err;
  }
};
export const addTagAPI = async (taskId: any, payload: any) => {
  try {
    return await $fetch.post(`/tasks/${taskId}/tags`, payload);
  } catch (err) {
    throw err;
  }
};

export const removeTagAPI = async (tagId: string) => {
  try {
    return await $fetch.delete(`/tasks/${tagId}/tags`);
  } catch (err) {
    throw err;
  }
};
export const statusUpdateAPI = async (
  task_id: string,
  body: { status: string }
) => {
  try {
    return await $fetch.put(`/tasks/${task_id}/status`, body);
  } catch (err: any) {
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
export const addAttachmentsAPI = async (payload: any) => {
  try {
    return await $fetch.post(`/tasks/attachments`, payload);
  } catch (err: any) {
    throw err;
  }
};
export const getAttachmentsAPI = async (taskId: any) => {
  try {
    return await $fetch.get(`/tasks/${taskId}/attachments`);
  } catch (err: any) {
    throw err;
  }
};
export const uploadAttachmentAPI = async (payload: any) => {
  try {
    return await $fetch.post(`/tasks/attachments `, payload);
  } catch (err: any) {
    throw err;
  }
};
export const deleteAttachmentsAPI = async (taskId: any, id: string) => {
  try {
    return await $fetch.delete(`/tasks/${taskId}/attachments/${id}`);
  } catch (err: any) {
    throw err;
  }
};
export const getAssignesAPI = async (taskId: any) => {
  try {
    return await $fetch.get(`/tasks/${taskId}/assignees`);
  } catch (err: any) {
    throw err;
  }
};
export const addAssignesAPI = async (taskId: any, payload: any) => {
  try {
    return await $fetch.post(`/tasks/${taskId}/assignees`, payload);
  } catch (err: any) {
    throw err;
  }
};
export const deleteAssignesAPI = async (assigneId: any) => {
  try {
    return await $fetch.delete(`/tasks/${assigneId}/assignees`);
  } catch (err: any) {
    throw err;
  }
};

export const downloadAttachmentAPI = async (payload: any) => {
  try {
    return await $fetch.post(`/files/download`, payload);
  } catch (err: any) {
    throw err;
  }
};

export const getTaskStatsCountsAPI = async () => {
  try {
    return await $fetch.get(`/tasks/tasks-stats`);
  } catch (err: any) {
    throw err;
  }
};
