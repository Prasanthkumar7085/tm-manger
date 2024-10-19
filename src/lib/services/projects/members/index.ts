import { $fetch } from "@/lib/fetch";

export const addMembersAPI = async (projectId: any, payload: any) => {
  try {
    return await $fetch.post(`/projects/${projectId}/members`, payload);
  } catch (err: any) {
    throw err;
  }
};
