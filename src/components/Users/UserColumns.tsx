import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
export const userColumns = [
  {
    accessorFn: (row: any) => row.serial,
    id: "serial",
    header: () => <span>S.No</span>,
    footer: (props: any) => props.column.id,
    width: "60px",
    maxWidth: "60px",
    minWidth: "60px",
  },

  {
    accessorFn: (row: any) => row.profile_pic,
    id: "profile_pic",
    cell: (info: any) => {
      let title = info.getValue();
      return <span>{title ? title : "-"}</span>;
    },
    width: "150px",
    maxWidth: "150px",
    minWidth: "150px",
    header: () => <span>Profile</span>,
    footer: (props: any) => props.column.id,
  },

  {
    accessorFn: (row: any) => row.fname,
    id: "fname",
    cell: (info: any) => {
      let title = info.getValue();
      return <span>{title ? title : "-"}</span>;
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
      return <span>{title ? title : "-"}</span>;
    },
    width: "150px",
    maxWidth: "150px",
    minWidth: "150px",
    header: () => <span>Last Name</span>,
    footer: (props: any) => props.column.id,
  },

  {
    accessorFn: (row: any) => row.created_at,
    id: "created_at",
    cell: (info: any) => {
      const date: string = info.getValue();
      return <span>{date ? dayjs(date).format("MM/DD/YYYY") : "-"}</span>;
    },
    width: "150px",
    maxWidth: "150px",
    minWidth: "150px",
    header: () => <span>Created on</span>,
    footer: (props: any) => props.column.id,
  },
  {
    accessorFn: (row: any) => row.email,
    id: "email",
    cell: (info: any) => {
      let title = info.getValue();
      return <span>{title ? title : "-"}</span>;
    },
    width: "150px",
    maxWidth: "150px",
    minWidth: "150px",
    header: () => <span>Email</span>,
    footer: (props: any) => props.column.id,
  },

  {
    accessorFn: (row: any) => row.phone_number,
    id: "phone_number",
    cell: (info: any) => {
      let title = info.getValue();
      return <span>{title ? title : "-"}</span>;
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
    width: "150px",
    maxWidth: "150px",
    minWidth: "150px",
    header: () => <span>Users</span>,
    footer: (props: any) => props.column.id,
  },

  {
    accessorFn: (row: any) => row.active,
    id: "active",
    cell: (info: any) => {
      const isActive = info.getValue();
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Badge
            variant="outline"
            style={{
              color: isActive ? "green" : "red",
              borderColor: isActive ? "green" : "red",
              borderStyle: "solid",
              borderWidth: "1px",
              padding: "2px 6px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                height: "10px",
                width: "10px",
                borderRadius: "50%",
                backgroundColor: isActive ? "green" : "red",
                marginRight: "8px",
              }}
            ></span>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      );
    },
    width: "150px",
    maxWidth: "150px",
    minWidth: "150px",
    header: () => <span>Status</span>,
    footer: (props: any) => props.column.id,
  },

  // columns: [
  //   {
  //     accessorFn: (row: any) => row.progress,
  //     id: "progress",
  //     width: "150px",
  //     maxWidth: "150px",
  //     minWidth: "150px",
  //     cell: (info: any) => {
  //       let title = info.getValue();
  //       return <span>{40}</span>;
  //     },
  //     header: () => <span>progress</span>,
  //     footer: (props: any) => props.column.id,
  //   },
  //   {
  //     accessorFn: (row: any) => row.completed,
  //     id: "completed",
  //     width: "150px",
  //     maxWidth: "150px",
  //     minWidth: "150px",
  //     cell: (info: any) => {
  //       let title = info.getValue();
  //       return <span>{15}</span>;
  //     },
  //     header: () => <span>completed</span>,
  //     footer: (props: any) => props.column.id,
  //   },
  //   {
  //     accessorFn: (row: any) => row.pending,
  //     id: "pending",
  //     width: "150px",
  //     maxWidth: "150px",
  //     minWidth: "150px",
  //     cell: (info: any) => {
  //       let title = info.getValue();
  //       return <span>{20}</span>;
  //     },
  //     header: () => <span>pending</span>,
  //     footer: (props: any) => props.column.id,
  //   },
  //   {
  //     accessorFn: (row: any) => row.overdue,
  //     id: "overdue",
  //     width: "150px",
  //     maxWidth: "150px",
  //     minWidth: "150px",
  //     cell: (info: any) => {
  //       let title = info.getValue();
  //       return <span>{5}</span>;
  //     },
  //     header: () => <span>Overdue</span>,
  //     footer: (props: any) => props.column.id,
  //   },
  // ],
];
