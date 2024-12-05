import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAssignesAPI } from "@/lib/services/tasks";
import TaskStatus from "../view/TaskStatus";

export const SubTaskColumns = ({ data }: { data: any[] }) => {
  const { taskId } = useParams({ strict: false });
  const [showPopover, setShowPopover] = useState(false);
  const [updateDetailsOfTask, setUpdateDetailsOfTask] = useState<any>(0);
  const [updatePrority, setUpdatePriority] = useState<{
    label: string;
    value: string;
  }>();
  const [selectedStatus, setSelectedStatus] = useState<{
    label: string;
    value: string;
  }>();

  const getColorFromInitials = (initials: string) => {
    const colors = ["bg-red-500", "bg-blue-500", "bg-green-500"];
    return colors[initials.charCodeAt(0) % colors?.length];
  };
  const {
    isFetching,
    isLoading: isLoadingAssignes,
    data: assignedUsers,
  } = useQuery({
    queryKey: ["getAssignes", taskId],
    queryFn: async () => {
      try {
        const response = await getAssignesAPI(taskId);
        if (response.status === 200 || response?.status === 201) {
          const data = response.data?.data;
          return data || [];
        }
      } catch (error: any) {
        console.error(error);
      }
    },
    enabled: Boolean(taskId),
  });

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id} className="border-b border-gray-200">
              {/* Ref ID */}
              <td className="p-2 text-sm font-semibold text-primary">
                [{row.ref_id}]
              </td>

              {/* Title */}
              <td className="p-2 text-sm">
                <div className="flex items-center gap-2">
                  <img
                    src={row.project_logo || "/favicon.png"}
                    alt="Project logo"
                    className="w-6 h-6 rounded-full border"
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = "/favicon.png";
                    }}
                  />
                  <span className="capitalize">{row.title || "-"}</span>
                </div>
              </td>

              {/* Assignees */}
              <td className="p-2 text-sm">
                <div className="flex items-center -space-x-2">
                  {row.assignees.slice(0, 5).map((assignee: any) => {
                    const initials =
                      assignee.fname?.[0]?.toUpperCase() +
                      assignee.lname?.[0]?.toUpperCase();
                    return (
                      <Avatar
                        key={assignee.user_id}
                        className={`w-6 h-6 ${getColorFromInitials(initials)}`}
                        title={`${assignee.fname} ${assignee.lname}`}
                      >
                        <AvatarImage
                          src={assignee.profile_pic}
                          alt={assignee.name}
                        />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                    );
                  })}
                  {row.assignees?.length > 5 && (
                    <Popover open={showPopover} onOpenChange={setShowPopover}>
                      <PopoverTrigger asChild>
                        <div className="w-6 h-6 text-xs font-semibold text-center bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300">
                          +{row.assignees?.length - 5}
                        </div>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="p-2">
                          {row.assignees.map((assignee: any) => (
                            <div
                              key={assignee.user_id}
                              className="flex items-center gap-2"
                            >
                              <Avatar
                                className={`w-6 h-6 ${getColorFromInitials(
                                  assignee.fname?.[0] + assignee.lname?.[0]
                                )}`}
                              >
                                <AvatarImage src={assignee.profile_pic} />
                                <AvatarFallback>
                                  {assignee.fname[0] + assignee.lname[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span>
                                {assignee.fname} {assignee.lname}
                              </span>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </td>

              {/* Due Date */}
              {/* <td className="p-2 text-sm">
                {row.due_date
                  ? moment(row.due_date).format("MMM DD, YYYY")
                  : "-"}
              </td> */}

              {/* Status */}
              <td className="p-2 text-sm">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    row.status === "OVER_DUE"
                      ? "bg-red-100 text-red-500"
                      : row.status === "TODO"
                        ? "bg-purple-100 text-purple-500"
                        : row.status === "COMPLETED"
                          ? "bg-green-100 text-green-500"
                          : "bg-blue-100 text-blue-500"
                  }`}
                >
                  {row.status}
                </span>
                {/* <TaskStatus
                  taskId={taskId}
                  setUpdateDetailsOfTask={setUpdateDetailsOfTask}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  assignedUsers={assignedUsers || []}
                /> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
