import { statusConstants } from "@/lib/helpers/statusConstants";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";

const ProjectCard = ({ project }: any) => {
  const navigate = useNavigate();
  const getStatusLabel = (isActive: boolean) => {
    return isActive
      ? statusConstants.find((status) => status.value === "true")?.label
      : statusConstants.find((status) => status.value === "false")?.label;
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between h-40 w-full max-w-sm relative"
      onClick={() => {
        navigate({
          to: "/projects/view",
        });
      }}
      style={{ cursor: "pointer" }}
    >
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
          {" "}
          <Badge>{getStatusLabel(project.active)}</Badge>
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;
