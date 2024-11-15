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
  user_ids?: any;
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
    };
    return await $fetch.get("/tasks/all", queryParams);
  } catch (err) {
    throw err;
  }
};
