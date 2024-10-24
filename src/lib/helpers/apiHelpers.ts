import dayjs from "dayjs";

export const changeDateToUTC = (fromDate: any, toDate: any) => {
  const fromDateUTC = dayjs(fromDate).toDate();
  const toDateUTC = dayjs(toDate).toDate();
  return [fromDateUTC, toDateUTC];
};
