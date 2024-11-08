import viewButtonIcon from "@/assets/view.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  bgColorObjectForStatus,
  colorObjectForStatus,
  taskPriorityConstants,
  taskStatusConstants,
} from "@/lib/helpers/statusConstants";
import { deleteTaskAPI } from "@/lib/services/tasks";
import { useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DeleteDialog from "../core/deleteDialog";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export const taskColumns = ({ setDel }: any) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const getColorFromInitials = (initials: string) => {
    const colors = [
      "bg-red-200",
      "bg-green-200",
      "bg-blue-200",
      "bg-yellow-200",
      "bg-purple-200",
      "bg-pink-200",
      "bg-indigo-200",
      "bg-teal-200",
      "bg-orange-200",
      "bg-cyan-200",
      "bg-amber-200",
      "bg-lime-200",
      "bg-emerald-200",
      "bg-fuchsia-200",
      "bg-rose-200",
    ];

    const index = initials.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const deleteTask = async () => {
    try {
      setDeleteLoading(true);
      const response = await deleteTaskAPI(deleteTaskId);
      if (response?.status === 200 || response?.status === 201) {
        onClickClose();
        toast.success(response?.data?.message || "User Task Successfully");
        setDel((prev: any) => prev + 1);
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleView = (taskId: any) => {
    navigate({
      to: `/tasks/view/${taskId}`,
    });
  };

  const handleEdit = (taskId: any) => {
    navigate({
      to: `/tasks/${taskId}`,
    });
  };

  const onClickClose = () => {
    setOpen(false);
  };

  const onClickOpen = (id: any) => {
    setOpen(true);
    setDeleteTaskId(id);
  };

  return [
    {
      accessorFn: (row: any) => row.serial,
      id: "serial",
      header: () => <span>S.No</span>,
      footer: (props: any) => props.column.id,
      width: "50px",
      maxWidth: "50px",
      minWidth: "50px",
      cell: (info: any) => <span>{info.getValue()}</span>,
    },
    {
      accessorFn: (row: any) => row.project_title,
      id: "project_title",
      cell: (info: any) => {
        const title = info.getValue();
        const project_logo_url =
          info.row.original.project_logo_url || "/favicon.png";
        return (
          <div className="project-title flex items-center gap-2">
            {project_logo_url && (
              <div className="project-logo">
                <img
                  src={project_logo_url}
                  alt="project logo"
                  className="w-[22px] h-[22px] rounded-full border bg-transparent"
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/150?text=No preview";
                  }}
                />
              </div>
            )}
            <span className="capitalize">{title ? title : "-"}</span>
          </div>
        );
      },
      width: "200px",
      maxWidth: "200px",
      minWidth: "200px",
      header: () => <span>Projects</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => ({ ref_id: row.ref_id, title: row.title }),
      id: "title",
      cell: (info: any) => {
        const { ref_id, title } = info.getValue();

        return (
          <>
            <div className="task capitalize flex justify-between">
              <span className="task-title whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                {title || "-"}
              </span>
              <span className="ml-2 text-[11px] font-semibold text-primary">
                [{ref_id}]
              </span>
            </div>
          </>
        );
      },
      width: "300px",
      maxWidth: "300px",
      minWidth: "300px",
      header: () => <span>Tasks</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.assignees,
      id: "assignees",
      cell: (info: any) => {
        const [showPopover, setShowPopover] = useState(false);

        return (
          <div className="flex justify-start items-center -space-x-2">
            {info
              .getValue()
              .slice(0, 5)
              .map((assignee: any) => {
                const initials =
                  assignee.user_first_name[0] + assignee.user_last_name[0];
                const backgroundColor = getColorFromInitials(initials);

                return (
                  <Avatar
                    key={assignee.user_id}
                    title={
                      assignee.user_first_name + " " + assignee.user_last_name
                    }
                    className={`w-6 h-6 ${backgroundColor}`}
                  >
                    <AvatarImage
                      src={assignee.user_profile_pic_url}
                      alt={assignee.name}
                      title={
                        assignee.user_first_name + " " + assignee.user_last_name
                      }
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                );
              })}
            {info.getValue().length > 5 && (
              <Popover open={showPopover} onOpenChange={setShowPopover}>
                <PopoverTrigger asChild>
                  <div className="flex items-center justify-center w-8 h-8 border-2 border-white rounded-full bg-gray-200 text-xs font-semibold cursor-pointer hover:bg-gray-300">
                    +{info.getValue().length - 5}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="p-2 w-48 max-w-xs bg-white border border-gray-300 rounded-lg shadow-lg">
                  <div className="space-y-2">
                    {info.getValue().map((assignee: any) => (
                      <div
                        key={assignee.user_id}
                        className="flex items-center space-x-2"
                      >
                        <Avatar
                          key={assignee.user_id}
                          title={
                            assignee.user_first_name +
                            " " +
                            assignee.user_last_name
                          }
                          className={`w-8 h-8 ${getColorFromInitials(
                            assignee.user_first_name[0] +
                              assignee.user_last_name[0]
                          )}`}
                        >
                          <AvatarImage
                            src={assignee.user_profile_pic_url}
                            alt={assignee.name}
                            title={
                              assignee.user_first_name +
                              " " +
                              assignee.user_last_name
                            }
                          />
                          <AvatarFallback>
                            {assignee.user_first_name[0] +
                              assignee.user_last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {assignee.user_first_name} {assignee.user_last_name}
                        </span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        );
      },
      width: "150px",
      maxWidth: "150px",
      minWidth: "150px",
      header: () => <span>Assigned User</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.due_date,
      id: "due_date",
      cell: (info: any) => {
        const date: string = info.getValue();
        return <span>{date ? dayjs(date).format("MM-DD-YYYY") : "-"}</span>;
      },
      width: "120px",
      maxWidth: "120px",
      minWidth: "120px",
      header: () => <span>Due Date</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.status,
      id: "status",
      cell: (info: any) => {
        let title = info.getValue();
        return (
          <span
            className={`rounded-full px-2 leading-1 ${
              info.getValue() === "OVER_DUE"
                ? "text-[#A71D2A] bg-[#A71D2A33]"
                : info.getValue() === "TODO"
                  ? "text-[#6F42C1] bg-[#EADEFF]"
                  : info.getValue() === "COMPLETED"
                    ? "text-[#28A745] bg-[#28A74533]"
                    : info.getValue() === "IN_PROGRESS"
                      ? "text-[#007BFF] bg-[#007BFF33]"
                      : "text-black"
            }`}
          >
            <span
              className={`dot w-2 h-2 inline-block mr-1 rounded-full ${
                info.getValue() === "OVER_DUE"
                  ? "bg-[#A71D2A]"
                  : info.getValue() === "TODO"
                    ? "bg-[#6F42C1]"
                    : info.getValue() === "COMPLETED"
                      ? "bg-[#28A745]"
                      : info.getValue() === "IN_PROGRESS"
                        ? "bg-[#007BFF]"
                        : "text-black"
              }`}
            ></span>
            <span className="text-[12px] font-medium">
              {title
                ? taskStatusConstants.find(
                    (item: any) => item.value === info.getValue()
                  )?.label
                : "-"}
            </span>
          </span>
        );
      },
      width: "120px",
      maxWidth: "120px",
      minWidth: "120px",
      header: () => <span>Status</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.priority,
      id: "priority",
      cell: (info: any) => {
        const priorityValue = info.getValue();
        const priorityLabel =
          taskPriorityConstants.find(
            (item: any) => item.value === priorityValue
          )?.value || "-";
        const ArrowIcon =
          priorityValue === "HIGH"
            ? ArrowUp
            : priorityValue === "MEDIUM"
              ? ArrowRight
              : priorityValue === "LOW"
                ? ArrowDown
                : null;

        return (
          <>
            <span
              className="capitalize text-[12px] leading-1 px-2 rounded-full font-medium flex justify-center items-center"
              style={{
                backgroundColor:
                  bgColorObjectForStatus[priorityLabel] || "gray",
                color: colorObjectForStatus[priorityLabel] || "black",
              }}
            >
              {ArrowIcon && (
                <ArrowIcon
                  style={{ marginRight: "4px" }}
                  className="!w-[16px] !h-[16px]"
                />
              )}
              {priorityLabel}
            </span>
          </>
        );
      },
      width: "110px",
      maxWidth: "110px",
      minWidth: "110px",
      header: () => <span>Priority</span>,
      footer: (props: any) => props.column.id,
    },

    {
      accessorFn: (row: any) => row.actions,
      id: "actions",
      cell: (info: any) => (
        <>
          <ul className="table-action-buttons flex space-x-2 items-center">
            <li>
              <Button
                title="View"
                variant={"ghost"}
                className="p-0 rounded-md w-[27px] h-[27px] border flex items-center justify-center hover:bg-[#f5f5f5]"
                onClick={() => handleView(info.row.original.id)}
              >
                <img src={viewButtonIcon} alt="view" height={18} width={18} />
              </Button>
            </li>
            <li>
              <Button
                title="Edit"
                variant={"ghost"}
                className="p-0 rounded-md w-[27px] h-[27px] border flex items-center justify-center hover:bg-[#f5f5f5]"
                onClick={() => handleEdit(info.row.original.id)}
              >
                <img
                  src={"/table/edit.svg"}
                  alt="view"
                  height={18}
                  width={18}
                />
              </Button>
            </li>
            <li>
              <Button
                title="Delete"
                onClick={() => onClickOpen(info.row.original.id)}
                variant={"ghost"}
                className="p-0 rounded-md w-[27px] h-[27px] border flex items-center justify-center hover:bg-[#f5f5f5]"
              >
                <img
                  src={"/table/delete.svg"}
                  alt="delete"
                  height={18}
                  width={18}
                />
              </Button>
            </li>
          </ul>
          <DeleteDialog
            openOrNot={open}
            label="Are you sure you want to Delete this task?"
            onCancelClick={onClickClose}
            onOKClick={deleteTask}
            deleteLoading={deleteLoading}
          />
        </>
      ),
      header: () => <span>Actions</span>,
      footer: (props: any) => props.column.id,
      width: "120px",
      minWidth: "120px",
      maxWidth: "120px",
    },
  ];
};
