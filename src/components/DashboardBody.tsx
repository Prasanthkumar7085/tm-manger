import { useEffect, useState } from "react";
import { TextField, Icon } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import {
  PieChart,
  BarChart,
  Users,
  ClipboardCheck,
  Loader,
} from "lucide-react"; // Lucide icons used
import Tasks from "./Tasks";

export type StatsAndGraphType = {
  className?: string;
};

const DashBoard: any = ({ className = "" }) => {
  const [tasksData, setTasksData] = useState<any>(null);
  const [statsData, setStatsData] = useState({
    projects: 0,
    tasks: 0,
    users: 0,
    active_tasks: 0,
  });

  const options = {
    title: {
      text: "Tasks Chart",
    },
    xAxis: {
      categories: tasksData?.days,
    },
    yAxis: {
      title: {
        text: "Number of Tasks",
      },
    },
    series: [
      {
        name: "Completed",
        data: tasksData?.completed,
        color: "rgba(75, 192, 192, 1)",
      },
      {
        name: "Pending",
        data: tasksData?.pending,
        color: "rgba(255, 99, 132, 1)",
      },
    ],
  };

  useEffect(() => {
    // Fetch stats and tasks data here
  }, []);

  return (
    <div className={`p-4 space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center space-x-4 p-4 bg-white shadow-lg rounded-lg">
          <PieChart className="w-10 h-10 text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold">{statsData?.projects}</h1>
            <p className="text-gray-600">Projects</p>
          </div>
        </div>

        {/* Tasks */}
        <div className="flex items-center space-x-4 p-4 bg-white shadow-lg rounded-lg">
          <ClipboardCheck className="w-10 h-10 text-green-500" />
          <div>
            <h1 className="text-2xl font-bold">{statsData?.tasks}</h1>
            <p className="text-gray-600">Tasks</p>
          </div>
        </div>

        {/* Users */}
        <div className="flex items-center space-x-4 p-4 bg-white shadow-lg rounded-lg">
          <Users className="w-10 h-10 text-purple-500" />
          <div>
            <h1 className="text-2xl font-bold">{statsData?.users}</h1>
            <p className="text-gray-600">Users</p>
          </div>
        </div>

        {/* Active Tasks */}
        <div className="flex items-center space-x-4 p-4 bg-white shadow-lg rounded-lg">
          <Loader className="w-10 h-10 text-red-500" />
          <div>
            <h1 className="text-2xl font-bold">{statsData?.active_tasks}</h1>
            <p className="text-gray-600">Active Tasks</p>
          </div>
        </div>
      </div>

      {/* <div className="bg-white shadow-lg rounded-lg p-6">
        <header className="mb-4">
          <h2 className="text-xl font-bold">Tasks</h2>
        </header>

        {/* <HighchartsReact highcharts={Highcharts} options={options} /> */}

      {/* <div className="flex justify-around mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-teal-500"></div>
          <p className="text-gray-600">Completed</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-pink-500"></div>
          <p className="text-gray-600">Pending</p>
        </div>
      </div> */}
      {/* </div> */}
      <Tasks />
    </div>
  );
};

export default DashBoard;
