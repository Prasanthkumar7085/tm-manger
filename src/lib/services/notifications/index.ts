import { $fetch } from "@/lib/fetch";

interface GetAllPaginatedNotificationsPropTypes {
  current_page?: number;
  page_size?: number;
}


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
export const getAllNotificationsAPI = async ({
  current_page,
  page_size
}: GetAllPaginatedNotificationsPropTypes) => {
  try {
    const queryParams = {
      page: current_page,
      page_size: page_size,
    };
    return await $fetch.get(`/notifications`, queryParams);
  } catch (err: any) {
    throw err;
  }
};

export const markAsReadAPI = async (markId: any) => {
  try {
    return await $fetch.patch(`/notifications/${markId}/mark-as-read`);
  } catch (err) {
    throw err;
  }
};