import dayjs from "dayjs";
import { Button } from "../ui/button";
import { useNavigate } from "@tanstack/react-router";
import viewButtonIcon from "@/assets/view.svg";

export const taskColumns = () => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate({
      to: "/tasks/view",
    });
  };

  return [
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
      accessorFn: (row: any) => row.project,
      id: "project",
      cell: (info: any) => {
        return <span>{"Labsquire Core"}</span>;
      },
      width: "150px",
      maxWidth: "150px",
      minWidth: "150px",
      header: () => <span>Project</span>,
      footer: (props: any) => props.column.id,
    },
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
      header: () => <span>Task Name</span>,
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
        return <span className="capitalize">{title ? title : "-"}</span>;
      },
      width: "100px",
      maxWidth: "100px",
      minWidth: "100px",
      header: () => <span>Priortity</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.due_date,
      id: "due_date",
      cell: (info: any) => {
        const date: string = info.getValue();
        return <span>{date ? dayjs(date).format("MM-DD-YYYY") : "-"}</span>;
      },
      width: "150px",
      maxWidth: "150px",
      minWidth: "150px",
      header: () => <span>Due Date</span>,
      footer: (props: any) => props.column.id,
    },

    {
      accessorFn: (row: any) => row.actions,
      id: "actions",
      cell: (info: any) => {
        return (
          <div>
            <Button
              title="View"
              size={"sm"}
              variant={"ghost"}
              onClick={handleView}
            >
              <img src={viewButtonIcon} alt="view" height={16} width={16} />
            </Button>
          </div>
        );
      },
      header: () => <span>Actions</span>,
      footer: (props: any) => props.column.id,
      width: "80px",
      minWidth: "80px",
      maxWidth: "80px",
    },
  ];
};
