import TanStackTable from "@/components/core/TanstackTable";
import { addSerial } from "@/lib/helpers/addSerial";

import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { taskColumns } from "../TaskColumns";

import { getAllArchivedTasks } from "@/lib/services/tasks";
import { SelectTaskProjects } from "@/components/core/CommonComponents/SelectTaskProjects";
import { TasksSelectPriority } from "@/components/core/CommonComponents/TasksSelectPriority";
import { TasksSelectStatusFilter } from "@/components/core/CommonComponents/TasksSelectStatusFilter";
import UserSelectionPopover from "@/components/core/MultipleUsersSelect";
import DateRangeFilter from "@/components/core/DateRangePicker";
import { archiveTaskColumns } from "./ArchiveColumns";

const ArchivedTasks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const router = useRouter();
  const searchParams = new URLSearchParams(location.search);
  const pageIndexParam = Number(searchParams.get("page")) || 1;
  const pageSizeParam = Number(searchParams.get("page_size")) || 25;
  const orderBY = searchParams.get("order_by")
    ? searchParams.get("order_by")
    : "";
  const initialSearch = searchParams.get("search") || "";
  const initialStatus = searchParams.get("status") || "";
  const initialPrioritys = searchParams.get("priority") || "";
  const initialProject = searchParams.get("project_id") || "";
  const initialUserIds = searchParams.get("user_ids") || "";

  const [searchString, setSearchString] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(searchString);
  const [selectedDate, setSelectedDate] = useState<any>(new Date());
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [selectedProject, setSelectedProject] = useState<any>(initialProject);
  const [selectedPriority, setSelectedPriority] = useState(initialPrioritys);
  const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: pageIndexParam,
    pageSize: pageSizeParam,
    order_by: orderBY,
  });

  const { isLoading, isError, data, error, isFetching } = useQuery({
    queryKey: [
      "archives",
      pagination,
      debouncedSearch,
      selectedDate,
      selectedStatus,
      selectedPriority,
      selectedProject,
      selectedMembers,
    ],
    queryFn: async () => {
      const response = await getAllArchivedTasks({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        search_string: debouncedSearch,
        status: selectedStatus,
        priority: selectedPriority,
        project_id: selectedProject,
        user_ids: selectedMembers.map((member: any) => member.id),
        from_date: selectedDate?.length ? selectedDate[0] : null,
        to_date: selectedDate?.length ? selectedDate[1] : null,
        is_archived: true,
      });
      return response;
    },
  });

  const archivedTasksData =
    addSerial(
      data?.data?.data?.data,
      data?.data?.data?.pagination_info?.current_page,
      data?.data?.data?.pagination_info?.page_size
    ) || [];

  const handleSearchChange = (e: any) => {
    setSearchString(e.target.value);
  };

  const handleDateChange = (fromDate: any, toDate: any) => {
    if (fromDate) {
      setSelectedDate([fromDate, toDate]);
    } else {
      setSelectedDate([]);
    }
  };

  const handleSelectMembers = (selectedMembers: any) => {
    setSelectedMembers(selectedMembers);
  };

  const handlePaginationChange = ({ pageIndex, pageSize }: any) => {
    setPagination({ ...pagination, pageIndex, pageSize });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchString);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchString]);
  const columns = archiveTaskColumns;

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
                  {/* <UserSelectionPopover
                    selectedMembers={selectedMembers}
                    setSelectedMembers={handleSelectMembers}
                    // other props for UserSelectionPopover
                  /> */}
                </li>
                <li>
                  <DateRangeFilter
                    selectedDate={selectedDate}
                    setSelectedDate={handleDateChange}
                  />
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
                data={archivedTasksData}
                columns={[columns]}
                paginationDetails={data?.data?.data?.pagination_info}
                getData={handlePaginationChange}
                loading={isLoading || isFetching}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ArchivedTasks;
