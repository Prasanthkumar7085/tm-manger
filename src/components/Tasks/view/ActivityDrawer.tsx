"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { XIcon } from "lucide-react";
import dayjs from "dayjs";
import { useEffect } from "react";

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
    <Sheet open={activityOpen} onOpenChange={setActivityOpen}>
      <SheetTrigger>
        <Button variant="outline" className="hidden">
          Open
        </Button>
      </SheetTrigger>

      <SheetContent className="bg-white overflow-auto w-[60%] ">
        <SheetHeader>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Activity Logs</h3>
            <Button
              variant="ghost"
              onClick={handleClose}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700"
            >
              <XIcon className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        {activityLogData && activityLogData.length > 0 ? (
          activityLogData.map((item: any, index: number) => (
            <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg shadow">
              <div className="flex items-center space-x-3">
                {item.user_name && (
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    <img
                      src={item.user_profile_pic_url}
                      alt={item.user_name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-800">
                    {item.user_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {dayjs(item.time).format("DD-MM-YYYY hh:mm A")}
                  </p>
                </div>
              </div>

              <div className="mt-3">
                {item.actionType && (
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-gray-600">
                      Action
                    </p>
                    <p className="text-sm text-gray-800">{item.actionType}</p>
                  </div>
                )}

                {item.description && (
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-gray-600">
                      Description
                    </p>
                    <p className="text-sm text-gray-800">
                      {" "}
                      {item.description.replace(/_/g, "")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No Activity logs are available.
          </p>
        )}
      </SheetContent>
    </Sheet>
  );
};
