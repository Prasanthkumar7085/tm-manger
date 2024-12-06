import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { archiveTaskAPI, getAssignesAPI } from "@/lib/services/tasks";
import TaskStatus from "../view/TaskStatus";
import { sub } from "date-fns";
import SubTaskStatus from "./SubTaskStatus";
import {
  bgColorObjectForStatus,
  colorObjectForStatus,
  taskStatusConstants,
} from "@/lib/helpers/statusConstants";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSubRefId } from "@/redux/Modules/userlogin";
import { isProjectMemberOrNot } from "@/lib/helpers/loginHelpers";
import DeleteDialog from "@/components/core/deleteDialog";
import { toast } from "sonner";
const getColorFromInitials = (initials: string) => {
  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500"];
  return colors[initials.charCodeAt(0) % colors?.length];
};

export const SubTaskColumns = ({
  data,
  setDel,
}: {
  data: any[];
  setDel: any;
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const profileData: any = useSelector(
    (state: any) => state.auth.user.user_details
  );
  const { taskId } = useParams({ strict: false });
  const { subtaskId } = useParams({ strict: false });

  const [showPopover, setShowPopover] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

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
  const deleteTask = async () => {
    try {
      setDeleteLoading(true);
      const response = await archiveTaskAPI(deleteTaskId);
      if (response?.status === 200 || response?.status === 201) {
        onClickClose();
        toast.success(response?.data?.message);
        setDel((prev: any) => prev + 1);
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleTitleClick = (row: any) => {
    router.navigate({ to: `/tasks/view/${row?.id}` });
    dispatch(setSubRefId(row?.ref_id));
  };
  const onClickOpen = (id: any) => {
    setOpen(true);
    setDeleteTaskId(id);
  };

  const onClickClose = () => {
    setOpen(false);
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id} className="border-b border-gray-200">
              {/* Ref ID */}
              <td className="p-2 text-sm font-semibold text-primary">
                [{row.ref_id || "--"}]
              </td>

              {/* Title */}
              <td className="p-2 text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="capitalize cursor-pointer"
                    onClick={() => handleTitleClick(row)}
                  >
                    {row.title || "--"}
                  </span>
                </div>
              </td>

              {/* Assignees */}
              <td className="p-2 text-sm">
                <div className="flex items-center -space-x-2">
                  {/* Check if assignees exist and map, else show fallback */}
                  {row.assignees && row.assignees.length > 0 ? (
                    <>
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
                              alt={`${assignee.fname} ${assignee.lname}`}
                            />
                            <AvatarFallback>{initials || "--"}</AvatarFallback>
                          </Avatar>
                        );
                      })}
                      {row.assignees?.length > 5 && (
                        <Popover
                          open={showPopover}
                          onOpenChange={setShowPopover}
                        >
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
                                      {assignee.fname?.[0] +
                                        assignee.lname?.[0]}
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
                    </>
                  ) : (
                    <span className="text-gray-500 text-sm">--</span>
                  )}
                </div>
              </td>

              {/* Status */}

              <td className="p-2 text-sm">
                <span
                  className="capitalize text-[12px] leading-1 px-2 rounded-full font-medium flex justify-center items-center"
                  style={{
                    backgroundColor:
                      bgColorObjectForStatus[row.priority] || "gray",
                    color: colorObjectForStatus[row.priority] || "black",
                  }}
                >
                  {row.priority === "HIGH" && <ArrowUp className="w-4 h-4" />}
                  {row.priority === "MEDIUM" && (
                    <ArrowRight className="w-4 h-4" />
                  )}
                  {row.priority === "LOW" && <ArrowDown className="w-4 h-4" />}
                  {row.priority ? (
                    row.priority
                  ) : (
                    <span className="text-gray-500 text-sm">--</span>
                  )}
                </span>
              </td>
              <td className="p-2 text-sm">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium flex items-center justify-center ${(() => {
                    switch (row.status) {
                      case "OVER_DUE":
                        return "bg-red-100 text-red-500";
                      case "TODO":
                        return "bg-purple-100 text-purple-500";
                      case "COMPLETED":
                        return "bg-green-100 text-green-500";
                      case "IN_PROGRESS":
                        return "bg-blue-100 text-blue-500";
                      default:
                        return "bg-gray-100 text-gray-500";
                    }
                  })()}`}
                >
                  <span
                    className={`dot w-2 h-2 inline-block mr-1 rounded-full ${(() => {
                      switch (row.status) {
                        case "OVER_DUE":
                          return "bg-red-500";
                        case "TODO":
                          return "bg-purple-500";
                        case "COMPLETED":
                          return "bg-green-500";
                        case "IN_PROGRESS":
                          return "bg-blue-500";
                        default:
                          return "bg-gray-500";
                      }
                    })()}`}
                  ></span>

                  {/* Status Text */}
                  {taskStatusConstants.find(
                    (item: any) => item.value === row.status
                  )?.label || <span className="text-gray-500">--</span>}
                </span>
              </td>
              <Button
                title="archive"
                disabled={
                  profileData?.user_type === "admin" ||
                  isProjectMemberOrNot(row.assignees, profileData?.id)
                    ? false
                    : true
                }
                onClick={() => onClickOpen(row.id)}
                variant={"ghost"}
                className="p-0 rounded-md w-[27px] h-[27px] border flex items-center justify-center hover:bg-[#f5f5f5]"
              >
                <img
                  src={"/archive.svg"}
                  alt="archive"
                  height={18}
                  width={18}
                />
              </Button>
            </tr>
          ))}
          <DeleteDialog
            openOrNot={open}
            label="Are you sure you want to Archive this subtask?"
            onCancelClick={onClickClose}
            onOKClick={deleteTask}
            deleteLoading={deleteLoading}
            buttonLable="Yes! Archive"
          />
        </tbody>
      </table>
    </div>
  );
};
