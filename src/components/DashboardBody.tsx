import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import StatsAndGraph from "./StatsAndGraphs";
import Tasks from "./Tasks";
import DatePickerField from "./core/DateRangePicker";
import dahboardProjectIcon from "@/assets/dashboard-project-icon.svg";
import dahboardTaskIcon from "@/assets/dashboard-task-icon.svg";
import dashboardUsersIcon from "@/assets/dashboard-users-icon.svg";
import dashboardActiveTaskIcon from "@/assets/dashboard-active-icon.svg";
import CountUp from "react-countup";
import {
  getTotalProjectsStats,
  getTotalUsersStats,
  getTotalTasksStats,
  getTotalActiveStats,
} from "@/lib/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "./core/LoadingComponent";
import { changeDateToUTC } from "@/lib/helpers/apiHelpers";
import ProjectDataTable from "./ProjectWiseStats";

const formatDate = (date: any) => {
  return date.toISOString().split("T")[0];
};

const DashBoard = () => {
  const [selectedDate, setSelectedDate] = useState([new Date(), new Date()]);

  // Ensure the date is set to today each time the dashboard loads
  useEffect(() => {
    const today = new Date();
    setSelectedDate([today, today]);
  }, []);

  const fetchCounts = async (fromDate: any, toDate: any) => {
    const results = await Promise.allSettled([
      getTotalProjectsStats({
        from_date: formatDate(fromDate),
        to_date: formatDate(toDate),
      }),
      getTotalTasksStats({
        from_date: formatDate(fromDate),
        to_date: formatDate(toDate),
      }),
      getTotalUsersStats({
        from_date: formatDate(fromDate),
        to_date: formatDate(toDate),
      }),
      getTotalActiveStats({
        from_date: formatDate(fromDate),
        to_date: formatDate(toDate),
      }),
    ]);
    return results;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["getTotalCounts", selectedDate],
    queryFn: () => fetchCounts(selectedDate[0], selectedDate[1]),
    enabled: !!selectedDate,
  });

  const handleDateChange = (fromDate: any, toDate: any) => {
    if (fromDate && toDate) {
      const [fromDateUTC, toDateUTC] = changeDateToUTC(fromDate, toDate);
      setSelectedDate([fromDateUTC, toDateUTC]);
    } else {
      const today = new Date();
      setSelectedDate([today, today]);
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

  return (
    <div className="h-full overflow-auto p-4">
      <div className="grid grid-cols-[60%_40%] gap-3">
        <Card className="p-6 bg-white shadow-lg rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Stats</h2>
            <DatePickerField
              value={selectedDate}
              onChangeData={handleDateChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-red-100 rounded-lg text-center shadow-sm">
              <div className="flex justify-center items-center mb-4">
                <img
                  src={dahboardProjectIcon}
                  alt="logo"
                  className="h-[33px] w-[33px]"
                />
              </div>
              <h1 className="text-3xl font-semibold text-gray-800">
                <CountUp end={projectsCount} duration={2.5} />
              </h1>
              <p className="text-sm text-gray-600">Projects</p>
            </div>

            <div className="p-4 bg-yellow-100 rounded-lg text-center shadow-sm">
              <div className="flex justify-center items-center mb-4">
                <img
                  src={dahboardTaskIcon}
                  alt="logo"
                  className="h-[33px] w-[33px]"
                />
              </div>
              <h1 className="text-3xl font-semibold text-gray-800">
                <CountUp end={tasksCount} duration={2.5} />
              </h1>
              <p className="text-sm text-gray-600">Tasks</p>
            </div>

            <div className="p-4 bg-purple-100 rounded-lg text-center shadow-sm">
              <div className="flex justify-center items-center mb-4">
                <img
                  src={dashboardUsersIcon}
                  alt="logo"
                  className="h-[33px] w-[33px]"
                />
              </div>
              <h1 className="text-3xl font-semibold text-gray-800">
                <CountUp end={usersCount} duration={2.5} />
              </h1>
              <p className="text-sm text-gray-600">Users</p>
            </div>

            <div className="p-4 bg-green-100 rounded-lg text-center shadow-sm">
              <div className="flex justify-center items-center mb-4">
                <img
                  src={dashboardActiveTaskIcon}
                  alt="logo"
                  className="h-[33px] w-[33px]"
                />
              </div>
              <h1 className="text-3xl font-semibold text-gray-800">
                <CountUp end={activeUsersCount} duration={2.5} />
              </h1>
              <p className="text-sm text-gray-600">Active Tasks</p>
            </div>
          </div>
        </Card>
        <Card className="h-[100%] p-2 bg-white shadow-lg rounded-lg">
          <StatsAndGraph />
        </Card>
      </div>
      <Card className="mt-6 bg-white shadow-lg rounded-lg">
        <ProjectDataTable />
      </Card>
      {/* <LoadingComponent loading={isLoading} /> */}
    </div>
  );
};

export default DashBoard;
