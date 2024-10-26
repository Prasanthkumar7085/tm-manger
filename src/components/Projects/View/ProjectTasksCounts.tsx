import completedTasksIcon from "@/assets/completed-tasks-icon.svg";
import inprogressTasksIcon from "@/assets/inprogress-tasks-icon.svg";
import overDueTasksIcon from "@/assets/overdue-tasks-icon.svg";
import todoTasksIcon from "@/assets/todo-tasks-icon.svg";
import totalTasksicon from "@/assets/total-tasks-icon.svg";
import { Card, CardContent } from "@/components/ui/card";
import CountUp from "react-countup";
const ProjectTasksCounts = () => {
  return (
    <section id="tasks-counts">
      <div className="flex justify-between items-center gap-4 py-4 bg-gradient-to-rrounded-lg  px-6">
        <Card className="flex-1 flex flex-row items-center bg-white shadow-md p-4 rounded-lg">
          <div className="flex justify-between w-full">
            <div className="content">
              <h3 className="leading-5">Total Tasks</h3>
              <CardContent className="p-0 text-2xl">
                <CountUp end={1000} duration={2.5} />
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
        <Card className="flex-1 flex flex-row items-center bg-white shadow-md p-4 rounded-lg">
          <div className="flex justify-between w-full">
            <div className="content">
              <h3 className="leading-5">To Do</h3>
              <CardContent className="p-0 text-2xl">
                <CountUp end={100} duration={2.5} />
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
        <Card className="flex-1 flex flex-row items-center bg-white shadow-md p-4 rounded-lg">
          <div className="flex justify-between w-full">
            <div className="content">
              <h3 className="leading-5">In Progress</h3>
              <CardContent className="p-0 text-2xl">
                <CountUp end={700} duration={2.5} />
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

        <Card className="flex-1 flex flex-row items-center bg-white shadow-md p-4 rounded-lg">
          <div className="flex justify-between w-full">
            <div className="content">
              <h3 className="leading-5">Overdue</h3>
              <CardContent className="p-0 text-2xl">
                <CountUp end={100} duration={2.5} />
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


        <Card className="flex-1 flex flex-row items-center bg-white shadow-md p-4 rounded-lg">
          <div className="flex justify-between w-full">
            <div className="content">
              <h3 className="leading-5">Completed</h3>
              <CardContent className="p-0 text-2xl">
                <CountUp end={100} duration={2.5} />
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
