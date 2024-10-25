import { statusConstants } from "@/lib/helpers/statusConstants";
import { useNavigate } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import DeleteProjects from "./DeleteProject";
import dayjs from "dayjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const ProjectCard = ({ project, del, setDel, getAllProjects }: any) => {
  const navigate = useNavigate();

  // Function to capitalize each word
  const capitalizeWords = (string: string) => {
    return string
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Determine label and color for the status
  const getStatusLabel = (isActive: boolean) => {
    return isActive
      ? statusConstants.find((status) => status.value === "true")?.label
      : statusConstants.find((status) => status.value === "false")?.label;
  };

  const statusColor = project.active ? "text-green-500" : "text-red-500";

  // Project title and description with truncation and tooltips
  const title = project.description;
  const shouldShowDescriptionTooltip = title && title.length > 30;
  const truncatedDescription = shouldShowDescriptionTooltip
    ? `${title.substring(0, 30)}...`
    : title;

  const capitalizedTitle = capitalizeWords(project.title);
  const shouldShowTitleTooltip = capitalizedTitle.length > 20;
  const truncatedTitle = shouldShowTitleTooltip
    ? `${capitalizedTitle.substring(0, 20)}...`
    : capitalizedTitle;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between h-40 w-full max-w-sm relative">
      <div className="flex flex-col items-start justify-between">
        <div className="w-8 h-8">
          <img
            src={project.logo || "/favicon.png"}
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Tooltip for the project title */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-lg font-semibold cursor-pointer">
                {truncatedTitle}
              </span>
            </TooltipTrigger>
            {shouldShowTitleTooltip && (
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
                <div className="tooltipContent">{capitalizedTitle}</div>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        {/* Tooltip for the project description */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm text-gray-500 cursor-pointer">
                {truncatedDescription}
              </span>
            </TooltipTrigger>
            {shouldShowDescriptionTooltip && (
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

        <p className={`text-sm font-semibold ${statusColor}`}>
          {getStatusLabel(project.active)}
        </p>

        {/* Action buttons */}
        <div className="flex gap-3">
          <span title="view" className="cursor-pointer">
            <Eye
              height={16}
              width={16}
              onClick={() => {
                navigate({
                  to: `/projects/view/${project.id}`,
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
