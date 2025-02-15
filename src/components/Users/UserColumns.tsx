import { useEffect, useRef, useState } from "react";
import { updateUserStatueAPI } from "@/lib/services/users";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";

const UserColumns = () => {
  const router = useRouter();
  const gotoUserTasks = (id: any, status: string) => {
    let queryParmas = {
      user_ids: [id],
      status: status,
    };
    router.navigate({ to: "/tasks", search: queryParmas });
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
      cell: (props: any) => (
        <div style={{ textAlign: "left" }}>{props.getValue()}</div>
      ),
    },
    {
      accessorFn: (row: any) => row.fname,
      id: "fname",
      cell: (info: any) => {
        const title = info.getValue();
        const profilePicUrl =
          info.row.original.profile_pic || "profile-picture.png";
        const profile = `${import.meta.env.VITE_IMAGE_URL}/${profilePicUrl}`;

        return (
          <div
            style={{ display: "flex", alignItems: "center", textAlign: "left" }}
          >
            {profilePicUrl ? (
              <img
                src={`${import.meta.env.VITE_IMAGE_URL}/${profilePicUrl}`}
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = "/profile-picture.png";
                }}
                alt="Profile"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  marginRight: 8,
                }}
              />
            ) : (
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  backgroundColor: "#ccc",
                  marginRight: 8,
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
      header: () => <span>First Name</span>,
      footer: (props: any) => props.column.id,
    },

    {
      accessorFn: (row: any) => row.lname,
      id: "lname",
      cell: (info: any) => {
        let title = info.getValue();
        return (
          <div style={{ textAlign: "left" }}>
            <span className="capitalize">{title ? title : "-"}</span>
          </div>
        );
      },
      width: "150px",
      maxWidth: "150px",
      minWidth: "150px",
      header: () => <span>Last Name</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.email,
      id: "email",
      cell: (info: any) => {
        let title = info.getValue();
        return <span className="truncate">{title ? title : "-"}</span>;
      },
      width: "500px",
      maxWidth: "500px",
      minWidth: "500px",
      header: () => <span>Email</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.designation,
      id: "designation",
      cell: (info: any) => {
        let title = info.getValue();
        return (
          <div style={{ textAlign: "left" }}>
            <span className="capitalize">{title ? title : "-"}</span>
          </div>
        );
      },
      width: "150px",
      maxWidth: "150px",
      minWidth: "150px",
      header: () => <span>Designation</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.phone_number,
      id: "phone_number",
      cell: (info: any) => {
        let title = info.getValue();
        return (
          <div style={{ textAlign: "left" }}>
            <span>{title ? title : "-"}</span>
          </div>
        );
      },
      width: "150px",
      maxWidth: "150px",
      minWidth: "150px",
      header: () => <span>Mobile Number</span>,
      footer: (props: any) => props.column.id,
    },

    {
      accessorFn: (row: any) => row.user_type,
      id: "user_type",
      width: "100px",
      maxWidth: "100px",
      minWidth: "100px",
      cell: (info: any) => {
        const userType = info.getValue();
        return (
          <div style={{ textAlign: "left" }}>
            <span>{userType ? userType : "-"}</span>
          </div>
        );
      },
      header: () => <span>Type</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.counts,
      id: "counts",
      width: "160px",
      maxWidth: "160px",
      minWidth: "160px",
      header: () => <span>Users Stats</span>,
      footer: (props: any) => props.column.id,
      columns: [
        {
          accessorFn: (row: any) => row.todo_count,
          id: "todo_count",
          cell: (info: any) => {
            let title = info.getValue();
            return (
              <div style={{ textAlign: "left" }}>
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    gotoUserTasks(info.row.original.id, "TODO");
                  }}
                >
                  {title ? title : "0"}
                </span>
              </div>
            );
          },
          width: "100px",
          maxWidth: "100px",
          minWidth: "100px",
          header: () => <span>Todo</span>,
          footer: (props: any) => props.column.id,
        },
        {
          accessorFn: (row: any) => row.in_progress_count,
          id: "in_progress_count",
          cell: (info: any) => {
            let title = info.getValue();
            return (
              <div style={{ textAlign: "left" }}>
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    gotoUserTasks(info.row.original.id, "IN_PROGRESS");
                  }}
                >
                  {title ? title : "0"}
                </span>
              </div>
            );
          },
          width: "100px",
          maxWidth: "100px",
          minWidth: "100px",
          header: () => <span>In Progress</span>,
          footer: (props: any) => props.column.id,
        },
        {
          accessorFn: (row: any) => row.overdue_count,
          id: "overdue_count",
          cell: (info: any) => {
            let title = info.getValue();
            return (
              <div style={{ textAlign: "left" }}>
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    gotoUserTasks(info.row.original.id, "OVER_DUE");
                  }}
                >
                  {title ? title : "0"}
                </span>
              </div>
            );
          },
          width: "100px",
          maxWidth: "100px",
          minWidth: "100px",
          header: () => <span>Overdue</span>,
          footer: (props: any) => props.column.id,
        },
        {
          accessorFn: (row: any) => row.completed_count,
          id: "completed_count",
          cell: (info: any) => {
            let title = info.getValue();
            return (
              <div style={{ textAlign: "left" }}>
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    gotoUserTasks(info.row.original.id, "COMPLETED");
                  }}
                >
                  {title ? title : "0"}
                </span>
              </div>
            );
          },
          width: "100px",
          maxWidth: "100px",
          minWidth: "100px",
          header: () => <span>Completed</span>,
          footer: (props: any) => props.column.id,
        },
      ],
    },

    {
      accessorFn: (row: any) => row.active,
      id: "active",
      cell: (info: any) => {
        const [isActive, setIsActive] = useState(info.getValue());
        const [isOpen, setIsOpen] = useState(false);
        const popoverRef = useRef<HTMLDivElement>(null);
        const userId = info.row.original.id;
        const togglePopover = () => setIsOpen(!isOpen);
        const updateUserStatus = async (status: boolean) => {
          try {
            const body = {
              active: status,
            };

            const response = await updateUserStatueAPI(userId, body);
            if (response?.status === 200 || response?.status === 201) {
              toast.success(
                status
                  ? "User activated successfully"
                  : "User deactivated successfully"
              );
              setIsActive(status);
            } else {
              toast.error("Failed to change status");
            }
          } catch (err: any) {
            toast.error(err?.message || "Something went wrong");
            console.error(err);
          } finally {
            setIsOpen(false);
          }
        };
        useEffect(() => {
          const handleClickOutside = (event: any) => {
            if (
              popoverRef.current &&
              !popoverRef.current.contains(event.target)
            ) {
              setIsOpen(false);
            }
          };

          if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
          } else {
            document.removeEventListener("mousedown", handleClickOutside);
          }

          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, [isOpen]);

        return (
          <div
            className="text-[12px]"
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                color: info.getValue() ? "#28A745" : "#A71D2A",
                background: info.getValue() ? "#28A74533" : "#A71D2A33",
              }}
              className="rounded-full cursor-pointer flex items-center py-0 px-3 min-w-[90px]"
              onClick={togglePopover}
            >
              <span
                style={{
                  height: "8px",
                  width: "8px",
                  borderRadius: "50%",
                  backgroundColor: info.getValue() ? "green" : "red",
                  marginRight: "8px",
                }}
              ></span>
              <span>{info.getValue() ? "Active" : "Inactive"}</span>
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
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  zIndex: "999999",
                }}
              >
                <div
                  style={{
                    padding: "5px 10px",
                    cursor: "pointer",
                    color: "green",
                    zIndex: "999999",
                  }}
                  onClick={() => updateUserStatus(true)}
                >
                  Active
                </div>
                <div
                  style={{
                    padding: "5px 10px",
                    cursor: "pointer",
                    color: "red",
                  }}
                  onClick={() => updateUserStatus(false)}
                >
                  Inactive
                </div>
              </div>
            )}
          </div>
        );
      },
      width: "150px",
      maxWidth: "150px",
      minWidth: "150px",
      header: () => <span>Status</span>,
      footer: (props: any) => props.column.id,
    },
  ];
};
export default UserColumns;
