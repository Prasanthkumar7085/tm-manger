import { useState } from "react";
import { Button } from "@mui/material";
import * as XLSX from "xlsx";
import { useQuery } from "@tanstack/react-query";
import { getExportTasksAPI } from "@/lib/services/tasks";
import { momentWithTimezone } from "@/lib/helpers/timeZone";

export const ExportTasks = ({
  selectedProject,
  search_string,
  selectedMembers,
  selectedDate,
  selectedtags,
  selectedStatus,
  selectedPriority,
  pagination,
}: any) => {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);

  const queryParams = {
    project_id: selectedProject,
    search_string: search_string,
    user_ids: selectedMembers.map((member: any) => member.id),
    status: selectedStatus,
    priority: selectedPriority,
    from_date: selectedDate?.length ? selectedDate[0] : null,
    to_date: selectedDate?.length ? selectedDate[1] : null,
    tags: selectedtags?.length
      ? selectedtags?.map((tag: any) => tag.id)
      : undefined,
    order_by: pagination.order_by,
  };

  const { isLoading, isError } = useQuery({
    queryKey: [
      "getExportTasks",
      selectedProject,
      search_string,
      selectedMembers,
      selectedStatus,
      selectedPriority,
      selectedDate,
      selectedtags,
      pagination,
    ],
    queryFn: async () => {
      const response = await getExportTasksAPI(queryParams);
      const taskData = response?.data?.data.map((task: any) => ({
        ID: task.id || "--",
        Title: task.title || "--",
        "Reference ID": task.ref_id || "--",
        Status: task.status || "--",
        Priority: task.priority || "--",
        "Due Date": momentWithTimezone(task.due_date) || "--",
        "Project Title": task.project_title || "--",
        Assignees:
          task.assignees
            .map(
              (assignee: any) =>
                `${assignee.user_first_name} ${assignee.user_last_name}`
            )
            .join(", ") || "--",
        Tags: task.tags.join(", ") || "--",
      }));
      setTasks(taskData || []);
    },
    enabled: Boolean(
      selectedProject ||
        search_string ||
        selectedMembers ||
        selectedStatus ||
        selectedPriority ||
        selectedDate ||
        selectedtags ||
        pagination
    ),
  });

  const exportToCSV = async () => {
    setLoading(true);

    try {
      const taskData = tasks.length > 0 ? tasks : [];

      if (taskData.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(taskData);
        const csvData = XLSX.utils.sheet_to_csv(worksheet);

        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "Tasks.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error exporting tasks to CSV:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <Button
          type="button"
          className="font-normal"
          onClick={exportToCSV}
          disabled={loading || tasks.length === 0}
        >
          {loading ? "Exporting..." : "Export Tasks"}
        </Button>
      </div>
    </>
  );
};
