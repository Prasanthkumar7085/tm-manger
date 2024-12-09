import DeleteDialog from "@/components/core/deleteDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { isProjectMemberOrNot } from "@/lib/helpers/loginHelpers";
import {
  taskPriorityConstants,
  taskStatusConstants,
} from "@/lib/helpers/statusConstants";
import { momentWithTimezone } from "@/lib/helpers/timeZone";
import {
  archiveTaskAPI,
  getAssignesAPI,
  getSingleTaskAPI,
} from "@/lib/services/tasks";
import { setSubRefId } from "@/redux/Modules/userlogin";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { CircleX } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import AssignedUsers from "../AssigneTasks";
import TaskComments from "../view/Comments";
import PriorityStatus from "../view/PriorityStatus";

import { capitalizeWords } from "@/lib/helpers/CapitalizeWords";
import TaskStatus from "../view/TaskStatus";
import LoadingComponent from "@/components/core/LoadingComponent";
// Get color based on initials
const getColorFromInitials = (initials: string) => {
  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500"];
  return colors[initials.charCodeAt(0) % colors.length];
};
export const SubTaskColumns = ({
  data,
  setDel,
  mainTask,
  showDetailsDialog,
  setShowDetailsDialog,
  selectedSubTaskStatus,
  setSelectedSubTaskStatus,
  selectedPriority,
  setSelectedPriority,
  setUpdateDetailsOfTask,
  setUpdatePriority,
}: any) => {
  const dispatch = useDispatch();
  const taskId = data.id;
  const router = useRouter();
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewData, setViewData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [openReplies, setOpenReplies] = useState<any>({
    commentId: null,
    open: false,
  });

  const profileData: any = useSelector(
    (state: any) => state.auth.user.user_details
  );
  const refernceId: any = useSelector((state: any) => state.auth.refId);
  const subRefernceId: any = useSelector((state: any) => state.auth.subRefId);
  const {
    isFetching,
    isLoading: isLoadingAssignes,
    data: assignedUsers,
  } = useQuery({
    queryKey: ["getAssignes", taskId],
    queryFn: async () => {
      try {
        const response = await getAssignesAPI(selectedTask?.id);
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

  const { isLoading, isError, error } = useQuery({
    queryKey: ["getSingleTask", selectedTask],
    queryFn: async () => {
      const response = await getSingleTaskAPI(selectedTask?.id);
      const taskData = response?.data?.data;
      try {
        if (response?.status === 200 || response?.status === 201) {
          setViewData(taskData);
          let status = taskStatusConstants.find(
            (item: any) => item.value === taskData?.status
          );
          setSelectedSubTaskStatus(status);
        }
      } catch (err: any) {
        toast.error(err?.message || "Something went wrong");
        throw err;
      }
    },
    enabled: Boolean(selectedTask?.id),
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
    setSelectedTask({ ...row, project_id: mainTask?.project_id });
    setShowDetailsDialog(true);
    dispatch(setSubRefId(row?.ref_id));
  };
  const onClickOpen = (id: any) => {
    setOpen(true);
    setDeleteTaskId(id);
  };
  const onClickClose = () => {
    setOpen(false);
    setShowDetailsDialog(false);
  };

  const getTaskStatus = (taskStatus: any) => {
    const status = taskStatusConstants.find(
      (item: any) => item.value === taskStatus
    );
    return {
      label: status?.label || "--",
      value: status?.value || "--",
    };
  };

  const getPriority = (priority: any) => {
    const status = taskPriorityConstants.find(
      (item: any) => item.value === priority
    );
    return {
      label: status?.label || "--",
      value: status?.value || "--",
    };
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <tbody>
          {data.length > 0 &&
            data.map((row: any, index: any) => (
              <tr
                key={row.id}
                className="border-b border-gray-200  hover:bg-gray-50"
              >
                <td
                  className="p-2 text-sm font-semibold text-primary cursor-pointer"
                  onClick={() => handleTitleClick(row)}
                >
                  [{row.ref_id || "--"}]
                </td>
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
                <td className="p-2 text-sm">
                  <div className="flex items-center -space-x-2">
                    {row.assignees && row.assignees.length > 0 ? (
                      <>
                        {row.assignees.slice(0, 5).map((assignee: any) => {
                          const initials =
                            assignee.fname?.[0]?.toUpperCase() +
                            assignee.lname?.[0]?.toUpperCase();
                          return (
                            <Avatar
                              key={assignee.user_id}
                              className={`w-6 h-6 ${getColorFromInitials(
                                initials
                              )}`}
                              title={`${assignee.fname} ${assignee.lname}`}
                            >
                              <AvatarImage
                                src={assignee.profile_pic}
                                alt={`${assignee.fname} ${assignee.lname}`}
                              />
                              <AvatarFallback>
                                {initials || "--"}
                              </AvatarFallback>
                            </Avatar>
                          );
                        })}
                      </>
                    ) : (
                      <span className="text-gray-500 text-sm">--</span>
                    )}
                  </div>
                </td>
                <td className="p-2 text-sm">
                  <PriorityStatus
                    taskId={row.id}
                    setUpdatePriority={setUpdateDetailsOfTask}
                    selectedPriority={getPriority(row.priority)}
                    setSelectedPriority={setSelectedPriority}
                    viewData={row}
                    assignedUsers={assignedUsers}
                  />

                  {/* <span
                    className="capitalize text-[12px] px-2 rounded-full font-medium flex justify-center items-center"
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
                    {row.priority === "LOW" && (
                      <ArrowDown className="w-4 h-4" />
                    )}
                    {row.priority || "--"}
                  </span> */}
                </td>
                <td className="p-2 text-sm">
                  <TaskStatus
                    taskId={row.id}
                    setUpdateDetailsOfTask={setUpdateDetailsOfTask}
                    selectedStatus={getTaskStatus(row.status)}
                    setSelectedStatus={setSelectedSubTaskStatus}
                    assignedUsers={assignedUsers}
                  />
                  {/* <span
                    className={`rounded-full px-2 py-1 text-xs font-medium flex items-center justify-center ${
                      row.status === "OVER_DUE"
                        ? "bg-red-100 text-red-500"
                        : row.status === "TODO"
                          ? "bg-purple-100 text-purple-500"
                          : row.status === "COMPLETED"
                            ? "bg-green-100 text-green-500"
                            : row.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-500"
                              : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {taskStatusConstants.find(
                      (item: any) => item.value === row.status
                    )?.label || "--"}
                  </span> */}
                </td>
                <td>
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
                    className="p-0 rounded-md w-[27px] h-[27px] border flex items-center justify-center hover:bg-[#F5F5F5]"
                  >
                    <img
                      src={"/archive.svg"}
                      alt="archive"
                      height={18}
                      width={18}
                    />
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {showDetailsDialog && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-[1200px] max-w-full rounded-lg shadow-lg   max-h-[90vh]">
            <div className="flex justify-between items-center py-2 px-6 border-b">
              <h1 className="text-2xl text-[#000] font-semibold">
                SubTask Details
              </h1>
              <button
                title="close"
                className="text-black rounded justify-end"
                onClick={onClickClose}
              >
                <CircleX />
              </button>
            </div>
            {/* Task Comments Section - 60% */}
            <div className="flex px-6 pb-6">
              <div className="w-[60%] pr-4 border-r overflow-y-auto max-h-[80vh]">
                <h2>
                  {refernceId}/{subRefernceId}
                </h2>
                <h2 className="text-xl text-[#1B2459] font-medium overflow-hidden overflow-ellipsis whitespace-nowrap pb-2">
                  {selectedTask.title || "--"}
                </h2>
                <p className="text-gray-700 text-sm mb-6">
                  {selectedTask.description || "--"}
                </p>
                <TaskComments taskId={selectedTask.id} />
              </div>

              {/* Details Section - 40% */}
              <div className="w-[40%] pl-4 overflow-y-auto max-h-[80vh] ">
                {/* <div className="flex justify-end">
                <button
                  title="close"
                  className="px-4 py-2 ml-[20px]  text-black rounded justify-end"
                  onClick={onClickClose}
                >
                  <CircleX />
                </button>
              </div> */}
                <div className="flex gap-2 my-4">
                  <TaskStatus
                    taskId={selectedTask?.id}
                    setUpdateDetailsOfTask={setUpdateDetailsOfTask}
                    selectedStatus={selectedSubTaskStatus}
                    setSelectedStatus={setSelectedSubTaskStatus}
                    assignedUsers={assignedUsers}
                  />

                  <Button
                    type="button"
                    variant="edit"
                    size="DefaultButton"
                    onClick={() => {
                      router.navigate({
                        to: `/tasks/${selectedTask.id}`,
                      });
                    }}
                  >
                    <img
                      src="/edit-icon.svg"
                      alt="icon"
                      className="w-3 h-3 mr-2 text-[10px] "
                    />
                    Edit Task
                  </Button>
                </div>
                <div className="focus-details border ">
                  <div className="card-header border-b px-4 py-0 bg-gray-50 pr-3 pl-4">
                    <h3 className="leading-1 text-black text-[1.1em]">
                      Details
                    </h3>
                  </div>
                  <div className="card-body py-3 px-4">
                    <ul className="space-y-3">
                      <li className="grid grid-cols-[150px,auto]">
                        <p className="text-[#666666] text-sm font-medium mb-1">
                          Project
                        </p>
                        <p className="mt-0 text-black font-medium flex items-center">
                          <img
                            src={`${import.meta.env.VITE_IMAGE_URL}/${
                              viewData?.project_logo
                            }`}
                            alt="Project logo"
                            onError={(e: any) => {
                              e.target.onerror = null;
                              e.target.src = "/favicon.png";
                            }}
                            className="mr-2 h-6 w-6 rounded-full object-cover"
                          />
                          {viewData?.project_title
                            ? capitalizeWords(viewData?.project_title)
                            : "--"}
                        </p>
                      </li>
                      <li className="grid grid-cols-[150px,auto]">
                        <p className="text-[#666666] text-sm font-medium mb-1">
                          Priority
                        </p>
                        <PriorityStatus
                          taskId={selectedTask?.id}
                          setUpdatePriority={setUpdatePriority}
                          selectedPriority={selectedPriority}
                          setSelectedPriority={setSelectedPriority}
                          viewData={viewData}
                          assignedUsers={assignedUsers}
                        />
                      </li>
                      <li className="grid grid-cols-[150px,auto]">
                        <p className="text-[#666666] text-sm font-medium mb-1">
                          Due Date
                        </p>
                        <div className="inline-block text-[#FF0021] text-md font-semibold rounded-sm">
                          {momentWithTimezone(
                            selectedTask?.due_date,
                            "MM/DD/YYYY"
                          )}
                        </div>
                      </li>
                      <li className="grid grid-cols-[150px,auto]">
                        <p className="text-[#666666] text-sm font-medium mb-1">
                          Created On
                        </p>
                        <p className="text-black font-medium">
                          {momentWithTimezone(
                            viewData?.created_at,
                            "MM/DD/YYYY"
                          )}
                        </p>
                      </li>
                      <li className="grid grid-cols-[150px,auto]">
                        <p className="text-[#666666] text-sm font-medium mb-1">
                          Created By
                        </p>
                        <div className="created-person flex items-center space-x-3">
                          <img
                            src={
                              `${import.meta.env.VITE_IMAGE_URL}/${
                                viewData?.created_profile_pic
                              }` || "/profile-picture.png"
                            }
                            onError={(e: any) => {
                              e.target.onerror = null;
                              e.target.src = "/profile-picture.png";
                            }}
                            alt="User"
                            className="object-contain w-6 h-6 rounded-full border"
                          />
                          <p className="font-medium text-black ml-2 text-md capitalize">
                            {viewData?.created_name}
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <AssignedUsers
                  viewTaskData={selectedTask}
                  taskId={selectedTask?.id}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4"></div>
        </div>
      )}

      <DeleteDialog
        openOrNot={open}
        label="Are you sure you want to Archive this subtask?"
        onCancelClick={onClickClose}
        onOKClick={deleteTask}
        deleteLoading={deleteLoading}
        buttonLable="Yes! Archive"
      />
      <LoadingComponent loading={loading || isLoading} />
    </div>
  );
};
