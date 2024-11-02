import dayjs from "dayjs";
import { Button } from "../ui/button";
import { useNavigate } from "@tanstack/react-router";
import viewButtonIcon from "@/assets/view.svg";
import { useState } from "react";
import DeleteDialog from "../core/deleteDialog";
import { toast } from "sonner";
import { deleteTaskAPI } from "@/lib/services/tasks";
import {
  taskPriorityConstants,
  taskStatusConstants,
} from "@/lib/helpers/statusConstants";

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
      width: "30px",
      maxWidth: "30px",
      minWidth: "30px",
    },
    {
      accessorFn: (row: any) => row.project_title,
      id: "project_title",
      cell: (info: any) => (
        <span className="capitalize">{info.getValue()}</span>
      ),
      width: "150px",
      maxWidth: "150px",
      minWidth: "150px",
      header: () => <span>Project</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.title,
      id: "title",
      cell: (info: any) => (
        <span className="capitalize">{info.getValue() || "-"}</span>
      ),
      width: "150px",
      maxWidth: "150px",
      minWidth: "150px",
      header: () => <span>Task Name</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.description,
      id: "description",
      cell: (info: any) => (
        <span className="capitalize">{info.getValue() || "-"}</span>
      ),
      width: "150px",
      maxWidth: "150px",
      minWidth: "150px",
      header: () => <span>Description</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.status,
      id: "status",
      cell: (info: any) => {
        let title = info.getValue();
        return (
          <span className="capitalize">
            {title
              ? taskStatusConstants.find(
                (item: any) => item.value === info.getValue()
              )?.label
              : "-"}
          </span>
        );
      },
      width: "90px",
      maxWidth: "90px",
      minWidth: "90px",
      header: () => <span>Status</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.priority,
      id: "priority",
      cell: (info: any) => (
        <span className="capitalize">
          {taskPriorityConstants.find(
            (item: any) => item.value === info.getValue()
          )?.label || "-"}
        </span>
      ),
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
                onClick={() => handleView(info.row.original.id)} // Pass the task ID
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
                  height={18} width={18}
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
