import { errPopper } from "@/lib/helpers/errPopper";
import {getAllTProjectStatsAPI } from "@/lib/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import React, { useState } from "react";

const ProjectDataTable = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await getAllTProjectStatsAPI();
        if (response.success) {
          return response?.data?.data;
        } else {
          throw new Error("Data retrieval failed");
        }
      } catch (errData) {
        console.error(errData);
        errPopper(errData);
        throw errData;
      }
    },
  });
  return (
    <div>

    </div>
  );
};

export default ProjectDataTable;
