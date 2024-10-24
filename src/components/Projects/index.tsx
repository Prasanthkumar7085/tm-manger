import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProjectCard from "./Card";
import { Button } from "../ui/button";
import { useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import { addSerial } from "@/lib/helpers/addSerial";
import { getAllPaginatedProjectss } from "@/lib/services/projects";
import SearchFilter from "../core/CommonComponents/SearchFilter";
import { StatusFilter } from "../core/StatusFilter";
import Pagination from "../core/Pagination";
import DateRangeFilter from "../core/DateRangePicker";
import LoadingComponent from "../core/LoadingComponent";
import SortDropDown from "../core/CommonComponents/SortDropDown";

const Projects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const router = useRouter();
  const searchParams = new URLSearchParams(location.search);

  const pageIndexParam = Number(searchParams.get("page")) || 1;
  const pageSizeParam = Number(searchParams.get("page_size")) || 10;
  const orderBY = searchParams.get("order_by") || "";
  const initialSearch = searchParams.get("search") || "";
  const initialStatus = searchParams.get("status") || "";
  const initialStartDate = searchParams.get("start_date") || null;
  const initialEndDate = searchParams.get("end_date") || null;

  const [searchString, setSearchString] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(searchString);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [dateValue, setDateValue] = useState<[Date | null, Date | null] | null>(
    initialStartDate && initialEndDate
      ? [new Date(initialStartDate), new Date(initialEndDate)]
      : null
  );
  const [selectedSort, setSelectedSort] = useState(orderBY);
  const [del, setDel] = useState<any>();

  const [pagination, setPagination] = useState({
    pageIndex: pageIndexParam,
    pageSize: pageSizeParam,
    order_by: selectedSort || orderBY,
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

      const queryParams = {
        current_page: +pagination.pageIndex,
        page_size: +pagination.pageSize,
        order_by: pagination.order_by ? pagination.order_by : undefined,
        search: debouncedSearch || undefined,
        project_id: selectedProject || undefined,
        status: selectedStatus || undefined,
        start_date: dateValue ? dateValue[0]?.toISOString() : undefined,
        end_date: dateValue ? dateValue[1]?.toISOString() : undefined,
      };
      router.navigate({
        to: "/projects",
        search: queryParams,
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

  const getAllProjects = async ({ pageIndex, pageSize, order_by }: any) => {
    setPagination({ pageIndex, pageSize, order_by });
  };

  const capturePageNum = (value: number) => {
    getAllProjects({
      ...searchParams,
      pageSize: searchParams.get("page_size")
        ? searchParams.get("page_size")
        : 25,
      pageIndex: value,
      order_by: selectedSort || searchParams.get("order_by"),
    });
  };

  const captureRowPerItems = (value: number) => {
    getAllProjects({
      ...searchParams,
      pageSize: value,
      pageIndex: 1,
      order_by: selectedSort || searchParams.get("order_by"),
    });
  };

  const handleDateChange = (startDate: string, endDate: string) => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    setDateValue([start, end]);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchString);
      if (searchString || selectedStatus || dateValue) {
        getAllProjects({
          pageIndex: 1,
          pageSize: pageSizeParam,
          order_by: selectedSort || orderBY,
        });
      } else {
        getAllProjects({
          pageIndex: pageIndexParam,
          pageSize: pageSizeParam,
          order_by: selectedSort || orderBY,
        });
      }
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchString, selectedSort, selectedStatus, dateValue]);

  return (
    <div className="p-4">
      <div className="flex w-full gap-4 justify-end">
        <SearchFilter
          searchString={searchString}
          setSearchString={setSearchString}
          title="Search By Name"
        />
        <StatusFilter value={selectedStatus} setValue={setSelectedStatus} />
        <DateRangeFilter
          dateValue={dateValue}
          onChangeData={handleDateChange}
        />
        <SortDropDown
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
        />

        <div className="flex">
          <Button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={handleNavigation}
          >
            Add Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-auto h-[70vh] mt-3">
        {projectsData.length === 0 && isLoading == false ? (
          <div className="col-span-full text-center">No Projects Found</div>
        ) : (
          projectsData.map((project: any) => (
            <ProjectCard
              key={project.id}
              project={project}
              del={del}
              setDel={setDel}
            />
          ))
        )}
      </div>

      <div className="mb-0">
        <Pagination
          paginationDetails={data?.data?.data?.pagination_info}
          capturePageNum={capturePageNum}
          captureRowPerItems={captureRowPerItems}
        />
      </div>
      <LoadingComponent loading={isLoading} />
    </div>
  );
};

export default Projects;
