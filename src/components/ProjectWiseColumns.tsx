export const projectWiseColumns = [
  {
    accessorFn: (row: any) => row.serial,
    id: "serial",
    header: () => <span>S.No</span>,
    footer: (props: any) => props.column.id,
    width: "30px",
    maxWidth: "30px",
    minWidth: "60px",
    enableSorging: false,
    cell: (props: any) => (
      <div style={{ padding: "16px", textAlign: "left" }}>
        {props.getValue()}
      </div>
    ),
  },
  {
    accessorFn: (row: any) => row.project_title,
    id: "project_title",
    cell: (info: any) => {
      const title = info.getValue();
      const downloadUrl = info.row.original.download_url || "/favicon.png";

      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px",
            textAlign: "left",
          }}
        >
          {downloadUrl && (
            <img
              src={downloadUrl}
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
    accessorFn: (row: any) => row.task_todo_count,
    id: "task_todo_count",
    cell: (info: any) => {
      const title = info.getValue();
      return (
        <div style={{ padding: "16px", textAlign: "left" }}>
          <span className="capitalize">{title ? title : "-"}</span>
        </div>
      );
    },
    width: "150px",
    maxWidth: "150px",
    minWidth: "150px",
    header: () => <span>Todo</span>,
    footer: (props: any) => props.column.id,
  },
  {
    accessorFn: (row: any) => row.task_inprogress_count,
    id: "task_inprogress_count",
    cell: (info: any) => {
      const title = info.getValue();
      return (
        <div style={{ padding: "16px", textAlign: "left" }}>
          <span className="capitalize">{title ? title : "-"}</span>
        </div>
      );
    },
    width: "150px",
    maxWidth: "150px",
    minWidth: "150px",
    header: () => <span>In Progress</span>,
    footer: (props: any) => props.column.id,
  },
  {
    accessorFn: (row: any) => row.task_completed_count,
    id: "task_completed_count",
    cell: (info: any) => {
      const title = info.getValue();
      return (
        <div style={{ padding: "16px", textAlign: "left" }}>
          <span className="capitalize">{title ? title : "-"}</span>
        </div>
      );
    },
    width: "150px",
    maxWidth: "150px",
    minWidth: "150px",
    header: () => <span>Completed</span>,
    footer: (props: any) => props.column.id,
  },
  {
    accessorFn: (row: any) => row.task_overdue_count,
    id: "task_overdue_count",
    cell: (info: any) => {
      const title = info.getValue();
      return (
        <div style={{ padding: "16px", textAlign: "left" }}>
          <span className="capitalize">{title ? title : "-"}</span>
        </div>
      );
    },
    width: "150px",
    maxWidth: "150px",
    minWidth: "150px",
    header: () => <span>Overdue</span>,
    footer: (props: any) => props.column.id,
  },
  {
    accessorFn: (row: any) => row.total_tasks_count,
    id: "total_tasks_count",
    cell: (info: any) => {
      const title = info.getValue();
      return (
        <div style={{ padding: "16px", textAlign: "left" }}>
          <span className="capitalize">{title ? title : "-"}</span>
        </div>
      );
    },
    width: "150px",
    maxWidth: "150px",
    minWidth: "150px",
    header: () => <span>Total</span>,
    footer: (props: any) => props.column.id,
  },
];
