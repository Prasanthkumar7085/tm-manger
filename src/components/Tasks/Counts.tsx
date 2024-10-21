import { Card, CardContent, CardHeader } from "../ui/card";
import totalTasksicon from "@/assets/total-tasks-icon.svg";
import todoTasksIcon from "@/assets/todo-tasks-icon.svg";
import inprogressTasksIcon from "@/assets/inprogress-tasks-icon.svg";
import completedTasksIcon from "@/assets/completed-tasks-icon.svg";
import overDueTasksIcon from "@/assets/overdue-tasks-icon.svg";
import CountUp from "react-countup";

const TotalCounts = () => {
  return (
    <div className="flex justify-between items-center gap-4 py-4 bg-gradient-to-rrounded-lg  px-6">
      {/* Total Tasks */}
      <Card className="flex-1 flex flex-row items-center bg-white shadow-md p-4 rounded-lg">
        <div className="flex flex-col">
          <h3 className="text-gray-700 text-sm font-semibold">Total Tasks</h3>
          <CardContent className="text-2xl font-bold text-gray-800">
          <CountUp end={1000} duration={2.5} />
          </CardContent>
        </div>
        <img
          src={totalTasksicon}
          alt="Total Tasks"
          className="w-12 h-12 ml-auto"
        />
      </Card>

      {/* To Do */}
      <Card className="flex-1 flex flex-row items-center bg-white shadow-md p-4 rounded-lg">
        <div className="flex flex-col">
          <h3 className="text-gray-700 text-sm font-semibold">To Do</h3>
          <CardContent className="text-2xl font-bold text-purple-600">
          <CountUp end={100} duration={2.5} />
          </CardContent>
        </div>
        <img
          src={todoTasksIcon}
          alt="To Do Tasks"
          className="w-12 h-12 ml-auto"
        />
      </Card>

      {/* In Progress */}
      <Card className="flex-1 flex flex-row items-center bg-white shadow-md p-4 rounded-lg">
        <div className="flex flex-col">
          <h3 className="text-gray-700 text-sm font-semibold">In Progress</h3>
          <CardContent className="text-2xl font-bold text-blue-500">
          <CountUp end={700} duration={2.5} />
          </CardContent>
        </div>
        <img
          src={inprogressTasksIcon}
          alt="In Progress Tasks"
          className="w-12 h-12 ml-auto"
        />
      </Card>

      {/* Overdue */}
      <Card className="flex-1 flex flex-row items-center bg-white shadow-md p-4 rounded-lg">
        <div className="flex flex-col">
          <h3 className="text-gray-700 text-sm font-semibold">Overdue</h3>
          <CardContent className="text-2xl font-bold text-red-600">
          <CountUp end={100} duration={2.5} />
          </CardContent>
        </div>
        <img
          src={overDueTasksIcon}
          alt="Overdue Tasks"
          className="w-12 h-12 ml-auto"
        />
      </Card>

      {/* Completed */}
      <Card className="flex-1 flex flex-row items-center bg-white shadow-md p-4 rounded-lg">
        <div className="flex flex-col">
          <h3 className="text-gray-700 text-sm font-semibold">Completed</h3>
          <CardContent className="text-2xl font-bold text-green-600">
          <CountUp end={100} duration={2.5} />
          </CardContent>
        </div>
        <img
          src={completedTasksIcon}
          alt="Completed Tasks"
          className="w-12 h-12 ml-auto"
        />
      </Card>
    </div>
  );
};

export default TotalCounts;
