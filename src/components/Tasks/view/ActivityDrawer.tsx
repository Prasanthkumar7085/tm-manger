"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { momentWithTimezone } from "@/lib/helpers/timeZone";
import dayjs from "dayjs";

interface ActivityDrawerProps {
  setActivityOpen: (open: boolean) => void;
  activityOpen: boolean;
  activityLogData: any[];
  id: any;
}

export const ActivityDrawer = ({
  setActivityOpen,
  activityOpen,
  activityLogData,
  id,
}: ActivityDrawerProps) => {
  const handleClose = () => {
    setActivityOpen(false);
  };
  return (
    <Dialog open={activityOpen} onOpenChange={setActivityOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] bg-white">
        <DialogHeader>
          <div>
            <h3 className="text-xl font-semibold">Activity Logs</h3>
            <Button
              variant="ghost"
              onClick={handleClose}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700"
            ></Button>
          </div>
        </DialogHeader>
        {activityLogData && activityLogData.length > 0 ? (
          <div className="overflow-y-auto h-80">
            <table className="min-w-full bg-white border rounded-lg shadow">
              <thead>
                <tr className="bg-gray-200 border-b font-bold text-gray-700">
                  <th className="p-3 text-left text-xs">User</th>
                  <th className="p-3 text-left text-xs">Time</th>
                  <th className="p-3 text-left text-xs">Action</th>
                  <th className="p-3 text-left text-xs">Description</th>
                </tr>
              </thead>
              <tbody>
                {activityLogData.map((item: any, index: number) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 flex items-center space-x-3">
                      {item.user_name && (
                        <>
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                            <img
                              src={item.user_profile_pic_url}
                              alt={item.user_name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <span className="font-semibold text-gray-800">
                            {item.user_name
                              .split(" ")
                              .map(
                                (word: string) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </span>
                        </>
                      )}
                    </td>
                    <td className="p-3 text-xs text-gray-500">
                      {momentWithTimezone(item.time, "DD-MM-YYYY hh:mm A")}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {item.actionType || "-"}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {item.description
                        ? item.description.replace(/_/g, "")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No Activity logs are available.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
