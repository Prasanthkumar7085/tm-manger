import { statusConstants } from "@/lib/helpers/statusConstants";
import { useNavigate } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import DeleteProjects from "./DeleteProject";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const ProjectCard = ({ project, del, setDel }: any) => {
  const navigate = useNavigate();

  const getStatusLabel = (isActive: boolean) => {
    return isActive
      ? statusConstants.find((status) => status.value === "true")?.label
      : statusConstants.find((status) => status.value === "false")?.label;
  };

  const title = project.description;
  const shouldShowTooltip = title && title.length > 30;
  const truncatedText = shouldShowTooltip
    ? `${title.substring(0, 30)}...`
    : title;

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
        <div className="text-lg font-semibold uppercase">{project.title}</div>

        {/* Tooltip for the project description */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm text-gray-500 cursor-pointer">
                {truncatedText}
              </span>
            </TooltipTrigger>
            {shouldShowTooltip && (
              <TooltipContent
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e0e0e0",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  borderRadius: "4px",
                  padding: "8px",
                  maxWidth: "300px",
                  fontSize: "14px",
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                }}
              >
                <div className="tooltipContent">{title}</div>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <p className="text-sm text-gray-500">
          <Badge>{getStatusLabel(project.active)}</Badge>
        </p>

        <div className="flex gap-3">
          <span title="view">
            <Eye
              height={16}
              width={16}
              onClick={() => {
                navigate({
                  to: "/projects/view",
                });
              }}
            />
          </span>

          <img
            src={"/table/edit.svg"}
            title="edit"
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
