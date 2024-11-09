import { errPopper } from "@/lib/helpers/errPopper";
import { getAllProjectStats } from "@/lib/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import TanStackTable from "./core/TanstackTable";
import { projectWiseColumns } from "./ProjectWiseColumns";
import { addDataSerial } from "@/lib/helpers/addSerial";
import Loading from "./core/Loading";
import SearchFilter from "./core/CommonComponents/SearchFilter";
import LoadingComponent from "./core/LoadingComponent";

const ProjectDataTable = () => {
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get("search");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchString, setSearchString] = useState<any>(initialSearch || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchString);
  const [filteredData, setFilteredData] = useState<any[]>([]); // New state for filtered data

  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        const response = await getAllProjectStats();
        if (response.success) {
          return response?.data?.data;
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

  const filterDataBySearch = (data: any[], searchTerm: string) => {
    if (!searchTerm) return data;
    return data.filter((project) =>
      project.project_title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchString);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchString]);

  useEffect(() => {
    if (data) {
      const filtered = filterDataBySearch(data, debouncedSearch);
      setFilteredData(filtered);
    }
  }, [debouncedSearch, data]);

  return (
    <div className="relative">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-sans font-medium text-gray-800">
          Tasks List
        </h2>
        <div>
          <SearchFilter
            searchString={searchString}
            setSearchString={setSearchString}
            title="Search Project Name"
          />
        </div>
      </div>

      <div className="mt-5">
        <TanStackTable
          data={filteredData} // Use the filtered data here
          columns={projectWiseColumns}
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
            "total_tasks_count",
          ]}
        />
      </div>
      <LoadingComponent loading={isLoading || isFetching || loading} />
    </div>
  );
};

export default ProjectDataTable;
