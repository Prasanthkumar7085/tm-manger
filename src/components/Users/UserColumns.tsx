
import { useRef, useState } from "react";
import { updateUserStatueAPI } from "@/lib/services/users";
import { toast } from "sonner";
export const userColumns = [
  {
    accessorFn: (row: any) => row.serial,
    id: "serial",
    header: () => <span>S.No</span>,
    footer: (props: any) => props.column.id,
    width: "45px",
    maxWidth: "50px",
    minWidth: "45px",
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
    width: "170px",
    maxWidth: "170px",
    minWidth: "170px",
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
    width: "60px",
    maxWidth: "60px",
    minWidth: "60px",
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
    width: "80px",
    maxWidth: "100px",
    minWidth: "150px",
    header: () => <span>Status</span>,
    footer: (props: any) => props.column.id,
  },
];
