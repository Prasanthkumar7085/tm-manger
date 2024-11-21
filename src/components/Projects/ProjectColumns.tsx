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
import { useSelector } from "react-redux";
import { getColorFromInitials } from "@/lib/constants/colorConstants";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

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
  const profileData: any = useSelector(
    (state: any) => state.auth.user.user_details
  );
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<any>();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isActive, setIsActive] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [openPopoverProjectId, setOpenPopoverProjectId] = useState<
    string | null
  >(null);

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
      to: `/projects/${projectId}`,
    });
  };

  const onClickClose = () => {
    setOpen(false);
  };

  const onClickOpen = (id: string) => {
    setOpen(true);
    setDeleteTaskId(id);
  };
  const togglePopover = (e: any, projectId: string) => {
    e.stopPropagation();
    setOpenPopoverProjectId((prev) => (prev === projectId ? null : projectId));
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
      width: "80px",
      maxWidth: "80px",
      minWidth: "80px",
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
      width: "150px",
      maxWidth: "150px",
      minWidth: "150px",
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
                  assignee.user_first_name[0]?.toUpperCase() +
                  assignee.user_last_name[0]?.toUpperCase();
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
                          <AvatarFallback className="capitalize">
                            {assignee.user_first_name[0].toUpperCase() +
                              assignee.user_last_name[0].toUpperCase()}
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
              onClick={(e) => {
                if (profileData.user_type === "admin") {
                  togglePopover(e, projectId);
                }
              }}
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
            {openPopoverProjectId === projectId && (
              <div
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
                  onClick={(e) => {
                    e.stopPropagation();
                    updateUserStatus(projectId, true, title, code);
                    setOpenPopoverProjectId(null);
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
                  onClick={(e) => {
                    e.stopPropagation();
                    updateUserStatus(projectId, false, title, code);
                    setOpenPopoverProjectId(null);
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
                disabled={!info.row.original?.active}
                className="p-0 rounded-md w-[27px] h-[27px] border flex items-center justify-center hover:bg-[#f5f5f5]"
                onClick={() => handleEdit(info.row.original.id)}
              >
                <img src={"table/edit.svg"} alt="edit" height={18} width={18} />
              </Button>
            </li>
            <li>
              <Button
                title="Delete"
                disabled={!info.row.original?.active}
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
