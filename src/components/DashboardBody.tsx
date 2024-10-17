import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ClipboardCheck, Loader, PieChart, Users } from "lucide-react";
import StatsAndGraph from "./StatsAndGraphs";
import Tasks from "./Tasks";

const DashBoard = () => {
  const [totalDetails, setTotalDetails] = useState({});
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className="grid grid-cols-[2fr_1fr]">
        <div className="p-4">
          <Card className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4">Stats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
                <ClipboardCheck className="w-10 h-10 text-green-500" />
                <div className="ml-4 text-center">
                  <h1 className="text-3xl font-semibold">200</h1>
                  <p className="text-sm text-gray-500">Projects</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
                <Users className="w-10 h-10 text-purple-500" />
                <div className="ml-4 text-center">
                  <h1 className="text-3xl font-semibold">30</h1>
                  <p className="text-sm text-gray-500">Tasks</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
                <Users className="w-10 h-10 text-purple-500" />
                <div className="ml-4 text-center">
                  <h1 className="text-3xl font-semibold">50</h1>
                  <p className="text-sm text-gray-500">Users</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
                <PieChart className="w-10 h-10 text-blue-500" />
                <div className="ml-4 text-center">
                  <h1 className="text-3xl font-semibold">90</h1>
                  <p className="text-sm text-gray-500">Active Tasks</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="p-4">
          <Card className=" h-48 p-4 bg-white shadow-lg rounded-lg">
            <StatsAndGraph />
          </Card>
        </div>
      </div>
      <Tasks />
    </>
  );
};

export default DashBoard;
