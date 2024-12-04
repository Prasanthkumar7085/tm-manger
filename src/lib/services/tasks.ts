import { $fetch } from "../fetch";
interface GetAllPaginatedUsersPropTypes {
  pageIndex?: number;
  pageSize?: number;
  order_by?: any;
  search_string?: any;
  from_date?: string;
  to_date?: string;
  status?: string;
  priority?: string;
  project_id?: any;
  user_ids?: any;
  is_archived?: any;
  tags?: any;
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
  user_ids,
  is_archived,
  tags,
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
      user_ids: user_ids,
      is_archived,
      tags,
    };
    if (is_archived === "true" || is_archived === true) {
      return await $fetch.get("/tasks/archives", queryParams);
    } else {
      return await $fetch.get("/tasks/all", queryParams);
    }
  } catch (err) {
    throw err;
  }
};

export const getAllSubTasks = async (taskId: any) => {
  try {
    return await $fetch.get(`/tasks/${taskId}/sub-tasks`);
  } catch (err: any) {
    throw err;
  }
};
export const getAllSubTask = async (
  taskId: any,
  {
    pageIndex,
    pageSize,
    order_by,
    search_string,
    from_date,
    to_date,
    status,
    priority,
    project_id,
    user_ids,
    is_archived,
    tags,
  }: GetAllPaginatedUsersPropTypes
) => {
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
      user_ids: user_ids,
      is_archived,
      tags,
    };
    if (is_archived === "true" || is_archived === true) {
      return await $fetch.get("/tasks/archives", queryParams);
    } else {
      return await $fetch.get(`/tasks/${taskId}/sub-tasks`, queryParams);
    }
  } catch (err) {
    throw err;
  }
};

export const getAllArchivedTasks = async ({
  pageIndex,
  pageSize,
  order_by,
  search_string,
  from_date,
  to_date,
  status,
  priority,
  project_id,
  user_ids,
  is_archived,
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
      user_ids: user_ids,
      is_archived,
    };
    return await $fetch.get("/tasks/all", queryParams);
  } catch (err) {
    throw err;
  }
};

export const getAssignesListAPI = async () => {
  try {
    return await $fetch.get("/tasks/all");
  } catch (err: any) {
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
export const getActivityLogsAPI = async (taskId: any) => {
  try {
    return await $fetch.get(`/tasks/${taskId}/task-activities`);
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

export const getTagsDropdownAPI = async () => {
  try {
    return await $fetch.get(`/tasks/tags-drop-down`);
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

export const priorityUpdateAPI = async (
  task_id: string,
  body: { priority: string }
) => {
  try {
    return await $fetch.put(`/tasks/${task_id}/priority`, body);
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

export const addSubTasksAPI = async (payload: any) => {
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
export const addCommentsAPI = async (task_id: any, payload: any) => {
  try {
    return await $fetch.post(`/tasks/${task_id}/comments`, payload);
  } catch (err: any) {
    throw err;
  }
};

export const deleteCommentsAPI = async (task_id: any, commet_id: any) => {
  try {
    return await $fetch.delete(`/tasks/${task_id}/comments/${commet_id}`);
  } catch (err: any) {
    throw err;
  }
};

export const updateCommentsAPI = async (
  task_id: any,
  commet_id: any,
  payload: any
) => {
  try {
    return await $fetch.patch(
      `/tasks/${task_id}/comments/${commet_id}`,
      payload
    );
  } catch (err: any) {
    throw err;
  }
};
export const getCommentsForTaskAPI = async (task_id: any) => {
  try {
    return await $fetch.get(`/tasks/${task_id}/comments`);
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
export const archiveTaskAPI = async (id: string) => {
  try {
    return await $fetch.patch(`/tasks/${id}/archive`);
  } catch (err: any) {
    throw err;
  }
};
export const unArchiveTaskAPI = async (id: string) => {
  try {
    return await $fetch.patch(`/tasks/${id}/restore`);
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

export const getTaskArchivedStatsCountsAPI = async () => {
  try {
    return await $fetch.get(`/tasks/archived-tasks-stats`);
  } catch (err: any) {
    throw err;
  }
};
