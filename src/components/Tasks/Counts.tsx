import { Card, CardContent, CardHeader } from "../ui/card";
import totalTasksicon from "@/assets/total-tasks-icon.svg";
import todoTasksIcon from "@/assets/todo-tasks-icon.svg";
import inprogressTasksIcon from "@/assets/inprogress-tasks-icon.svg";
import completedTasksIcon from "@/assets/completed-tasks-icon.svg";
import overDueTasksIcon from "@/assets/overdue-tasks-icon.svg";
import CountUp from "react-countup";
import { useQuery } from "@tanstack/react-query";
import { getTaskStatsCountsAPI } from "@/lib/services/tasks";

const TotalCounts = ({ taksDataAfterSerial }: any) => {
  const { data: totalTasks } = useQuery({
    queryKey: ["totalTasks", taksDataAfterSerial],
    queryFn: () => getTotalTasksCounts(),
  });

  const getTotalTasksCounts = async () => {
    try {
      const response = await getTaskStatsCountsAPI();
      return response?.data?.data;
    } catch (error) {
      console.error(error);
    }
  };

  console.log(totalTasks, "totalTasks");
  return (
    <section id="tasks-counts">
      <div className="flex justify-between items-center gap-4 bg-gradient-to-rounded-lg  px-6">
        <Card className="flex-1 flex flex-row items-center bg-white shadow-md px-3 py-2 rounded-lg">
          <div className="flex justify-between w-full items-center">
            <div className="content">
              <h3 className="leading-5 text-slate-500">Total Tasks</h3>
              <CardContent className="p-0 text-2xl">
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
        <Card className="flex-1 flex flex-row items-center bg-white shadow-md px-3 py-2 rounded-lg">
          <div className="flex justify-between w-full items-center">
            <div className="content">
              <h3 className="leading-5 text-slate-500">To Do</h3>
              <CardContent className="p-0 text-2xl">
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
        <Card className="flex-1 flex flex-row items-center bg-white shadow-md px-3 py-2 rounded-lg">
          <div className="flex justify-between w-full items-center">
            <div className="content">
              <h3 className="leading-5 text-slate-500">In Progress</h3>
              <CardContent className="p-0 text-2xl">
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
        <Card className="flex-1 flex flex-row items-center bg-white shadow-md px-3 py-2 rounded-lg">
          <div className="flex justify-between w-full items-center">
            <div className="content">
              <h3 className="leading-5 text-slate-500">Overdue</h3>
              <CardContent className="p-0 text-2xl">
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
        <Card className="flex-1 flex flex-row items-center bg-white shadow-md px-3 py-2 rounded-lg">
          <div className="flex justify-between w-full items-center">
            <div className="content">
              <h3 className="leading-5 text-slate-500">Completed</h3>
              <CardContent className="p-0 text-2xl">
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
