import SearchFilter from "@/components/core/CommonComponents/SearchFilter";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addSerial } from "@/lib/helpers/addSerial";
import { errPopper } from "@/lib/helpers/errPopper";
import { momentWithTimezone } from "@/lib/helpers/timeZone";
import { getAllMembers } from "@/lib/services/projects/members";
import { getAllPaginatedUsers } from "@/lib/services/users";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
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
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get("search");
  const [loading, setLoading] = useState(false);
  const [searchString, setSearchString] = useState<any>(initialSearch || "");
  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await getAllMembers();
        console.log(response, "respp");
        if (response.success) {
          const modifieData = addSerial(
            response?.data?.data,
            1,
            response?.data?.data?.length
          );
          return modifieData;
        } else {
          throw new Error("Failed to fetch project details");
        }
      } catch (errData) {
        console.error(errData);
        errPopper(errData);
        throw errData;
      }
    },
  });
  const handleClose = () => {
    setActivityOpen(false);
  };
  return (
    <Dialog open={activityOpen} onOpenChange={setActivityOpen}>
      <DialogContent className="p-0 sm:max-w-[1000px] h-[80vh] bg-white">
        <DialogHeader>
          <div className="flex justify-between border-b-[#E7E7F7] border-b-[1.2px]">
            <h3 className="py-2 px-4 text-[#273480] items-center flex text-base border-r-[1.2px] border-r-[#E7E7F7] font-medium">
              Activity Logs
            </h3>
            <SearchFilter
              searchString={searchString}
              setSearchString={setSearchString}
              title="Search User Name"
            />
            <Button
              variant="ghost"
              onClick={handleClose}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700"
            ></Button>
          </div>
        </DialogHeader>
        {activityLogData && activityLogData.length > 0 ? (
          <div className="overflow-y-auto w-[96%] m-auto mt-2 mb-6">
            <table className="min-w-full bg-white border rounded-lg shadow">
              <thead className="sticky top-0 z-[10]">
                <tr className="bg-gray-200 border-b font-bold text-gray-700">
                  <th className="p-3 text-left text-xs">Sl.no</th>
                  <th className="p-3 text-left text-xs">User</th>
                  <th className="p-3 text-left text-xs">Time</th>
                  <th className="p-3 text-left text-xs">Action</th>
                  <th className="p-3 text-left text-xs">Description</th>
                </tr>
              </thead>
              <tbody>
                {activityLogData.map((item: any, index: number) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-xs text-gray-500">{index + 1}</td>
                    <td className="p-3 flex items-center space-x-3">
                      {item.user_name && (
                        <>
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                            <img
                              src={
                                item.user_profile_pic_url ||
                                "/profile-picture.png"
                              }
                              alt={item.user_name}
                              onError={(e) => {
                                e.currentTarget.src = "/profile-picture.png";
                              }}
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