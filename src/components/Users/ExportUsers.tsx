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
}

export const ExportUsers = ({
  selectedStatus,
  selectedUserType,
  search_string,
}: ExportUsersProps) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const queryParams = {
    status: selectedStatus,
    user_type: selectedUserType,
    search_string: search_string,
  };

  const { isLoading, isError } = useQuery({
    queryKey: ["getExportUsers", selectedStatus, selectedUserType],
    queryFn: async () => {
      const response = await exportUsersAPI(queryParams);
      const userData = response?.data?.data.map((user: any) => ({
        ID: user.id || "--",
        Name: `${user.fname} ${user.lname}` || "--",
        Email: user.email || "--",
        "User Type": user.user_type || "--",
        Status: user.active ? "Active" : "Inactive",
        Designation: user.designation || "--",
        PhoneNumber: user.phone_number || "--",

        CreatedAt: momentWithTimezone(user.created_at) || "--",
        DeletedAt: momentWithTimezone(user.deleted_at) || "--",
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
          onClick={exportToCSV}
          disabled={loading || users.length === 0}
        >
          {loading ? "Exporting..." : "Export "}
        </Button>
      </div>
    </>
  );
};
