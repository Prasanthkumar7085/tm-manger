import dayjs from "dayjs";
export const taskColumns = [
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
    accessorFn: (row: any) => row.title,
    id: "title",
    cell: (info: any) => {
      let title = info.getValue();
      return <span>{title ? title : "-"}</span>;
    },
    width: "150px",
    maxWidth: "150px",
    minWidth: "150px",
    header: () => <span>Project</span>,
    footer: (props: any) => props.column.id,
  },
  {
    accessorFn: (row: any) => row.description,
    id: "description",
    cell: (info: any) => {
      let title = info.getValue();
      return <span>{title ? title : "-"}</span>;
    },
    width: "150px",
    maxWidth: "150px",
    minWidth: "150px",
    header: () => <span>Description</span>,
    footer: (props: any) => props.column.id,
  },
  {
    accessorFn: (row: any) => row.priority,
    id: "priority",
    cell: (info: any) => {
      let title = info.getValue();
      return <span>{title ? title : "-"}</span>;
    },
    width: "150px",
    maxWidth: "150px",
    minWidth: "150px",
    header: () => <span>Priortity</span>,
    footer: (props: any) => props.column.id,
  },
  {
    accessorFn: (row: any) => row.due_date,
    id: "due_date",
    cell: (info: any) => {
      const date: string = info.getValue();
      return <span>{date ? dayjs(date).format("MM/DD/YYYY") : "-"}</span>;
    },
    width: "150px",
    maxWidth: "150px",
    minWidth: "150px",
    header: () => <span>Due Date</span>,
    footer: (props: any) => props.column.id,
  },
];
