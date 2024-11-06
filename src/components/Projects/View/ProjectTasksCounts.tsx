import completedTasksIcon from "@/assets/completed-tasks-icon.svg";
import inprogressTasksIcon from "@/assets/inprogress-tasks-icon.svg";
import overDueTasksIcon from "@/assets/overdue-tasks-icon.svg";
import todoTasksIcon from "@/assets/todo-tasks-icon.svg";
import totalTasksicon from "@/assets/total-tasks-icon.svg";
import { Card, CardContent } from "@/components/ui/card";
import { getProjectWiseTasksAPI } from "@/lib/services/projects";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import CountUp from "react-countup";
const ProjectTasksCounts = ({ projectStatsUpdate }: any) => {
  const { projectId } = useParams({ strict: false });

  const { data: totalProjectWiseTasks } = useQuery({
    queryKey: ["totalTasks", projectStatsUpdate, projectId],
    queryFn: () => getProjectWiseTotalTasksCounts(),
  });

  const getProjectWiseTotalTasksCounts = async () => {
    try {
      const response = await getProjectWiseTasksAPI(projectId);
      return response?.data?.data;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section id="tasks-counts">
      <div className="flex justify-between items-center gap-4 bg-gradient-to-rounded-lg  px-6">
        <Card className="flex-1 flex flex-row items-center bg-white shadow-md px-3 py-2 rounded-lg">
          <div className="flex justify-between w-full items-center">
            <div className="content">
              <h3 className="leading-5 text-slate-500">Total Tasks</h3>
              <CardContent className="p-0 text-2xl">
                <CountUp
                  end={
                    totalProjectWiseTasks?.total_tasks_count?.toLocaleString() ||
                    0
                  }
                  duration={2.5}
                />
              </CardContent>
            </div>
            <div className="image">
              <img
                src={totalTasksicon}
                alt="Total Tasks"
                className="w-12 h-12 ml-auto"
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
                  end={
                    totalProjectWiseTasks?.task_todo_count?.toLocaleString() ||
                    0
                  }
                  duration={2.5}
                />
              </CardContent>
            </div>
            <div className="image">
              <img
                src={todoTasksIcon}
                alt="Total Tasks"
                className="w-12 h-12 ml-auto"
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
                  end={
                    totalProjectWiseTasks?.task_inprogress_count?.toLocaleString() ||
                    0
                  }
                  duration={2.5}
                />
              </CardContent>
            </div>
            <div className="image">
              <img
                src={inprogressTasksIcon}
                alt="Total Tasks"
                className="w-12 h-12 ml-auto"
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
                  end={totalProjectWiseTasks?.task_overdue_count?.toLocaleString()}
                  duration={2.5}
                />
              </CardContent>
            </div>
            <div className="image">
              <img
                src={overDueTasksIcon}
                alt="Total Tasks"
                className="w-12 h-12 ml-auto"
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
                  end={totalProjectWiseTasks?.task_completed_count?.toLocaleString()}
                  duration={2.5}
                />
              </CardContent>
            </div>
            <div className="image">
              <img
                src={completedTasksIcon}
                alt="Total Tasks"
                className="w-12 h-12 ml-auto"
              />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ProjectTasksCounts;
