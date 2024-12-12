import { exportProjectsAPI } from "@/lib/services/projects";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@mui/material";
import { momentWithTimezone } from "@/lib/helpers/timeZone";

export const ExportProjects = ({
  selectedStatus,

  search_string,
  orderBy,
}: any) => {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  console.log("Projects:", projects);

  const queryParams = {
    status: selectedStatus,

    search_string: search_string,
    order_by: orderBy,
  };

  console.log("Query Params:", queryParams);

  const { isLoading, isError, data } = useQuery({
    queryKey: ["getExportProjects", selectedStatus, orderBy, search_string],
    queryFn: async () => {
      const response = await exportProjectsAPI(queryParams);
      console.log("API Response:", response);
      const projectData = response?.data?.data.map((project: any) => ({
        Title: project.title || "--",
        Description: project.description || "--",
        Code: project.code || "--",
        Slug: project.slug || "--",
        Status: project.active ? "Active" : "Inactive",
        "Created On": momentWithTimezone(project.created_at) || "--",
        Assignees: project.assignees
          ? project.assignees
              .map(
                (assignee: any) =>
                  `${assignee.user_first_name} ${assignee.user_last_name} (${assignee.user_role})`
              )
              .join(", ")
          : "--",
      }));
      setProjects(projectData || []);
      return projectData;
    },
    enabled: Boolean(selectedStatus || search_string || orderBy),
  });

  const getProjectsDataForExport = async () => {
    try {
      const response = await exportProjectsAPI(queryParams);
      const projectData = response?.data?.data.map((project: any) => ({
        Title: project.title || "--",
        Description: project.description || "--",
        Code: project.code || "--",
        Slug: project.slug || "--",
        Status: project.active ? "Active" : "Inactive",
        "Created On": momentWithTimezone(project.created_at) || "--",
        Assignees: project.assignees
          ? project.assignees
              .map(
                (assignee: any) =>
                  `${assignee.user_first_name} ${assignee.user_last_name} (${assignee.user_role})`
              )
              .join(", ")
          : "--",
      }));
      setProjects(projectData || []);
      return projectData;
    } catch (error) {
      console.error(error);
    }
  };
  const exportToCSV = async () => {
    setLoading(true);
    try {
      let projectData = await getProjectsDataForExport();
      if (projectData.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(projectData);
        const csvData = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "Projects.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error exporting projects to CSV:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={exportToCSV}
        sx={{
          backgroundColor: "#1B2459",
          color: "#fff",

          className: "export-button",
          fontWeight: "bold",
          textTransform: "capitalize",
          padding: "6px 20px",
          fontSize: "14px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            backgroundColor: "#1B2459",
          },
          "&:disabled": {
            backgroundColor: "#ccc",
            color: "#666",
          },
        }}
        disabled={data?.length == 0}
      >
        {loading ? "Exporting..." : "Export"}
      </Button>
    </div>
  );
};
