import { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

const StatsAndGraph = ({ className = "" }) => {
  const [tasksData, setTasksData] = useState(null);
  const [statsData, setStatsData] = useState({
    projects: 10,
    tasks: 20,
    users: 30,
    active_tasks: 40,
  });

  const options = {
    title: {
      text: "Tasks ",
    },
    xAxis: {
      categories: tasksData,
    },
    yAxis: {
      title: {
        text: "Number of Tasks",
      },
    },
    series: [
      {
        name: "Completed",
        data: tasksData,
        color: "rgba(75, 192, 192, 1)",
      },
      {
        name: "Pending",
        data: tasksData,
        color: "rgba(255, 99, 132, 1)",
      },
    ],
  };

  useEffect(() => {
    // Uncomment to fetch stats and tasks data
    // getAllStats();
    // getAllTasks();
  }, []);

  return (
    <div className={` h-48 p-4 ${className}`}>
      <div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default StatsAndGraph;
