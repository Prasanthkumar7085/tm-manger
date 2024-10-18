import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ClipboardCheck, Loader, PieChart, Users } from "lucide-react";
import StatsAndGraph from "./StatsAndGraphs";
import Tasks from "./Tasks";
import GlobalDateRangeFilter from "./core/DateRangePicker";

const DashBoard = () => {
  const [totalDetails, setTotalDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const handleDateChange = (data: any) => {};
  return (
    <>
      <div className="grid grid-cols-[60%_40%] gap-3">
        <Card className="p-6 bg-white shadow-lg rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Stats</h2>
            <GlobalDateRangeFilter onChangeData={handleDateChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Projects */}
            <div className="p-4 bg-red-100 rounded-lg text-center shadow-sm">
              <div className="flex justify-center items-center mb-4">
                <img
                  src={"src/assets/dashboard-project-icon.svg"}
                  alt="logo"
                  className="h-[33px] w-[33px]"
                />
              </div>
              <h1 className="text-3xl font-semibold text-gray-800">100</h1>
              <p className="text-sm text-gray-600">Projects</p>
            </div>

            {/* Tasks */}
            <div className="p-4 bg-yellow-100 rounded-lg text-center shadow-sm">
              <div className="flex justify-center items-center mb-4">
                <img
                  src={"src/assets/dashboard-task-icon.svg"}
                  alt="logo"
                  className="h-[33px] w-[33px]"
                />
              </div>
              <h1 className="text-3xl font-semibold text-gray-800">300</h1>
              <p className="text-sm text-gray-600">Tasks</p>
            </div>

            <div className="p-4 bg-purple-100 rounded-lg text-center shadow-sm">
              <div className="flex justify-center items-center mb-4">
                <img
                  src={"src/assets/dashboard-users-icon.svg"}
                  alt="logo"
                  className="h-[33px] w-[33px]"
                />
              </div>
              <h1 className="text-3xl font-semibold text-gray-800">500</h1>
              <p className="text-sm text-gray-600">Users</p>
            </div>

            <div className="p-4 bg-green-100 rounded-lg text-center shadow-sm">
              <div className="flex justify-center items-center mb-4">
                <img
                  src={"src/assets/dashboard-active-icon.svg"}
                  alt="logo"
                  className="h-[33px] w-[33px]"
                />
              </div>
              <h1 className="text-3xl font-semibold text-gray-800">50</h1>
              <p className="text-sm text-gray-600">Active Tasks</p>
            </div>
          </div>
        </Card>
        <Card className=" h-[100%] p-2 bg-white shadow-lg rounded-lg">
          <StatsAndGraph />
        </Card>
      </div>
      <Card className="p-6 py-4 mt-5 bg-white shadow-lg rounded-lg">
        <Tasks />
      </Card>
    </>
  );
};

export default DashBoard;
