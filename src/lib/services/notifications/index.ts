import { $fetch } from "@/lib/fetch";

// export const getAllNotificationsAPI = async (page: number, limit: number) => {
//   try {
//     return await $fetch.get(`/notifications`, {
//       params: {
//         page,
//         limit,
//       },
//     });
//   } catch (err: any) {
//     throw err;
//   }
// };
export const getAllNotificationsAPI = async (
  queryParams: any
) => {
  try {
    return await $fetch.get(`/notifications`, queryParams);
  } catch (err: any) {
    throw err;
  }
};