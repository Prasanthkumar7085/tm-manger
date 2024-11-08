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
import { SelectTaskProjects } from "./core/CommonComponents/SelectTaskProjects";

const formatDate = (date: any) => {
  return date.toISOString().split("T")[0];
};

const DashBoard = () => {
  const [selectedDate, setSelectedDate] = useState([new Date(), new Date()]);
  const [selectedProject, setSelectedProject] = useState(null);

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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-[#FFE2E5] rounded-xl text-left shadow-sm">
              <div className="flex justify-left items-center mb-6">
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

            <div className="p-4 bg-[#FFF4DE] rounded-xl text-left shadow-sm">
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

            <div className="p-4 bg-[#F3E8FF] rounded-xl text-left shadow-sm">
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

            <div className="p-4 bg-[#DCFCE7] rounded-xl text-left shadow-sm">
              <div className="flex justify-left items-center mb-6">
                <img
                  src={dashboardActiveTaskIcon}
                  alt="Active Tasks icon"
                  className="h-[33px] w-[33px]"
                />
              </div>
              <h1 className="text-2xl font-medium text-[#151D48]">
                <CountUp end={activeUsersCount} duration={2.5} />
              </h1>
              <p className="text-md text-[#425166] font-normal">Active Tasks</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 h-[100%] bg-white shadow-lg rounded-lg">
          <StatsAndGraph />
        </Card>
      </div>

      <div className="card-container bg-white shadow-md rounded-lg border p-3 mt-3 ">
        {/* <div className="tasks-navbar flex justify-between items-center">
          <h2 className="text-lg font-sans font-medium text-gray-800">
            Tasks List
          </h2>
          <div className="filters">
            <ul className="flex justify-end space-x-3">
              <li>
                <SelectTaskProjects
                  selectedProject={selectedProject}
                  setSelectedProject={setSelectedProject}
                />
              </li>
              <li>
                <SelectTaskProjects
                  selectedProject={selectedProject}
                  setSelectedProject={setSelectedProject}
                />
              </li>
              <li>
                <SelectTaskProjects
                  selectedProject={selectedProject}
                  setSelectedProject={setSelectedProject}
                />
              </li>
            </ul>
          </div>
        </div> */}
        <ProjectDataTable />
      </div>
    </div>
  );
};

export default DashBoard;
