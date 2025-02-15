import dahboardProjectIcon from "@/assets/dashboard-project-icon.svg";
import dahboardTaskIcon from "@/assets/dashboard-task-icon.svg";
import dashboardUsersIcon from "@/assets/dashboard-users-icon.svg";
import { Card } from "@/components/ui/card";
import { changeDateToUTC } from "@/lib/helpers/apiHelpers";
import {
  getTotalActiveStats,
  getTotalProjectsStats,
  getTotalTasksStats,
  getTotalUsersStats,
} from "@/lib/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import { endOfMonth, startOfMonth } from "date-fns";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { useSelector } from "react-redux";
import ProjectDataTable from "./ProjectWiseStats";
import StatsAndGraph from "./StatsAndGraphs";
import DatePickerField from "./core/DateRangePicker";
import { useRouter } from "@tanstack/react-router";
type SelectedDate = [Date, Date];
interface ProfileData {
  user_type: string;
  [key: string]: any;
}
interface CountData {
  total: number;
}
const formatDate = (date: Date): string => {
  return dayjs(date).format("YYYY-MM-DD");
};
const DashBoard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<SelectedDate>([
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  ]);
  const router = useRouter();
  const [dateValue, setDateValue] = useState<SelectedDate | null>(null);
  const profileData = useSelector(
    (state: { auth: { user: { user_details: ProfileData } } }) =>
      state.auth.user.user_details
  );
  const fetchCounts = async (fromDate: Date, toDate: Date) => {
    const results = await Promise.allSettled([
      getTotalProjectsStats({
        from_date: formatDate(fromDate),
        to_date: formatDate(toDate),
      }),
      getTotalUsersStats({
        from_date: formatDate(fromDate),
        to_date: formatDate(toDate),
      }),
      getTotalTasksStats({
        from_date: formatDate(fromDate),
        to_date: formatDate(toDate),
      }),
      getTotalActiveStats({
        from_date: formatDate(fromDate),
        to_date: formatDate(toDate),
        status: "IN_PROGRESS",
      }),
    ]);
    return results;
  };
  const { data, isLoading } = useQuery({
    queryKey: ["getTotalCounts", selectedDate],
    queryFn: () =>
      fetchCounts(
        dayjs(selectedDate[0]).toDate(),
        dayjs(selectedDate[1]).toDate()
      ),
    enabled: !!selectedDate,
  });
  const handleDateChange = (
    fromDate: Date | null,
    toDate: Date | null
  ): void => {
    if (fromDate && toDate) {
      const [fromDateUTC, toDateUTC] = changeDateToUTC(fromDate, toDate);
      setDateValue([fromDateUTC, toDateUTC]);
      setSelectedDate([fromDateUTC, toDateUTC]);
    } else {
      setDateValue(null);
      setSelectedDate([startOfMonth(new Date()), endOfMonth(new Date())]);
    }
  };
  const projectsCount =
    data?.[0]?.status === "fulfilled" ? data[0].value.data.data?.total : 0;
  const usersCount =
    data?.[1]?.status === "fulfilled" ? data[1].value.data.data?.total : 0;
  const tasksCount =
    data?.[2]?.status === "fulfilled" ? data[2].value.data?.data?.total : 0;
  const activeUsersCount =
    data?.[3]?.status === "fulfilled" ? data[3].value.data.data?.total : 0;
  useEffect(() => {
    const today = new Date();
    setSelectedDate([startOfMonth(new Date()), new Date()]);
  }, []);
  return (
    <div className="h-full overflow-auto">
      <div className="grid grid-cols-[58%,auto] gap-3">
        <Card className="p-4 bg-white shadow-lg rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-sans font-medium text-gray-800">
              Stats
            </h2>
            <DatePickerField
              dateValue={selectedDate}
              onChangeData={handleDateChange}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div
              className="p-4 bg-[#FFE2E5] rounded-xl text-left shadow-sm cursor-pointer"
              onClick={() => {
                router.navigate({
                  to: `/projects`,
                });
              }}
            >
              <div className="flex justify-left items-center mb-6 ">
                <img
                  src={dahboardProjectIcon}
                  alt="Projects icon"
                  className="h-[33px] w-[33px]"
                />
              </div>
              <h1 className="text-2xl font-medium text-[#151D48]">
                <CountUp end={projectsCount} duration={2.5} />
              </h1>
              <p className="text-md font-normal text-[#425166]">Projects</p>
            </div>
            <div
              className="p-4 bg-[#FFF4DE] rounded-xl text-left shadow-sm cursor-pointer"
              onClick={() => router.navigate({ to: `/tasks` })}
            >
              <div className="flex justify-left items-center mb-6">
                <img
                  src={dahboardTaskIcon}
                  alt="Tasks icon"
                  className="h-[33px] w-[33px]"
                />
              </div>
              <h1 className="text-2xl font-medium text-[#151D48]">
                <CountUp end={tasksCount} duration={2.5} />
              </h1>
              <p className="text-md text-[#425166] font-normal">Tasks</p>
            </div>
            {profileData?.user_type !== "user" && (
              <div
                className="p-4 bg-[#F3E8FF] rounded-xl text-left shadow-sm cursor-pointer"
                onClick={() => {
                  router.navigate({
                    to: `/users`,
                  });
                }}
              >
                <div className="flex justify-left items-center mb-6">
                  <img
                    src={dashboardUsersIcon}
                    alt="Users icon"
                    className="h-[33px] w-[33px]"
                  />
                </div>
                <h1 className="text-2xl font-medium text-[#151D48]">
                  <CountUp end={usersCount} duration={2.5} />
                </h1>
                <p className="text-md text-[#425166] font-normal">Users</p>
              </div>
            )}
          </div>
        </Card>
        <Card className="p-4 h-[100%] bg-white shadow-lg rounded-lg">
          <StatsAndGraph />
        </Card>
      </div>
      <div className="card-container bg-white shadow-md rounded-lg border p-3 mt-3 ">
        <ProjectDataTable />
      </div>
    </div>
  );
};
export default DashBoard;
