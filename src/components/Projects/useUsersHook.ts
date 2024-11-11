import { getAllPaginatedUsersAPI } from "@/lib/services/projects/members";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const useUsersHook = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllPaginatedUsersAPI({});
      setUsers(response.data?.data?.records || []);
    } catch (err: any) {
      setError(err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  return {
    users,
    loading,
    error,
  };
};

export default useUsersHook;
