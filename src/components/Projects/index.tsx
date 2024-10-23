import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProjectCard from "./Card";
import { Button } from "../ui/button";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { addSerial } from "@/lib/helpers/addSerial";
import { getAllPaginatedProjectss } from "@/lib/services/projects";
import SearchFilter from "../core/CommonComponents/SearchFilter";
import { StatusFilter } from "../core/StatusFilter";
import Pagination from "../core/Pagination";
import DateRangeFilter from "../core/DateRangePicker";

const Projects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pageIndexParam = Number(searchParams.get("page")) || 1;
  const pageSizeParam = Number(searchParams.get("page_size")) || 10;
  const orderBY = searchParams.get("order_by") || "";
  const initialSearch = searchParams.get("search") || "";

  const [searchString, setSearchString] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(searchString);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateValue, setDateValue] = useState<[Date | null, Date | null] | null>(
    null
  );

  const [pagination, setPagination] = useState({
    pageIndex: pageIndexParam,
    pageSize: pageSizeParam,
    order_by: orderBY,
  });

  const { isLoading, isError, error, data } = useQuery({
    queryKey: [
      "projects",
      pagination,
      selectedProject,
      debouncedSearch,
      selectedStatus,
      dateValue,
    ],
    queryFn: async () => {
      const response = await getAllPaginatedProjectss({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        order_by: pagination.order_by,
        search_string: debouncedSearch,
        projectId: selectedProject,
        status: selectedStatus,
        start_date: dateValue ? dateValue[0]?.toISOString() : null,
        end_date: dateValue ? dateValue[1]?.toISOString() : null,
      });
      return response;
    },
  });

  const projectsData =
    addSerial(
      data?.data?.data?.records,
      data?.data?.pagination?.page,
      data?.data?.pagination?.limit
    ) || [];

  const handleNavigation = () => {
    navigate({
      to: "/projects/add",
    });
  };

  // const handleProjectSelect = (projectId: string) => {
  //   setSelectedProject(projectId);
  //   setPagination({ ...pagination, pageIndex: 1 });
  // };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: page,
    }));
  };

  const handlePageSizeChange = (limit: number) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: limit,
      pageIndex: 1,
    }));
  };

  const handleDateChange = (startDate: string, endDate: string) => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    setDateValue([start, end]);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchString);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchString]);

  return (
    <div className="p-4">
      <div className="flex w-6/12">
        <SearchFilter
          searchString={searchString}
          setSearchString={setSearchString}
          title="Search By Name"
        />
        <StatusFilter value={selectedStatus} setValue={setSelectedStatus} />
        <DateRangeFilter
          dateValue={dateValue}
          onChangeData={handleDateChange}
        />{" "}
        <div className="flex">
          <Button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={handleNavigation}
          >
            Add Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-auto h-[70vh]">
        {projectsData.length === 0 ? (
          <div className="col-span-full text-center">No Projects Found</div>
        ) : (
          projectsData.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>

      <div className="mt-4">
        <Pagination
          paginationDetails={data?.data}
          capturePageNum={handlePageChange}
          captureRowPerItems={handlePageSizeChange}
        />
      </div>
    </div>
  );
};

export default Projects;
