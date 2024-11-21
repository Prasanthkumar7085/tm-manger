import { Card, CardContent, CardHeader } from "../ui/card";
import totalTasksicon from "@/assets/total-tasks-icon.svg";
import todoTasksIcon from "@/assets/todo-tasks-icon.svg";
import inprogressTasksIcon from "@/assets/inprogress-tasks-icon.svg";
import completedTasksIcon from "@/assets/completed-tasks-icon.svg";
import overDueTasksIcon from "@/assets/overdue-tasks-icon.svg";
import CountUp from "react-countup";
import { useQuery } from "@tanstack/react-query";
import {
  getTaskArchivedStatsCountsAPI,
  getTaskStatsCountsAPI,
} from "@/lib/services/tasks";
import { useLocation } from "@tanstack/react-router";

const TotalCounts = ({ refreshCount, isArchive, onCardClick }: any) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const { data: totalTasks } = useQuery({
    queryKey: ["totalTasks", refreshCount, isArchive],
    queryFn: () => getTotalTasksCounts(),
  });

  const getTotalTasksCounts = async () => {
    try {
      if (isArchive) {
        const response = await getTaskArchivedStatsCountsAPI();
        return response?.data?.data;
      } else {
        const response = await getTaskStatsCountsAPI();
        return response?.data?.data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section id="tasks-counts">
      <div className="flex justify-between items-center gap-4 bg-gradient-to-rounded-lg  px-6">
        <Card
          className="flex-1 flex flex-row items-center bg-white shadow-md px-3 py-2 rounded-lg cursor-pointer"
          onClick={() => onCardClick("")}
        >
          <div className="flex justify-between w-full items-center">
            <div className="content">
              <h3 className="leading-5 text-sm font-medium text-[#7E7E98]">
                Total Tasks
              </h3>
              <CardContent className="p-0 text-2xl text-[#000000]">
                <CountUp
                  end={totalTasks?.total_tasks?.toLocaleString() || 0}
                  duration={2.5}
                />
              </CardContent>
            </div>
            <div className="image">
              <img
                src={totalTasksicon}
                alt="Total Tasks"
                className="w-10 h-10 ml-auto"
              />
            </div>
          </div>
        </Card>
        <Card
          className="flex-1 flex flex-row items-center bg-white shadow-md px-3 py-2 rounded-lg cursor-pointer"
          onClick={() => onCardClick("TODO")}
        >
          <div className="flex justify-between w-full items-center">
            <div className="content">
              <h3 className="leading-5 text-sm font-medium text-[#7E7E98]">
                To Do
              </h3>
              <CardContent className="p-0 text-2xl text-[#6F42C1]">
                <CountUp
                  end={totalTasks?.todo_count?.toLocaleString() || 0}
                  duration={2.5}
                />
              </CardContent>
            </div>
            <div className="image">
              <img
                src={todoTasksIcon}
                alt="Total Tasks"
                className="w-10 h-10 ml-auto"
              />
            </div>
          </div>
        </Card>
        <Card
          className="flex-1 flex flex-row items-center bg-white shadow-md px-3 py-2 rounded-lg cursor-pointer"
          onClick={() => onCardClick("IN_PROGRESS")}
        >
          <div className="flex justify-between w-full items-center">
            <div className="content">
              <h3 className="leading-5 text-sm font-medium text-[#7E7E98]">
                In Progress
              </h3>
              <CardContent className="p-0 text-2xl text-[#007BFF]">
                <CountUp
                  end={totalTasks?.inProgress_count?.toLocaleString() || 0}
                  duration={2.5}
                />
              </CardContent>
            </div>
            <div className="image">
              <img
                src={inprogressTasksIcon}
                alt="Total Tasks"
                className="w-10 h-10 ml-auto"
              />
            </div>
          </div>
        </Card>
        <Card
          className="flex-1 flex flex-row items-center bg-white shadow-md px-3 py-2 rounded-lg cursor-pointer"
          onClick={() => onCardClick("OVER_DUE")}
        >
          <div className="flex justify-between w-full items-center">
            <div className="content">
              <h3 className="leading-5 text-sm font-medium text-[#7E7E98]">
                Overdue
              </h3>
              <CardContent className="p-0 text-2xl text-[#A71D2A]">
                <CountUp
                  end={totalTasks?.overDue_count?.toLocaleString() || 0}
                  duration={2.5}
                />
              </CardContent>
            </div>
            <div className="image">
              <img
                src={overDueTasksIcon}
                alt="Total Tasks"
                className="w-10 h-10 ml-auto"
              />
            </div>
          </div>
        </Card>
        <Card
          className="flex-1 flex flex-row items-center bg-white shadow-md px-3 py-2 rounded-lg cursor-pointer"
          onClick={() => onCardClick("COMPLETED")}
        >
          <div className="flex justify-between w-full items-center">
            <div className="content">
              <h3 className="leading-5 text-sm font-medium text-[#4C4C66]">
                Completed
              </h3>
              <CardContent className="p-0 text-2xl text-[#28A745]">
                <CountUp
                  end={totalTasks?.completed_count?.toLocaleString() || 0}
                  duration={2.5}
                />
              </CardContent>
            </div>
            <div className="image">
              <img
                src={completedTasksIcon}
                alt="Total Tasks"
                className="w-10 h-10 ml-auto"
              />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default TotalCounts;
