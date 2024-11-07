import { errPopper } from "@/lib/helpers/errPopper";
import { getAllProjectStats } from "@/lib/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import React, {useState } from "react";
import TanStackTable from "./core/TanstackTable";
import { projectWiseColumns } from "./ProjectWiseColumns";
import { addDataSerial } from "@/lib/helpers/addSerial";
import Loading from "./core/Loading";

const ProjectDataTable = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
 
  const { isLoading, isError, error, data, isFetching } = useQuery({
  queryKey: ["dashboard"],
    queryFn: async () => {
      try {
        const response = await getAllProjectStats();
        console.log(response, "response");
        if (response.success) {
          const dataWithSerials = addDataSerial(response?.data?.data);
          return dataWithSerials;
        } else {
          throw new Error("Failed to fetch project details");
        }
      } catch (errData) {
        console.error(errData);
        errPopper(errData);
        throw errData;
      }
    },
  });
 
  return (
    <div className="relative">
      <div className="mt-5">
        <TanStackTable
          data={data}
          columns={[...projectWiseColumns]}
          loading={isLoading || isFetching || loading}
          paginationDetails={0}
          getData={getAllProjectStats}
          removeSortingForColumnIds={[
            "serial",
            "project_title",
            "task_todo_count",
            "task_inprogress_count",
            "task_completed_count",
            "task_overdue_count",
            "total_tasks_count"
          ]}
        />
      </div>
      <Loading loading={isLoading || isFetching || loading} />
    </div>
  );
};

export default ProjectDataTable;
