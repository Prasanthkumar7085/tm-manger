import { statusConstants } from "@/lib/helpers/statusConstants";
import { useNavigate } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import DeleteProjects from "./DeleteProject";

const ProjectCard = ({ project, del, setDel }: any) => {
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
        <p className="text-sm text-gray-500">
          <Badge>{getStatusLabel(project.active)}</Badge>
        </p>

        <div className="flex gap-3">
          <Eye
            height={16}
            width={16}
            onClick={() => {
              navigate({
                to: "/projects/view",
              });
            }}
          />
          <img
            src={"/table/edit.svg"}
            alt="edit"
            height={16}
            width={16}
            onClick={() => {
              navigate({
                to: `/projects/${project.id}`,
              });
            }}
          />

          <DeleteProjects setDel={setDel} del={del} project={project} />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
