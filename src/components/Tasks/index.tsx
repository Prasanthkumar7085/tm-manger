import { addSerial } from "@/lib/helpers/addSerial";
import { changeDateToUTC } from "@/lib/helpers/apiHelpers";
import { getAllPaginatedTasks, getAssignesListAPI } from "@/lib/services/tasks";
import { useQuery } from "@tanstack/react-query";
import {
  useLocation,
  useNavigate,
  useParams,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchFilter from "../core/CommonComponents/SearchFilter";
import { SelectTaskProjects } from "../core/CommonComponents/SelectTaskProjects";
import { TasksSelectPriority } from "../core/CommonComponents/TasksSelectPriority";
import { TasksSelectStatusFilter } from "../core/CommonComponents/TasksSelectStatusFilter";
import DateRangeFilter from "../core/DateRangePicker";
import LoadingComponent from "../core/LoadingComponent";
import TanStackTable from "../core/TanstackTable";
import { Button } from "../ui/button";
import TotalCounts from "./Counts";
import { taskColumns } from "./TaskColumns";
import { canAddTask } from "@/lib/helpers/loginHelpers";
import { toast } from "sonner";
import {
  getAllMembers,
  getProjectMembersAPI,
} from "@/lib/services/projects/members";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, Command } from "lucide-react";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import memberIcon from "@/assets/members.svg";
import selectDropIcon from "@/assets/select-dropdown.svg";
import { cn } from "@/lib/utils";
import UserSelectionPopover from "../core/MultipleUsersSelect";

const Tasks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const router = useRouter();
  const user_type: any = useSelector(
    (state: any) => state.auth.user.user_details?.user_type
  );
  const { projectId } = useParams({ strict: false });
  console.log(projectId, "id");

  const searchParams = new URLSearchParams(location.search);
  const pageIndexParam = Number(searchParams.get("page")) || 1;
  const pageSizeParam = Number(searchParams.get("page_size")) || 25;
  const orderBY = searchParams.get("order_by")
    ? searchParams.get("order_by")
    : "";
  const initialSearch = searchParams.get("search") || "";
  const initialStatus = searchParams.get("status") || "";
  const initialPrioritys = searchParams.get("priority") || "";
  const intialProject = searchParams.get("project_id") || "";
  const [searchString, setSearchString] = useState<any>(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(searchString);
  const [selectedDate, setSelectedDate] = useState<any>(new Date());
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [selectedProject, setSelectedProject] = useState<any>(intialProject);
  const [selectedpriority, setSelectedpriority] = useState(initialPrioritys);
  const [dateValue, setDateValue] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  console.log(users, "users");
  const [tempSelectedMember, setTempSelectedMember] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const [del, setDel] = useState<any>(1);
  const [selectedMembers, setSelectedMembers] = useState<any>([]);
  const [task, setTask] = useState<any>({
    title: "",
    ref_id: "",
    description: "",
    priority: "",
    status: "",
    due_date: "",
    tags: [],
    users: [],
  });

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
    ],
    queryFn: async () => {
      const response = await getAllPaginatedTasks({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        order_by: pagination.order_by,
        search_string: debouncedSearch,
        status: selectedStatus,
        priority: selectedpriority,
        project_id: selectedProject,
        from_date: selectedDate?.length ? selectedDate[0] : null,
        to_date: selectedDate?.length ? selectedDate[1] : null,
      });
      const queryParams = {
        current_page: +pagination.pageIndex,
        page_size: +pagination.pageSize,
        order_by: pagination.order_by ? pagination.order_by : undefined,
        search_string: debouncedSearch || undefined,
        from_date: selectedDate?.length ? selectedDate[0] : undefined,
        to_date: selectedDate?.length ? selectedDate[1] : undefined,
        status: selectedStatus || undefined,
        project_id: selectedProject || undefined,
        priority: selectedpriority || undefined,
      };

      if (response?.status == 200) {
        router.navigate({
          to: "/tasks",
          search: queryParams,
          replace: true,
        });

        return response;
      }
    },
  });

  const taksDataAfterSerial =
    addSerial(
      data?.data?.data?.data,
      data?.data?.data?.pagination_info?.current_page,
      data?.data?.data?.pagination_info?.page_size
    ) || [];

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
        selectedProject
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
  }, [searchString, selectedStatus, selectedpriority, selectedProject]);

  const handleNavigation = () => {
    navigate({
      to: "/tasks/add",
    });
  };

  // const handleNavigationTasks = () => {
  //   navigate({
  //     to: "/tasks/archive",
  //   });
  // };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
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

  const confirmSelection = () => {
    const newMembers = tempSelectedMember
      .map((memberId) => {
        const member = users.find((user) => user.id.toString() === memberId);
        return (
          member &&
          !selectedMembers.some((m: any) => m.id === member.id) && {
            id: member.id,
            fname: member.fname || "",
            lname: member.lname || "",
            email: member.email || "--",
            phone_number: member.phone_number || "--",
          }
        );
      })
      .filter(Boolean);

    setSelectedMembers((prev: any) => [...prev, ...newMembers]);

    setTempSelectedMember([]);
    setOpen(false);
  };

  const toggleValue = (currentValue: string) => {
    setTempSelectedMember((prev) =>
      prev.includes(currentValue)
        ? prev.filter((value) => value !== currentValue)
        : [...prev, currentValue]
    );
  };

  return (
    <section id="tasks" className="relative">
      <div>{!isDashboard && <TotalCounts refreshCount={del} />}</div>
      <div className="card-container shadow-md border p-3 rounded-lg mt-3 bg-white">
        <div className="tasks-navbar">
          <div className="flex justify-end items-center">
            <div className="filters">
              <ul className="flex justify-end space-x-3">
                <li>
                  <SelectTaskProjects
                    selectedProject={selectedProject}
                    setSelectedProject={setSelectedProject}
                  />
                </li>
                <li>
                  <TasksSelectPriority
                    value={selectedpriority}
                    setValue={setSelectedpriority}
                  />
                </li>
                <li>
                  <TasksSelectStatusFilter
                    value={selectedStatus}
                    setValue={setSelectedStatus}
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
                  <UserSelectionPopover
                    usersData={usersData}
                    getFullName={getFullName}
                    memberIcon={memberIcon}
                    selectDropIcon={selectDropIcon}
                  />
                </li>

                <li>
                  <DateRangeFilter
                    dateValue={dateValue}
                    onChangeData={handleDateChange}
                  />
                </li>
                <li>
                  <Button
                    className="font-normal text-sm"
                    variant="add"
                    size="DefaultButton"
                    onClick={handleNavigation}
                  >
                    <span className="text-xl font-normal pr-2 text-md">+</span>
                    Add Task
                  </Button>
                </li>
                {/* <li>
                  <Button
                    className="font-normal text-sm"
                    variant="add"
                    size="DefaultButton"
                    onClick={handleNavigationTasks}
                  >
                    <span className="text-xl font-normal pr-2 text-md">+</span>
                    Archive
                  </Button>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-3">
          {isError ? (
            <div>Error: {error.message}</div>
          ) : (
            <div>
              <TanStackTable
                data={taksDataAfterSerial}
                columns={taskColumns({ setDel })}
                paginationDetails={data?.data?.data?.pagination_info}
                getData={getAllTasks}
                loading={isLoading || isFetching}
                removeSortingForColumnIds={[
                  "serial",
                  "actions",
                  "project_title",
                  "assignees",
                   "status"
                ]}
              />
            </div>
          )}
        </div>
      </div>
      <LoadingComponent loading={isLoading || isFetching} />
    </section>
  );
};

export default Tasks;
