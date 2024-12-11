import { useState } from "react";
import { Button } from "@mui/material";
import * as XLSX from "xlsx";
import { useQuery } from "@tanstack/react-query";
import { exportProjectsAPI } from "@/lib/services/projects";
import { momentWithTimezone } from "@/lib/helpers/timeZone";

interface ExportProjectsProps {
  selectedStatus?: string;
  orderBy: any;
  search_string?: string;
}

export const ExportProjects = ({
  selectedStatus,
  orderBy,
  search_string,
}: ExportProjectsProps) => {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);

  const queryParams = {
    status: selectedStatus,
    order_by: orderBy,
    search_string: search_string,
  };

  const { refetch, isLoading, isError, data } = useQuery({
    queryKey: ["getExportProjects", selectedStatus, orderBy, search_string],
    queryFn: async () => {
      const response = await exportProjectsAPI(queryParams);
      const projectData = response?.data?.data.map((project: any) => ({
        ID: project.id || "--",
        Title: project.title || "--",
        Description: project.description || "--",
        Code: project.code || "--",
        Slug: project.slug || "--",
        Status: project.active ? "Active" : "Inactive",
        "Created At": momentWithTimezone(project.created_at) || "--",
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
    },
    enabled: false,
  });

  const exportToCSV = async () => {
    setLoading(true);
    try {
      await refetch();
      const projectData = projects.length > 0 ? projects : [];
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
      <Button onClick={exportToCSV} disabled={loading}>
        {loading ? "Exporting..." : "Export  "}
      </Button>
    </div>
  );
};
