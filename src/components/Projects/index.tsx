import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProjectCard from "./Card";
import { Button } from "../ui/button";
import { useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import Pagination from "../core/Pagination";
import { addSerial } from "@/lib/helpers/addSerial";
import { getAllPaginatedProjectss } from "@/lib/services/projects";
import { Input } from "../ui/input";

const Projects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const router = useRouter();
  const searchParams = new URLSearchParams(location.search);
  const pageIndexParam = Number(searchParams.get("page")) || 1;
  const pageSizeParam = Number(searchParams.get("page_size")) || 10;
  const orderBY = searchParams.get("order_by") || "";
  const initialSearch = searchParams.get("search") || "";
  const [searchString, setSearchString] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(searchString);

  const [pagination, setPagination] = useState({
    pageIndex: pageIndexParam,
    pageSize: pageSizeParam,
    order_by: orderBY,
  });
  console.log(pagination, "plpl");
  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["projects", pagination],
    queryFn: async () => {
      const response = await getAllPaginatedProjectss({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        order_by: pagination.order_by,
        search: debouncedSearch,
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
  console.log(usersData, "users");

  const getAllProjects = async ({ pageIndex, pageSize, order_by }: any) => {
    setPagination({ pageIndex, pageSize, order_by });
  };

  const handleView = () => {
    navigate({
      to: "/tasks/view",
    });
  };

  const userActions = [
    {
      accessorFn: (row: any) => row.actions,
      id: "actions",
      cell: (info: any) => {
        return (
          <div>
            <Button
              title="View"
              size={"sm"}
              variant={"ghost"}
              onClick={handleView}
            >
              <img
                src={"/src/assets/view.svg"}
                alt="view"
                height={16}
                width={16}
              />
            </Button>
          </div>
        );
      },
      header: () => <span>Actions</span>,
      footer: (props: any) => props.column.id,
      width: "80px",
      minWidth: "80px",
      maxWidth: "80px",
    },
  ];

  const handleNavigation = () => {
    navigate({
      to: "/projects/add",
    });
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <Input
          type="text"
          placeholder="Search by name"
          className="border px-3 py-2 rounded-lg"
        />
        <div className="flex ">
          <Button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={handleNavigation}
          >
            Add Project
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
    </div>
  );
};

export default Projects;
