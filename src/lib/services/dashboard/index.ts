import { $fetch } from "@/lib/fetch";

export const getTotalProjectsStats = async () => {
  try {
    return await $fetch.get(`/stats/total-projects`);
  } catch (err: any) {
    throw err;
  }
};

export const getTotalUsersStats = async () => {
  try {
    return await $fetch.get(`/stats/total-users`);
  } catch (err: any) {
    throw err;
  }
};
export const getTotalTasksStats = async () => {
  try {
    return await $fetch.get(`/stats/total-tasks`);
  } catch (err: any) {
    throw err;
  }
};
export const getTotalActiveStats = async () => {
  try {
    return await $fetch.get(`/stats/total-active-tasks`);
  } catch (err: any) {
    throw err;
  }
};
export const getTaskTrendsAPI = async () => {
  try {
    return await $fetch.get(`/stats/tasks-trend`);
  } catch (err: any) {
    throw err;
  }
};
