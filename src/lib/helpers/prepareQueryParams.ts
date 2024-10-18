export interface apiPropsForQueryParams {
  page: string | number;
  limit: string | number;
  sort_by: string,
  sort_type: string,
}

export const prepareQueryParams = (params: Partial<apiPropsForQueryParams>) => {
  let queryParams: any = { page: params.page, limit: params.limit, sort_by: params.sort_by, sort_type: params.sort_type };
  Object.entries(params).map(([key, value]: any) => {
    queryParams[key] = value;
  });

  return queryParams;
};