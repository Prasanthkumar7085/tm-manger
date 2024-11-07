import dayjs from "dayjs";
import { Button } from "../ui/button";
import { useNavigate } from "@tanstack/react-router";
import viewButtonIcon from "@/assets/view.svg";
import { useState } from "react";
import DeleteDialog from "../core/deleteDialog";
import { toast } from "sonner";
import { deleteTaskAPI } from "@/lib/services/tasks";
import {
  bgColorObjectForStatus,
  colorObjectForStatus,
  taskPriorityConstants,
  taskStatusConstants,
} from "@/lib/helpers/statusConstants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Badge } from "../ui/badge";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";

export const taskColumns = ({ setDel }: any) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    },
    {
      accessorFn: (row: any) => row.project_title,
      id: "project_title",
      cell: (info: any) => {
        const title = info.getValue();
        const project_logo_url =
          info.row.original.project_logo_url || "/favicon.png";
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "16px",
              textAlign: "left",
            }}
          >
            {project_logo_url && (
              <img
                src={project_logo_url}
                alt="project logo"
                style={{
                  width: "24px",
                  height: "24px",
                  marginRight: "8px",
                  borderRadius: "50%",
                }}
              />
            )}
            <span className="capitalize">{title ? title : "-"}</span>
          </div>
        );
      },
      width: "150px",
      maxWidth: "150px",
      minWidth: "150px",
      header: () => <span>Projects</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => ({ ref_id: row.ref_id, title: row.title }),
      id: "title",
      cell: (info: any) => {
        const { ref_id, title } = info.getValue();
        return (
          <span className="flex justify-between capitalize">
            <span>{title || "-"}</span>
            <span className="ml-2">[{ref_id}]</span>
          </span>
        );
      },
      width: "200px",
      maxWidth: "200px",
      minWidth: "200px",
      header: () => <span>Tasks</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) =>
        row.assignees.map((assignee: any) => {
          return assignee.user_profile_pic_url ? (
            <img
              src={assignee.user_profile_pic_url}
              className="profile-pic"
              style={{
                marginRight: "5px",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
              }}
            />
          ) : null;
        }),
      id: "assignees",
      cell: (info: any) => (
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          {info.getValue()}
        </div>
      ),
      width: "150px",
      maxWidth: "150px",
      minWidth: "150px",
      header: () => <span>Assigned User</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.status,
      id: "status",
      cell: (info: any) => {
        let title = info.getValue();
        return (
          <div
            className={`rounded-full cursor-pointer flex items-center py-[2px] px-3 min-w-[110px]  ${
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
              style={{
                height: "8px",
                width: "8px",
                borderRadius: "50%",
                background:
                  info.getValue() === "OVER_DUE"
                    ? "#A71D2A"
                    : info.getValue() === "TODO"
                      ? "#6F42C1"
                      : info.getValue() === "COMPLETED"
                        ? "#28A745"
                        : info.getValue() === "IN_PROGRESS"
                          ? "#007BFF"
                          : "black",
                marginRight: "8px",
              }}
            ></span>
            {title
              ? taskStatusConstants.find(
                  (item: any) => item.value === info.getValue()
                )?.label
              : "-"}
          </div>
        );
      },
      width: "115px",
      maxWidth: "115px",
      minWidth: "1150px",
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
          <span className="capitalize flex items-center gap-1">
            <Badge
              style={{
                backgroundColor:
                  bgColorObjectForStatus[priorityLabel] || "gray",
                color: colorObjectForStatus[priorityLabel] || "black",
              }}
            >
              {ArrowIcon && <ArrowIcon style={{ marginRight: "4px" }} />}
              {priorityLabel}
            </Badge>
          </span>
        );
      },
      width: "70px",
      maxWidth: "70px",
      minWidth: "70px",
      header: () => <span>Priority</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.due_date,
      id: "due_date",
      cell: (info: any) => {
        const date: string = info.getValue();
        return <span>{date ? dayjs(date).format("MM-DD-YYYY") : "-"}</span>;
      },
      width: "90px",
      maxWidth: "90px",
      minWidth: "90px",
      header: () => <span>Due Date</span>,
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
                <img src={"table/edit.svg"} alt="view" height={18} width={18} />
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
      width: "80px",
      minWidth: "80px",
      maxWidth: "80px",
    },
  ];
};
