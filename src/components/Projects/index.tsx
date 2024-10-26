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
import useUsersHook from "./useUsersHook";
import Select from "react-select";
import { changeDateToUTC } from "@/lib/helpers/apiHelpers";

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
  const [dateValue, setDateValue] = useState<any>(
    initialStartDate && initialEndDate
      ? [new Date(initialStartDate), new Date(initialEndDate)]
      : null
  );
  const [selectedDate, setSelectedDate] = useState<any>();
  const [selectedSort, setSelectedSort] = useState(orderBY);
  const [del, setDel] = useState<any>();
  const { users, loading: usersLoading, error: usersError } = useUsersHook();

  // Transform usersData into react-select format

  const [pagination, setPagination] = useState({
    pageIndex: pageIndexParam,
    pageSize: pageSizeParam,
    order_by: selectedSort || orderBY,
  });

  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: [
      "projects",
      pagination,
      selectedProject,
      debouncedSearch,
      selectedStatus,
      dateValue,
      selectedSort,
    ],
    queryFn: async () => {
      const response = await getAllPaginatedProjectss({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        order_by: selectedSort,
        search_string: debouncedSearch,
        projectId: selectedProject,
        status: selectedStatus,
        from_date: selectedDate?.length ? selectedDate[0] : null,
        to_date: selectedDate?.length ? selectedDate[1] : null,
      });

      const queryParams = {
        current_page: +pagination.pageIndex,
        page_size: +pagination.pageSize,
        order_by: selectedSort ? selectedSort : undefined,
        search: debouncedSearch || undefined,
        project_id: selectedProject || undefined,
        status: selectedStatus || undefined,
        from_date: selectedDate?.length ? selectedDate[0] : undefined,
        to_date: selectedDate?.length ? selectedDate[1] : undefined,
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
      data?.data?.data?.pagination_info?.current_page,
      data?.data?.data?.pagination_info?.page_size
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

  const handleDateChange = (fromDate: any, toDate: any) => {
    if (fromDate) {
      setDateValue(changeDateToUTC(fromDate, toDate));
      setSelectedDate([fromDate, toDate]);
    } else {
      setDateValue([]);
      setSelectedDate([]);
    }
  };
  const userOptions = Array.isArray(users)
    ? users.map((user: any) => ({
      value: user.id,
      label: `${user.fname} ${user.lname}`,
    }))
    : [];
  console.log(userOptions, "op");

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
    <section id="projects-container">
      <div className="tasks-navbar">
        <div className="flex justify-between items-center">
          <div className="heading">
            <h2 className="text-lg">ALl (124)</h2>
          </div>
          <div className="filters">
            <ul className="flex justify-end space-x-4">
              <li>
                <SearchFilter
                  searchString={searchString}
                  setSearchString={setSearchString}
                  title="Search By title"
                />
              </li>
              <li>
                <StatusFilter value={selectedStatus} setValue={setSelectedStatus} />
              </li>
              <li>
                <SortDropDown
                  selectedSort={selectedSort}
                  setSelectedSort={setSelectedSort}
                />
              </li>
              <li>
                <Button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  onClick={handleNavigation}
                >
                  Add Project
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-auto  mt-3">
          {projectsData.length === 0 && isLoading == false ? (
            <div className="col-span-full text-center">No Projects Found</div>
          ) : (
            projectsData.map((project: any) => (
              <ProjectCard
                key={project.id}
                project={project}
                del={del}
                setDel={setDel}
                getAllProjects={getAllProjects}
              />
            ))
          )}
        </div>
      </div>
      <div className="pagination mt-10">
        <Pagination
          paginationDetails={data?.data?.data?.pagination_info}
          capturePageNum={capturePageNum}
          captureRowPerItems={captureRowPerItems}
        />
      </div>

      <LoadingComponent loading={isLoading || isFetching} />
    </section>
  );
};

export default Projects;
