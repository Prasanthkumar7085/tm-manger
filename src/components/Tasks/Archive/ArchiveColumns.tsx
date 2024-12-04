import { useNavigate } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table"; // Import ColumnDef type
import { useSelector } from "react-redux";

export const archiveTaskColumns = (): any => {
  const navigate = useNavigate();
  const profileData: any = useSelector(
    (state: any) => state.auth.user.user_details
  );

  // const getColorFromInitials = (initials: string) => {
  //   const colors = [
  //     "bg-red-200",
  //     "bg-green-200",
  //     "bg-blue-200",
  //     "bg-yellow-200",
  //     "bg-purple-200",
  //     "bg-pink-200",
  //     "bg-indigo-200",
  //     "bg-teal-200",
  //     "bg-orange-200",
  //     "bg-cyan-200",
  //     "bg-amber-200",
  //     "bg-lime-200",
  //     "bg-emerald-200",
  //     "bg-fuchsia-200",
  //     "bg-rose-200",
  //   ];

  //   const index = initials?.charCodeAt(0)
  //     ? length > 0
  //       ? initials?.charCodeAt(0) % colors.length
  //       : 0
  //     : 0;
  //   return colors[index];
  // };

  const handleView = (taskId: any) => {
    navigate({
      to: `/tasks/view/${taskId}`,
    });
  };

  const handleEdit = (taskId: any) => {
    navigate({
      to: `/tasks/${taskId}`,
    });
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
      cell: (info: any) => <span>{info.getValue()}</span>,
    },
    {
      accessorFn: (row: any) => row.project_title,
      id: "project_title",
      cell: (info: any) => {
        const title = info.getValue();
        const project_logo_url =
          info.row.original.project_logo_url || "/favicon.png";
        const handleProjectsView = () => {
          navigate({
            to: `/projects/view/${info.row.original.project_id}`,
          });
        };

        return (
          <div className="project-title flex items-center gap-2">
            {project_logo_url && (
              <div className="project-logo">
                <img
                  src={project_logo_url}
                  alt="project logo"
                  className="w-[22px] h-[22px] rounded-full border bg-transparent"
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/150?text=No preview";
                  }}
                />
              </div>
            )}
            <span
              className="capitalize cursor-pointer text-black-500"
              onClick={handleProjectsView}
            >
              {title ? title : "-"}
            </span>
          </div>
        );
      },
      width: "200px",
      maxWidth: "200px",
      minWidth: "200px",
      header: () => <span>Projects</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => ({ ref_id: row.ref_id, title: row.title }),
      id: "title",
      cell: (info: any) => {
        const { ref_id, title } = info.getValue();

        const handleView = (taskId: any) => {
          navigate({
            to: `/tasks/view/${taskId}`,
          });
        };

        return (
          <div
            className="task capitalize flex justify-between cursor-pointer"
            onClick={() => handleView(info.row.original.id)}
          >
            <span
              title={title}
              className="task-title whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]"
            >
              {title || "-"}
            </span>
            <span className="ml-2 text-[11px] font-semibold text-primary">
              [{ref_id}]
            </span>
          </div>
        );
      },
      width: "350px",
      maxWidth: "350px",
      minWidth: "350px",
      header: () => <span>Tasks</span>,
      footer: (props: any) => props.column.id,
    },
  ];
};
