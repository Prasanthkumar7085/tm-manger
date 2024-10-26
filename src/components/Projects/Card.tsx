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
    <div className="shadow-md border rounded-xl p-3">
      <div className="top_header mb-3 flex justify-between">
        <div className="company-icon">
          <img
            src={project.logo || "/favicon.png"}
            alt="company logo"
            className="object-contain w-6 h-6"
          />
        </div>
        <div className="status">
          <p className={`text-sm font-semibold ${statusColor}`}>
            {getStatusLabel(project.active)}
          </p>
        </div>
      </div>

      <div className="project-details mt-5">
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-md text-slate-600 font-semibold cursor-pointer">
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
        </div>
        <div className="m-h-[20px]">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-sm text-gray-500 cursor-pointer ">
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
        </div>

        <div className="action-button mt-10">
          <ul className="flex justify-end space-x-5">
            <li>
              <Eye
                height={16}
                width={16}
                onClick={() => {
                  navigate({
                    to: `/projects/view/${project.id}`,
                  });
                }}
              />
            </li>
            <li>
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
            </li>
            <li>
              <DeleteProjects
                setDel={setDel}
                del={del}
                project={project}
                getAllProjects={getAllProjects}
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
