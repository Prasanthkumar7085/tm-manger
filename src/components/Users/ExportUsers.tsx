import { useState } from "react";
import { Button } from "@mui/material";
import * as XLSX from "xlsx";
import { useQuery } from "@tanstack/react-query";
import { exportUsersAPI } from "@/lib/services/users";
import { momentWithTimezone } from "@/lib/helpers/timeZone";

interface ExportUsersProps {
  selectedStatus?: string;
  selectedUserType?: string;
  search_string?: string;
  pagination?: any;
}

export const ExportUsers = ({
  selectedStatus,
  selectedUserType,
  search_string,
  pagination,
}: ExportUsersProps) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const queryParams = {
    status: selectedStatus,
    user_type: selectedUserType,
    search_string: search_string,
    order_by: pagination?.order_by,
  };

  const { isLoading, isError } = useQuery({
    queryKey: ["getExportUsers", selectedStatus, selectedUserType],
    queryFn: async () => {
      const response = await exportUsersAPI(queryParams);
      const userData = response?.data?.data.map((user: any) => ({
        Name: `${user.fname} ${user.lname}` || "--",
        Email: user.email || "--",
        "User Type": user.user_type || "--",
        Status: user.active ? "Active" : "Inactive",
        Designation: user.designation || "--",
        "Phone Number": user.phone_number || "--",

        "Created On": momentWithTimezone(user.created_at) || "--",
        "Deleted On": momentWithTimezone(user.deleted_at) || "--",
      }));
      setUsers(userData || []);
    },
    enabled: Boolean(selectedStatus || selectedUserType),
  });

  const exportToCSV = async () => {
    setLoading(true);

    try {
      const userData = users.length > 0 ? users : [];

      if (userData.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(userData);
        const csvData = XLSX.utils.sheet_to_csv(worksheet);

        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "Users.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error exporting users to CSV:", error);
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
          sx={{
            backgroundColor: "#0056b3",
            color: "#fff",
            fontWeight: "bold",
            textTransform: "capitalize",
            padding: "10px 20px",
            fontSize: "14px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: "#0056b3",
            },
            "&:disabled": {
              backgroundColor: "#ccc",
              color: "#666",
            },
          }}
          onClick={exportToCSV}
          disabled={loading || users.length === 0}
        >
          {loading ? "Exporting..." : "Export "}
        </Button>
      </div>
    </>
  );
};
