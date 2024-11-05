export const projectWiseColumns = [
    {
      accessorFn: (row: any) => row.serial,
      id: "serial",
      header: () => <span>S.No</span>,
      footer: (props: any) => props.column.id,
      width: "30px",
      maxWidth: "30px",
      minWidth: "60px",
      cell: (props: any) => (
        <div style={{ padding: "16px", textAlign: "left" }}>
          {props.getValue()}
        </div>
      ),
    },
    {
      accessorFn: (row: any) => row.project_name,
      id: "project_name",
      cell: (info: any) => {
        let title = info.getValue();
        return (
          <div style={{ padding: "16px", textAlign: "left" }}>
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
        accessorFn: (row:any) => row.task_stats.todo_count,
        id: "todo_count",
        cell: (info:any) => {
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
        footer: (props:any) => props.column.id,
      },
      {
        accessorFn: (row:any) => row.task_stats.inprogress_count,
        id: "inprogress_count",
        cell: (info:any) => {
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
        footer: (props:any) => props.column.id,
      },
      {
        accessorFn: (row:any) => row.task_stats.completed_count,
        id: "completed_count",
        cell: (info:any) => {
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
        footer: (props:any) => props.column.id,
      },
      {
        accessorFn: (row:any) => row.task_stats.overdue_count,
        id: "overdue_count",
        cell: (info:any) => {
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
        footer: (props:any) => props.column.id,
      },
      {
        accessorFn: (row:any) => row.task_stats.total_tasks,
        id: "total_tasks",
        cell: (info:any) => {
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
        footer: (props:any) => props.column.id,
      },
   
  ];
  