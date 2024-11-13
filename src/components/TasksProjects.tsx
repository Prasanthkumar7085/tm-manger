import { addSerial } from "@/lib/helpers/addSerial";
import { changeDateToUTC } from "@/lib/helpers/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {useSelector } from "react-redux";
import { SelectTaskProjects } from "./core/CommonComponents/SelectTaskProjects";
import { TasksSelectPriority } from "./core/CommonComponents/TasksSelectPriority";
import { TasksSelectStatusFilter } from "./core/CommonComponents/TasksSelectStatusFilter";
import SearchFilter from "./core/CommonComponents/SearchFilter";
import DateRangeFilter from "./core/DateRangePicker";
import { Button } from "./ui/button";
import TanStackTable from "./core/TanstackTable";
import { taskColumns } from "./Tasks/TaskColumns";
import LoadingComponent from "./core/LoadingComponent";
import { getAllPaginatedTasks } from "@/lib/services/tasksprojects";

const TasksProjects = () => {
  const navigate = useNavigate();
  const router = useRouter();
  const location = useLocation();
  const { projectId } = useParams({ strict: false });
  const user_type: any = useSelector(
    (state: any) => state.auth.user.user_details?.user_type
  );

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
  const [del, setDel] = useState<any>(1);
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
  const { isLoading, isError, data, error, isFetching} = useQuery({
    queryKey: [
      "tasks",
      pagination,
      debouncedSearch,
      selectedDate,
      del,
      selectedStatus,
      selectedpriority,
      selectedProject,
      projectId,
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
       {
        router.navigate({
         to: `/projects/view//${projectId}`,
        search: queryParams,
      });
      }
      return response;
    },
  });

  const taksDataAfterSerial =
    addSerial(
      data?.data?.data?.data,
      data?.data?.data?.pagination_info?.current_page,
      data?.data?.data?.pagination_info?.page_size
    ) || [];

  const getAllTasks = async ({ pageIndex, pageSize, order_by}: any) => {
    setPagination({ pageIndex, pageSize, order_by});
  };

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
  return (
    <section id="tasks" className="relative">
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
                // loading={isLoading || isFetching}
                removeSortingForColumnIds={[
                  "serial",
                  "actions",
                  "project_title",
                  "assignees",
                ]}
              />
            </div>
          )}
        </div>
        <LoadingComponent loading={isLoading || isFetching} />
      </div>
    </section>
  );
};

export default TasksProjects;
