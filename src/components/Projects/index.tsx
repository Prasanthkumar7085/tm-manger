import { addSerial } from "@/lib/helpers/addSerial";
import { changeDateToUTC } from "@/lib/helpers/apiHelpers";
import { getAllPaginatedProjectss } from "@/lib/services/projects";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import SearchFilter from "../core/CommonComponents/SearchFilter";
import SortDropDown from "../core/CommonComponents/SortDropDown";
import LoadingComponent from "../core/LoadingComponent";
import Pagination from "../core/Pagination";
import { StatusFilter } from "../core/StatusFilter";
import { Button } from "../ui/button";
import ProjectCard from "./Card";
import useUsersHook from "./useUsersHook";
// Assuming TanStackTable is in the ui folder
import { projectColumns } from "./ProjectColumns";
import TanStackTable from "../core/TanstackTable";
import { useSelector } from "react-redux";
import { canAddTask } from "@/lib/helpers/loginHelpers";
import { Grid3x3, List } from "lucide-react";

const Projects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const router = useRouter();
  const searchParams = new URLSearchParams(location.search);
  const user_type: any = useSelector(
    (state: any) => state.auth.user.user_details?.user_type
  );
  const profileData: any = useSelector(
    (state: any) => state.auth.user.user_details
  );
  const pageIndexParam = Number(searchParams.get("page")) || 1;
  const pageSizeParam = Number(searchParams.get("page_size")) || 12;
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

  const [pagination, setPagination] = useState({
    pageIndex: pageIndexParam,
    pageSize: pageSizeParam,
    order_by: selectedSort || orderBY,
  });

  const [viewMode, setViewMode] = useState("card");

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

  let colums = projectColumns({ setDel, getAllProjects, projectsData });
  return (
    <section id="projects-container" className="relative">
      <div className="tasks-navbar">
        <div className="flex justify-between items-center">
          <div className="heading"></div>
          <div className="filters">
            <ul className="flex justify-end space-x-3">
              <li>
                <SearchFilter
                  searchString={searchString}
                  setSearchString={setSearchString}
                  title="Search By title"
                />
              </li>
              <li>
                <StatusFilter
                  value={selectedStatus}
                  setValue={setSelectedStatus}
                />
              </li>
              <li>
                <SortDropDown
                  selectedSort={selectedSort}
                  setSelectedSort={setSelectedSort}
                />
              </li>
              {canAddTask(user_type) && (
                <li>
                  <Button
                    variant="add"
                    size="DefaultButton"
                    className="font-normal"
                    onClick={handleNavigation}
                  >
                    <span className="text-xl pr-2">+</span>
                    Add Project
                  </Button>
                </li>
              )}
              <li>
                <button
                  className="text-white h-[35px] flex items-center justify-center bg-white border  px-3 rounded-md"
                  onClick={() =>
                    setViewMode(viewMode === "card" ? "table" : "card")
                  }
                >
                  <div className="flex">
                    <List
                      className={`mr-2 ${viewMode === "table" ? "text-[#1B2459]" : "text-[#BF1B39] "}`}
                    />
                    <Grid3x3
                      className={`${viewMode === "card" ? "text-[#1B2459]" : "text-[#BF1B39]"}`}
                    />
                  </div>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-5 overflow-auto h-[70vh]">
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 mt-3">
            {projectsData.length === 0 && !isLoading ? (
              <div className="col-span-full text-center">No Project found</div>
            ) : (
              projectsData?.map((project: any) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  del={del}
                  setDel={setDel}
                  getAllProjects={getAllProjects}
                  profileData={profileData}
                />
              ))
            )}
          </div>
        ) : (
          <TanStackTable
            data={projectsData}
            columns={colums}
            paginationDetails={data?.data?.data?.pagination_info}
            getData={getAllProjects}
            removeSortingForColumnIds={["serial", "actions", "project_title"]}
          />
        )}
      </div>

      <div className="pagination">
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
