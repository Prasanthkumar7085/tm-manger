import viewButtonIcon from "@/assets/view.svg";
import { deleteTaskAPI } from "@/lib/services/tasks";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import DeleteDialog from "../core/deleteDialog";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { deleteProjectAPI } from "@/lib/services/users";
import { updateProjectAPI } from "@/lib/services/projects";

interface ProjectColumnsProps {
  setDel: React.Dispatch<React.SetStateAction<number>>;
}

export const projectColumns = ({
  setDel,
  getAllProjects,
  projectsData,
  row,
}: any) => {
  const navigate = useNavigate();

  const { projectId } = useParams({ strict: false });

  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<any>();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isActive, setIsActive] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);

  const deleteProject = async () => {
    try {
      setDeleteLoading(true);
      const response = await deleteProjectAPI(deleteTaskId);
      if (response?.status === 200 || response?.status === 201) {
        onClickClose();
        toast.success(
          response?.data?.message || "project Deleted Successfully"
        );
        setDel((prev: any) => prev + 1);
        getAllProjects();
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };
  const updateUserStatus = async (
    projectId: string,
    status: boolean,
    title: string,
    code: string
  ) => {
    try {
      const body = {
        active: status,
        title,
        code,
      };
      const response = await updateProjectAPI(projectId, body);
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        await getAllProjects({ pageIndex: 1, pageSize: 10 });
      } else {
        toast.error("Failed to change status");
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setIsOpen(false);
    }
  };

  const handleView = (projectId: string) => {
    navigate({
      to: `/projects/view/${projectId}`,
    });
  };

  const handleEdit = (projectId: string) => {
    navigate({
      to: `/projects/edit/${projectId}`,
    });
  };

  const onClickClose = () => {
    setOpen(false);
  };

  const onClickOpen = (id: string) => {
    setOpen(true);
    setDeleteTaskId(id);
  };
  const togglePopover = (e: any) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
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
      accessorFn: (row: any) => row.title,
      id: "title",
      cell: (info: any) => {
        const title = info.getValue();
        const logo = info.row.original.logo || "/favicon.png";
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "5px ",
              textAlign: "left",
            }}
          >
            {logo && (
              <img
                src={logo}
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
      header: () => <span>Project Name</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.code,
      id: "code",
      header: () => <span>Code</span>,
      cell: (info: any) => {
        return <span>{info.getValue()}</span>;
      },
      footer: (props: any) => props.column.id,
      width: "50px",
      maxWidth: "50px",
      minWidth: "50px",
    },
    {
      accessorFn: (row: any) => row.active,
      id: "active",
      cell: (info: any) => {
        const { id: projectId, title, code } = info.row.original;
        const isActive = info.getValue();
        const status = isActive ? "Active" : "Inactive";
        const statusColor = isActive ? "green" : "red";

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                color: statusColor,
                borderColor: statusColor,
                borderStyle: "solid",
                borderWidth: "1px",
                padding: "2px 6px",
                display: "flex",
                alignItems: "center",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={togglePopover}
            >
              <span
                style={{
                  height: "10px",
                  width: "10px",
                  borderRadius: "50%",
                  backgroundColor: statusColor,
                  marginRight: "8px",
                }}
              ></span>
              {status}
            </div>
            {isOpen && (
              <div
                ref={popoverRef}
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "0",
                  marginTop: "5px",
                  padding: "5px",
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  zIndex: 100,
                }}
              >
                <div
                  style={{
                    padding: "5px 10px",
                    cursor: "pointer",
                    color: "green",
                  }}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    updateUserStatus(projectId, true, title, code);
                  }}
                >
                  Active
                </div>
                <div
                  style={{
                    padding: "5px 10px",
                    cursor: "pointer",
                    color: "red",
                  }}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    updateUserStatus(projectId, false, title, code);
                  }}
                >
                  Inactive
                </div>
              </div>
            )}
          </div>
        );
      },
      header: () => <span>Status</span>,
      footer: (props: any) => props.column.id,
    },

    {
      accessorFn: (row: any) => row.description,
      id: "description",
      header: () => <span>Description</span>,
      cell: (info: any) => {
        const title = info.getValue();
        const shouldShowDescriptionTooltip = title && title.length > 30;
        const truncatedDescription = shouldShowDescriptionTooltip
          ? `${title.substring(0, 30)}...`
          : title;

        return (
          <div>
            <span className="capitalize">
              {title ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-sm text-gray-500 cursor-pointer">
                        {truncatedDescription}
                      </span>
                    </TooltipTrigger>
                    {shouldShowDescriptionTooltip && (
                      <TooltipContent
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #e0e0e0",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          borderRadius: "4px",
                          padding: "8px",
                          maxWidth: "300px",
                          fontSize: "14px",
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                        }}
                      >
                        <div className="tooltipContent">{title}</div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ) : (
                "--"
              )}
            </span>
          </div>
        );
      },
      footer: (props: any) => props.column.id,
      width: "50px",
      maxWidth: "50px",
      minWidth: "50px",
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
                <img src={"table/edit.svg"} alt="edit" height={18} width={18} />
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
            label="Are you sure you want to Delete this Project?"
            onCancelClick={onClickClose}
            onOKClick={deleteProject}
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
