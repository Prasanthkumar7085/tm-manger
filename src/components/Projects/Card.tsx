import { statusConstants } from "@/lib/helpers/statusConstants";
import { useNavigate } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import DeleteProjects from "./DeleteProject";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { updateProjectAPI } from "@/lib/services/projects";
import { capitalizeWords } from "@/lib/helpers/CapitalizeWords";

const ProjectCard = ({
  project,
  del,
  setDel,
  getAllProjects,
  profileData,
}: any) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(project.active);
  const popoverRef = useRef<HTMLDivElement>(null);

  const togglePopover = (e: any) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const updateUserStatus = async (status: boolean) => {
    try {
      const body = {
        active: status,
        title: project.title,
        description: project.description,
        code: project.code,
      };

      const response = await updateProjectAPI(project.id, body);
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        setIsActive(status);
        await getAllProjects({
          pageIndex: 1,
          pageSize: 10,
        });
      } else {
        toast.error("Failed to change status");
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
      console.error(err);
    } finally {
      setIsOpen(false);
    }
  };

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

  const handleCardClick = () => {
    navigate({
      to: `/projects/view/${project.id}`,
    });
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      className="shadow-sm border rounded-xl p-3 cursor-pointer bg-white"
      onClick={handleCardClick}
    >
      <div className="top_header mb-3 flex justify-between">
        <div className="company-icon">
          <img
            src={project?.logo || "/favicon.png"}
            alt="company logo"
            className="object-contain w-6 h-6"
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/150?text=No preview";
            }}
          />
        </div>
        <div className="status">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                color: project.active || isActive ? "green" : "red",
                borderColor: project.active || isActive ? "green" : "red",
                borderStyle: "solid",
                borderWidth: "1px",
                padding: "2px 6px",
                display: "flex",
                alignItems: "center",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={(event) => {
                togglePopover(event);
              }}
            >
              <span
                style={{
                  height: "10px",
                  width: "10px",
                  borderRadius: "50%",
                  backgroundColor: project.active || isActive ? "green" : "red",
                  marginRight: "8px",
                }}
              ></span>
              {isActive ? "Active" : "Inactive"}
            </div>
            {isOpen && (
              <div
                ref={popoverRef}
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "0",
                  marginTop: "5px",
                  padding: "5px",
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  zIndex: 100,
                }}
              >
                <div
                  style={{
                    padding: "5px 10px",
                    cursor: "pointer",
                    color: "green",
                  }}
                  onClick={(e: any) => {
                    e.stopPropagation();
                    updateUserStatus(true);
                  }}
                >
                  Active
                </div>
                <div
                  style={{
                    padding: "5px 10px",
                    cursor: "pointer",
                    color: "red",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateUserStatus(false);
                  }}
                >
                  Inactive
                </div>
              </div>
            )}
          </div>
          {/* <p className={`text-sm font-semibold ${statusColor}`}>

            {getStatusLabel(project.active)}
          </p> */}
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
        <div className="h-[30px]">
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
                  <div className="tooltipContent">{title || "--"}</div>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider> <br />
          <div className="text-[0.85rem]  border font-medium text-red-600 bg-slate-100 inline-block rounded-md px-2 py-0 mt-2">{project?.code}</div>
        </div>

        <div className="action-button mt-10">
          <ul className="flex justify-end space-x-5">
            <li className="cursor-pointer" onClick={handleActionClick}>
              <Eye
                height={16}
                width={16}
                name="view"
                onClick={() => {
                  navigate({
                    to: `/projects/view/${project.id}`,
                  });
                }}
              />
            </li>
            <li onClick={handleActionClick}>
              <img
                src={"/table/edit.svg"}
                title={project?.active ? "edit" : "Unable to edit"}
                alt="edit"
                height={16}
                width={16}
                className={project?.active ? "cursor-pointer" : `opacity-15`}
                onClick={() => {
                  if (project?.active) {
                    navigate({
                      to: `/projects/${project.id}`,
                    });
                  }
                }}
              />
            </li>
            <li onClick={handleActionClick}>
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
