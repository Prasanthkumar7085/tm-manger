import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProjectCard from "./Card";
import { Button } from "../ui/button";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { addSerial } from "@/lib/helpers/addSerial";
import { getAllPaginatedProjectss } from "@/lib/services/projects";
import { Input } from "../ui/input";
import SearchField from "../core/CommonComponents/SearchFilter";
import ProjectDropDown from "../Tasks/ProjectsDropDown";
import { StatusFilter } from "../core/StatusFilter";
import Pagination from "../core/Pagination";

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

  const [pagination, setPagination] = useState({
    pageIndex: pageIndexParam,
    pageSize: pageSizeParam,
    order_by: orderBY,
  });

  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["projects", pagination, selectedProject],
    queryFn: async () => {
      const response = await getAllPaginatedProjectss({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        order_by: pagination.order_by,
        search: debouncedSearch,
        projectId: selectedProject,
      });
      return response;
    },
  });

  const usersData =
    addSerial(
      data?.data?.Projects,
      data?.data?.pagination?.page,
      data?.data?.pagination?.limit
    ) || [];

  const handleNavigation = () => {
    navigate({
      to: "/projects/add",
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
    setPagination({ ...pagination, pageIndex: 1 });
  };

  // Handle page and limit change from pagination component
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
      pageIndex: 1, // Reset to first page if limit changes
    }));
  };

  return (
    <div className="p-4 ">
      <div className="flex w-6/12">
        <SearchField value={searchString} onChange={handleSearchChange} />
        <StatusFilter />
        <div className="flex ">
          <ProjectDropDown
            projects={data?.data?.Projects}
            onSelectProject={handleProjectSelect}
          />
        </div>
        <div className="flex">
          <Button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={handleNavigation}
          >
            Add Project
          </Button>
          <Button onClick={() => navigate({ to: "/projects/view" })}>
            VIEW
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-auto h-[70vh]">
        {usersData?.length === 0 ? (
          <div className="col-span-full text-center">No Projects Found</div>
        ) : (
          usersData?.map((project: any) => (
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
