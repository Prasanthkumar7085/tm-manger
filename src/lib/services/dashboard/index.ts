import { $fetch } from "@/lib/fetch";

export const getTotalProjectsStats = async (queryParams: any) => {
  try {
    return await $fetch.get(`/stats/total-projects`, queryParams);
  } catch (err: any) {
    throw err;
  }
};

export const getTotalUsersStats = async (queryParams: any) => {
  try {
    return await $fetch.get(`/stats/total-users`, queryParams);
  } catch (err: any) {
    throw err;
  }
};
export const getTotalTasksStats = async (queryParams: any) => {
  try {
    return await $fetch.get(`/stats/total-tasks`, queryParams);
  } catch (err: any) {
    throw err;
  }
};
export const getTotalActiveStats = async (queryParams: any) => {
  try {
    return await $fetch.get(`/stats/total-active-tasks`, queryParams);
  } catch (err: any) {
    throw err;
  }
};
export const getTaskTrendsAPI = async (queryparams: any) => {
  try {
    return await $fetch.get(`/stats/tasks-trend`, queryparams);
  } catch (err: any) {
    throw err;
  }
};
export const getAllProjectStats = async () => {
  try {
<<<<<<< HEAD
    return await $fetch.get(`/projects/tasks-stats`,)
=======
    return await $fetch.get(`/projects/tasks-stats`);
>>>>>>> 904cadd1093bbce0b30966112de94631cfca6614
  } catch (err: any) {
    throw err;
  }
};
