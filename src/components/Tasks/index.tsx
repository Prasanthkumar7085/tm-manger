import memberIcon from "@/assets/members.svg";
import selectDropIcon from "@/assets/select-dropdown.svg";
import { addSerial } from "@/lib/helpers/addSerial";
import { changeDateToUTC } from "@/lib/helpers/apiHelpers";
import { getAllMembers } from "@/lib/services/projects/members";
import { getAllPaginatedTasks } from "@/lib/services/tasks";
import { useQuery } from "@tanstack/react-query";
import {
  useLocation,
  useNavigate,
  useParams,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SearchFilter from "../core/CommonComponents/SearchFilter";
import { SelectTaskProjects } from "../core/CommonComponents/SelectTaskProjects";
import { TasksSelectPriority } from "../core/CommonComponents/TasksSelectPriority";
import { TasksSelectStatusFilter } from "../core/CommonComponents/TasksSelectStatusFilter";
import DateRangeFilter from "../core/DateRangePicker";
import LoadingComponent from "../core/LoadingComponent";
import UserSelectionPopover from "../core/MultipleUsersSelect";
import TanStackTable from "../core/TanstackTable";
import TotalCounts from "./Counts";
import { taskColumns } from "./TaskColumns";
import { archivetaskColumns } from "./ArchiveColumns";
import { Button } from "../ui/button";

const Tasks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const router = useRouter();
  const user_type: any = useSelector(
    (state: any) => state.auth.user.user_details?.user_type
  );
  const { projectId } = useParams({ strict: false });

  const searchParams = new URLSearchParams(location.search);
  const pageIndexParam = Number(searchParams.get("page")) || 1;
  const pageSizeParam = Number(searchParams.get("page_size")) || 25;
  const orderBY = searchParams.get("order_by") || "";
  const initialSearch = searchParams.get("search_string") || "";
  const initialStatus = searchParams.get("status") || "";
  const initialPrioritys = searchParams.get("priority") || "";
  const intialProject = searchParams.get("project_id") || "";
  const intialuserIds = searchParams.get("user_ids") || "";
  const intialisArchived = searchParams.get("isArchived") || "";

  const [searchString, setSearchString] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(searchString);
  const [selectedDate, setSelectedDate] = useState<any>([]);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [selectedProject, setSelectedProject] = useState(intialProject);
  const [selectedPriority, setSelectedPriority] = useState(initialPrioritys);
  const [dateValue, setDateValue] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const [isArchive, setIsArchive] = useState(
    intialisArchived === "true" ? true : false
  );
  const [pagination, setPagination] = useState({
    pageIndex: pageIndexParam,
    pageSize: pageSizeParam,
    order_by: orderBY,
  });

  const isDashboard = location.pathname === "/dashboard";

  const { isLoading, isError, data, isFetching } = useQuery({
    queryKey: [
      "tasks",
      pagination,
      debouncedSearch,
      selectedDate,
      selectedStatus,
      selectedPriority,
      selectedProject,
      selectedMembers,
      isArchive,
    ],
    queryFn: async () => {
      const response = await getAllPaginatedTasks({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        order_by: pagination.order_by,
        search_string: debouncedSearch,
        status: selectedStatus,
        priority: selectedPriority,
        project_id: selectedProject,
        from_date: selectedDate?.[0] || null,
        to_date: selectedDate?.[1] || null,
        user_ids: selectedMembers?.map((member: any) => member.id) || null,
        is_archived: isArchive ? "true" : "false",
      });

      if (response?.status === 200) {
        const updatedData = addSerial(
          response?.data?.data?.data || [],
          response?.data?.data?.pagination_info?.current_page,
          response?.data?.data?.pagination_info?.page_size
        );

        router.navigate({
          to: "/tasks",
          search: {
            ...pagination,
            search_string: debouncedSearch || undefined,
            status: selectedStatus || undefined,
            priority: selectedPriority || undefined,
            project_id: selectedProject || undefined,
            from_date: selectedDate?.[0] || undefined,
            to_date: selectedDate?.[1] || undefined,
            user_ids:
              selectedMembers?.length > 0
                ? selectedMembers.map((m: any) => m.id)
                : undefined,
            isArchived: isArchive ? "true" : undefined,
          },
        });

        return [updatedData, response?.data?.data?.pagination_info];
      }
    },
  });

  const { data: usersData, isLoading: membersLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await getAllMembers();
      setUsers(response?.data?.data?.data || []);
      return response?.data?.data;
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

  const handleDateChange = (fromDate: any, toDate: any) => {
    setDateValue(changeDateToUTC(fromDate, toDate));
    setSelectedDate([fromDate, toDate]);
  };

  const handleSelectMembers = (members: any) => {
    setSelectedMembers(members);
  };
  const getFullName = (user: any) => {
    return `${user?.fname || ""} ${user?.lname || ""}`;
  };

  const handleCardClick = (status: string) => {
    setSelectedStatus(status);
  };

  return (
    <section id="tasks" className="relative">
<<<<<<< HEAD
      {!isDashboard && (
        <TotalCounts
          refreshCount={pagination.pageIndex}
          isArchive={isArchive}
        />
      )}
=======
      <div>
        {!isDashboard && (
          <TotalCounts
            refreshCount={del}
            isArchive={isArchive}
            onCardClick={handleCardClick}
          />
        )}
      </div>
>>>>>>> b7cf6849a3339e07b331fed4de31866dfd9b5620
      <div className="card-container shadow-md border p-3 rounded-lg mt-3 bg-white">
        <div className="tasks-navbar">
          <ul className="flex items-center gap-4 overflow-auto">
            <li>
              <SelectTaskProjects
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
              />
            </li>
            <li>
              <TasksSelectPriority
                value={selectedPriority}
                setValue={setSelectedPriority}
              />
            </li>
            <li>
              <TasksSelectStatusFilter
                value={selectedStatus}
                setValue={setSelectedStatus}
              />
            </li>
            <li>
              <UserSelectionPopover
                usersData={usersData}
                getFullName={getFullName}
                memberIcon={memberIcon}
                selectDropIcon={selectDropIcon}
                selectedMembers={selectedMembers}
                setSelectedMembers={setSelectedMembers}
                onSelectMembers={handleSelectMembers}
              />
            </li>
            <li>
              <DateRangeFilter
                dateValue={dateValue}
                onChangeData={handleDateChange}
              />
            </li>
            <li>
              <SearchFilter
                searchString={searchString}
                setSearchString={setSearchString}
                title="Search By Task name"
              />
            </li>
            <li>
              <Button
                onClick={() => setIsArchive(!isArchive)}
                className={`${
                  isArchive ? "bg-green-700 text-white" : "bg-gray-200"
                }`}
              >
                {isArchive ? "Show Active Tasks" : "Show Archived Tasks"}
              </Button>
            </li>
          </ul>
        </div>
        <TanStackTable
          data={data?.[0] || []}
          columns={
            isArchive
              ? archivetaskColumns({ isArchive })
              : taskColumns({ isArchive })
          }
          paginationDetails={data?.[1]}
          getData={setPagination}
          loading={isLoading || isFetching}
        />
      </div>
      <LoadingComponent loading={isLoading} message="Loading Tasks..." />
    </section>
  );
};

export default Tasks;
