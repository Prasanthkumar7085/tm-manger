import { statusConstants } from "@/lib/helpers/statusConstants";
import { useNavigate } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import DeleteProjects from "./DeleteProject";
import dayjs from "dayjs";

const ProjectCard = ({ project, del, setDel, getAllProjects }: any) => {
  const navigate = useNavigate();

  const getStatusLabel = (isActive: boolean) => {
    return isActive
      ? statusConstants.find((status) => status.value === "true")?.label
      : statusConstants.find((status) => status.value === "false")?.label;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between h-40 w-full max-w-sm relative">
      <div className="flex flex-col items-start justify-between">
        <div className="w-8 h-8">
          <img
            src={"/favicon.png"}
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-lg font-semibold">{project.title}</div>
        <p className="text-sm text-gray-500">{project.description}</p>
        <div className="flex flex-row justify-between items-center w-full">
          <p className="text-sm text-gray-500">
            {dayjs(project.created_at).format("MM-DD-YYYY")}
          </p>
          <p
            className={`text-sm text-gray-500 ${getStatusLabel(project.active) == "Active" ? "text-[green]" : "text-[red]"}`}
          >
            {getStatusLabel(project.active)}
          </p>
        </div>
        <div className="flex gap-3 justify-end w-full">
          <Eye
            height={16}
            width={16}
            className="cursor-pointer"
            onClick={() => {
              navigate({
                to: `/projects/view/${project.id}`,
              });
            }}
          />
          <img
            src={"/table/edit.svg"}
            alt="edit"
            height={16}
            width={16}
            className="cursor-pointer"
            onClick={() => {
              navigate({
                to: `/projects/${project.id}`,
              });
            }}
          />

          <DeleteProjects
            setDel={setDel}
            del={del}
            project={project}
            getAllProjects={getAllProjects}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
