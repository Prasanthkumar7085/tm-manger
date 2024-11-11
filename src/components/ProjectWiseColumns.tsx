export const projectWiseColumns = [
  {
    accessorFn: (row: any) => row.serial,
    id: "serial",
    header: () => <span>S.No</span>,
    footer: (props: any) => props.column.id,
    width: "35px",
    maxWidth: "35px",
    minWidth: "35px",
    enableSorging: false,
    cell: ({ row, table }: any) => (
      <span style={{ display: "flex", alignItems: "center" }}>
        {(table
          .getSortedRowModel()
          ?.flatRows?.findIndex((flatRow: any) => flatRow.id === row.id) || 0) +
          1}
      </span>
    ),
  },
  {
    accessorFn: (row: any) => row.project_title,
    id: "project_title",
    cell: (info: any) => {
      const title = info.getValue();
      const downloadUrl = info.row.original.download_url || "/favicon.png";

      return (
        <>
          <div className="project-title flex items-center gap-2">
            {downloadUrl && (
              <div className="project-logo">
                <img
                  src={downloadUrl}
                  alt="project logo"
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/150?text=No preview";
                  }}
                  className="w-[22px] h-[22px] rounded-full border bg-transparent"
                />
              </div>
            )}
            <span className="capitalize">{title ? title : "-"}</span>
          </div>
        </>
      );
    },
    width: "200px",
    maxWidth: "200px",
    minWidth: "200px",
    header: () => <span>Project Name</span>,
    footer: (props: any) => props.column.id,
  },
  {
    accessorFn: (row: any) => row.task_todo_count,
    id: "task_todo_count",
    cell: (info: any) => {
      const title = info.getValue();
      return (
        <span className=" block font-semibold">{title ? title : "0"}</span>
      );
    },
    width: "75px",
    maxWidth: "75px",
    minWidth: "75px",
    header: () => <span>Todo</span>,
    footer: (props: any) => props.column.id,
  },
  {
    accessorFn: (row: any) => row.task_inprogress_count,
    id: "task_inprogress_count",
    cell: (info: any) => {
      const title = info.getValue();
      return (
        <span className=" block font-semibold">{title ? title : "0"}</span>
      );
    },
    width: "75px",
    maxWidth: "75px",
    minWidth: "75px",
    header: () => <span>In Progress</span>,
    footer: (props: any) => props.column.id,
  },
  {
    accessorFn: (row: any) => row.task_completed_count,
    id: "task_completed_count",
    cell: (info: any) => {
      const title = info.getValue();
      return (
        <span className=" block font-semibold">{title ? title : "0"}</span>
      );
    },
    width: "75px",
    maxWidth: "75px",
    minWidth: "75px",
    header: () => <span>Completed</span>,
    footer: (props: any) => props.column.id,
  },
  {
    accessorFn: (row: any) => row.task_overdue_count,
    id: "task_overdue_count",
    cell: (info: any) => {
      const title = info.getValue();
      return (
        <span className=" block font-semibold">{title ? title : "0"}</span>
      );
    },
    width: "75px",
    maxWidth: "75px",
    minWidth: "75px",
    header: () => <span>Overdue</span>,
    footer: (props: any) => props.column.id,
  },
  {
    accessorFn: (row: any) => row.total_tasks_count,
    id: "total_tasks_count",
    cell: (info: any) => {
      const title = info.getValue();
      return (
        <span className=" block font-semibold">{title ? title : "0"}</span>
      );
    },
    width: "50px",
    maxWidth: "50px",
    minWidth: "50px",
    header: () => <span>Total</span>,
    footer: (props: any) => props.column.id,
  },
];
