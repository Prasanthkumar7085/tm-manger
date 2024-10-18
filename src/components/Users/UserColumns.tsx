import dayjs from "dayjs";
export const userColumns = [
  // {
  //   accessorFn: (row: any) => row.serial,
  //   id: "serial",
  //   header: () => <span>S.No</span>,
  //   footer: (props: any) => props.column.id,
  //   width: "60px",
  //   maxWidth: "60px",
  //   minWidth: "60px",
  // },
  {
    accessorFn: (row: any) => row.full_name,
    id: "full_name",
    cell: (info: any) => {
      let title = info.getValue();
      return <span>{title ? title : "-"}</span>;
    },
    width: "150px",
    maxWidth: "150px",
    minWidth: "150px",
    header: () => <span>Name</span>,
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
    cell: (info: any) => {
      let title = info.getValue();
      return <span>{title ? title : "-"}</span>;
    },
    width: "150px",
    maxWidth: "150px",
    minWidth: "150px",
    header: () => <span>Users</span>,
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
     header: () => <span>Created by</span>,
     footer: (props: any) => props.column.id,
   },
  {
    accessorFn: (row: any) => row.tasks,
    id: "tasks",
    width: "150px",
    maxWidth: "150px",
    minWidth: "150px",
    header: () => <span>Tasks</span>,
    footer: (props: any) => props.column.id,
    columns:[
        {
            accessorFn: (row: any) => row.progress,
            id: "progress",
            width: "150px",
            maxWidth: "150px",
            minWidth: "150px",
            cell: (info: any) => {
                let title = info.getValue();
                return <span>{40}</span>;
              },
            header: () => <span>progress</span>,
            footer: (props: any) => props.column.id,
        },
        {
            accessorFn: (row: any) => row.completed,
            id: "completed",
            width: "150px",
            maxWidth: "150px",
            minWidth: "150px",
            cell: (info: any) => {
                let title = info.getValue();
                return <span>{40}</span>;
              },
            header: () => <span>completed</span>,
            footer: (props: any) => props.column.id,
        },
        {
            accessorFn: (row: any) => row.pending,
            id: "pending",
            width: "150px",
            maxWidth: "150px",
            minWidth: "150px",
            cell: (info: any) => {
                let title = info.getValue();
                return <span>{40}</span>;
              },
            header: () => <span>pending</span>,
            footer: (props: any) => props.column.id,
        },
        {
            accessorFn: (row: any) => row.overdue,
            id: "overdue",
            width: "150px",
            maxWidth: "150px",
            minWidth: "150px",
            cell: (info: any) => {
                let title = info.getValue();
                return <span>{40}</span>;
              },
            header: () => <span>Overdue</span>,
            footer: (props: any) => props.column.id,
        },
    ]
  },
];
