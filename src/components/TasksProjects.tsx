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
import SearchFilter from "./core/CommonComponents/SearchFilter";
import UserSelectionPopover from "./core/MultipleUsersSelect";
import DateRangeFilter from "./core/DateRangePicker";
import { TasksSelectStatusFilter } from "./core/CommonComponents/TasksSelectStatusFilter";
import { TasksSelectPriority } from "./core/CommonComponents/TasksSelectPriority";
import { Button } from "./ui/button";
import { archivetaskColumns } from "./Tasks/ArchiveColumns";
import { taskColumns } from "./Tasks/TaskColumns";
import TanStackTable from "./core/TanstackTable";
import LoadingComponent from "./core/LoadingComponent";
import TagsSearchFilter from "./core/CommonComponents/TagsSearchFilter";

const TasksProjects = ({ setSelectedStatus, selectedStatus }: any) => {
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
  const orderBY = searchParams.get("order_by")
    ? searchParams.get("order_by")
    : "";
  const initialSearch = searchParams.get("search_string") || "";
  const initialStatus = searchParams.get("status") || "";
  const initialPrioritys = searchParams.get("priority") || "";
  const intialProject = searchParams.get("project_id") || "";
  const intialuserIds = searchParams.get("user_ids") || "";
  const intialisArchived = searchParams.get("isArchived") || "";

  const [searchString, setSearchString] = useState<any>(initialSearch);
  const [selectedTags, setSelectedTags] = useState<any>([]);
  const [debouncedSearch, setDebouncedSearch] = useState(searchString);
  const [selectedDate, setSelectedDate] = useState<any>(new Date());
  const [selectedProject, setSelectedProject] = useState<any>(intialProject);
  const [selectedpriority, setSelectedpriority] = useState(initialPrioritys);
  const [dateValue, setDateValue] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [del, setDel] = useState<any>(1);
  const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
  const [isArchive, setIsArchive] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: pageIndexParam,
    pageSize: pageSizeParam,
    order_by: orderBY,
  });

  const isDashboard = location.pathname === "/dashboard";

  const { isLoading, isError, data, error, isFetching } = useQuery({
    queryKey: [
      "tasks",
      pagination,
      debouncedSearch,
      selectedDate,
      del,
      selectedStatus,
      selectedpriority,
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
        priority: selectedpriority,
        project_id: projectId,
        from_date: selectedDate?.length ? selectedDate[0] : null,
        to_date: selectedDate?.length ? selectedDate[1] : null,
        user_ids: selectedMembers?.map((member: any) => member.id) || null,
        is_archived: isArchive ? "true" : "false",
      });

      let queryParams: any = {
        current_page: +pagination.pageIndex,
        page_size: +pagination.pageSize,
        order_by: pagination.order_by ? pagination.order_by : undefined,
        search_string: debouncedSearch || undefined,
        from_date: selectedDate?.length ? selectedDate[0] : undefined,
        to_date: selectedDate?.length ? selectedDate[1] : undefined,
        status: selectedStatus || undefined,
        project_id: projectId,
        priority: selectedpriority || undefined,
        isArchived: isArchive ? "true" : "false",
      };
      if (selectedMembers?.length > 0) {
        queryParams["user_ids"] = selectedMembers.map(
          (member: any) => member.id
        );
      }

      if (response?.status == 200) {
        router.navigate({
          to: `/projects/view//${projectId}`,
          search: queryParams,
        });
        let responseAfterSerial: any =
          addSerial(
            response?.data?.data?.data,
            response?.data?.data?.pagination_info?.current_page,
            response?.data?.data?.pagination_info?.page_size
          ) || [];
        return [responseAfterSerial, response?.data?.data?.pagination_info];
      }
    },
  });

  const getAllTasks = async ({ pageIndex, pageSize, order_by }: any) => {
    setPagination({ pageIndex, pageSize, order_by });
  };

  const getFullName = (user: any) => {
    return `${user?.fname || ""} ${user?.lname || ""}`;
  };

  const { data: usersData, isLoading: membersLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await getAllMembers();
      const data = response?.data;
      setUsers(data?.data?.data || []);
      return response?.data?.data;
    },
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchString);
      if (
        searchString ||
        selectedStatus ||
        selectedpriority ||
        selectedProject ||
        isArchive
      ) {
        getAllTasks({
          pageIndex: 1,
          pageSize: pageSizeParam,
          order_by: orderBY,
        });
      } else {
        getAllTasks({
          pageIndex: pageIndexParam,
          pageSize: pageSizeParam,
          order_by: orderBY,
        });
      }
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [
    searchString,
    selectedStatus,
    selectedpriority,
    selectedProject,
    selectedMembers,
    isArchive,
  ]);

  const handleDateChange = (fromDate: any, toDate: any) => {
    if (fromDate) {
      setDateValue(changeDateToUTC(fromDate, toDate));
      setSelectedDate([fromDate, toDate]);
    } else {
      setDateValue([]);
      setSelectedDate([]);
    }
  };

  const handleSelectMembers = (selectedMembers: any) => {
    setSelectedMembers(selectedMembers);
  };

  const handleCardClick = (status: string) => {
    setSelectedStatus(status);
  };

  return (
    <section id="tasks" className="relative">
      <div className="card-container shadow-md border p-3 rounded-lg mt-3 bg-white">
        <div className="tasks-navbar">
          <div className="flex items-center">
            <div className="filters w-[100%] flex items-center gap-x-4 ">
              <ul className="flex justify-start space-x-3 py-1 overflow-auto w-[100%] scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
                <li>
                  <SearchFilter
                    searchString={searchString}
                    setSearchString={setSearchString}
                    title="Search By Task name"
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
                  <TasksSelectStatusFilter
                    value={selectedStatus}
                    setValue={setSelectedStatus}
                  />
                </li>
                <li>
                  <TasksSelectPriority
                    value={selectedpriority}
                    setValue={setSelectedpriority}
                  />
                </li>
              </ul>
              <div>
                <Button
                  title={`${
                    isArchive || searchParams.get("isArchived") === "true"
                      ? "Show Active Tasks"
                      : "Show Archived Tasks"
                  }`}
                  className={`font-normal text-sm flex  ${
                    isArchive || searchParams.get("isArchived") === "true"
                      ? "bg-green-700 hover:bg-green-700 text-white"
                      : "bg-white hover:bg-gray-200 border border-[#1b2459]"
                  } max-w-[50px] w-[50px] overflow-hidden truncate`}
                  size="sm"
                  onClick={() => setIsArchive(!isArchive)}
                >
                  <img
                    src={
                      isArchive || searchParams.get("isArchived") === "true"
                        ? "/active-icon.svg"
                        : "/archive.svg"
                    }
                    alt={
                      isArchive || searchParams.get("isArchived") === "true"
                        ? "active"
                        : "archive"
                    }
                    height={18}
                    width={18}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-4 space-y-5">
          <div>
            <TanStackTable
              data={data?.[0]?.length > 0 ? data?.[0] : []}
              columns={
                isArchive || searchParams.get("isArchived") == "true"
                  ? archivetaskColumns({ setDel, isArchive })
                  : taskColumns({ setDel, isArchive })
              }
              paginationDetails={data?.[1]}
              getData={getAllTasks}
              loading={isLoading || isFetching}
              removeSortingForColumnIds={[
                "serial",
                "actions",
                "project_title",
                "assignees",
                "status",
              ]}
            />
          </div>
        </div>
      </div>
      <LoadingComponent loading={isLoading} message="Loading Tasks..." />
    </section>
  );
};

export default TasksProjects;
