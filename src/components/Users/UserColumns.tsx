import { useEffect, useRef, useState } from "react";
import { updateUserStatueAPI } from "@/lib/services/users";
import { toast } from "sonner";
export const userColumns = [
  {
    accessorFn: (row: any) => row.serial,
    id: "serial",
    header: () => <span>S.No</span>,
    footer: (props: any) => props.column.id,
    width: "50px",
    maxWidth: "50px",
    minWidth: "50px",
    cell: (props: any) => (
      <div style={{ textAlign: "left" }}>
        {props.getValue()}
      </div>
    ),
  },
  {
    accessorFn: (row: any) => row.fname,
    id: "fname",
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
      return <span>{title ? title : "-"}</span>;
    },
    width: "200px",
    maxWidth: "200px",
    minWidth: "200px",
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
    width: "120px",
    maxWidth: "120px",
    minWidth: "120px",
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
    width: "130px",
    maxWidth: "130px",
    minWidth: "130px",
    header: () => <span>Mobile Number</span>,
    footer: (props: any) => props.column.id,
  },

  {
    accessorFn: (row: any) => row.user_type,
    id: "user_type",
    width: "80px",
    maxWidth: "80px",
    minWidth: "80px",
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
    accessorFn: (row: any) => row.todo_count,
    id: "todo_count",
    cell: (info: any) => {
      let title = info.getValue();
      return (
        <div style={{ textAlign: "left" }}>
          <span>{title ? title : "-"}</span>
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
          <span>{title ? title : "-"}</span>
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
          <span>{title ? title : "-"}</span>
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
          <span>{title ? title : "-"}</span>
        </div>
      );
    },
    width: "100px",
    maxWidth: "100px",
    minWidth: "100px",
    header: () => <span>Completed</span>,
    footer: (props: any) => props.column.id,
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
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              color: isActive ? "#28A745" : "#A71D2A",
              background: isActive ? "#28A74533" : "#A71D2A33",
            }}
            className="rounded-full cursor-pointer flex items-center py-0 px-3 min-w-[90px]"
            onClick={togglePopover}
          >
            <span
              style={{
                height: "8px",
                width: "8px",
                borderRadius: "50%",
                backgroundColor: isActive ? "green" : "red",
                marginRight: "8px",
              }}
            ></span>
            {isActive ? "Active" : "Inactive"}
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
                zIndex: 100,
              }}
            >
              <div
                style={{
                  padding: "5px 10px",
                  cursor: "pointer",
                  color: "green",
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
    width: "130px",
    maxWidth: "130px",
    minWidth: "130px",
    header: () => <span>Status</span>,
    footer: (props: any) => props.column.id,
  },
];
