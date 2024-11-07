import { errPopper } from "@/lib/helpers/errPopper";
import { getAllProjectStats } from "@/lib/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import TanStackTable from "./core/TanstackTable";
import { projectWiseColumns } from "./ProjectWiseColumns";
import { addDataSerial } from "@/lib/helpers/addSerial";
import Loading from "./core/Loading";

const ProjectDataTable = () => {
  const searchParams = new URLSearchParams(location.search);
  // const initialSearch = searchParams.get("search") || "project_title";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // const [searchString, setSearchString] = useState<any>(initialSearch);
  // const [debouncedSearch, setDebouncedSearch] = useState(searchString);
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
  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     setDebouncedSearch(searchString);
  //     if (
  //       searchString   
  //     ) {
  //     getAllProjectStats()
  //     } else {
  //     getAllProjectStats() 
  //     }
  //   }, 500);
  //   return () => {
  //     clearTimeout(handler);
  //   };
  // }, [searchString]);
  return (
    <div className="relative">
                {/* <SearchFilter
                  searchString={searchString}
                  setSearchString={setSearchString}
                  title="Search By title"
                /> */}
              
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
