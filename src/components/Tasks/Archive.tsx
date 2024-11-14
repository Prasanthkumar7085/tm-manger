// src/components/Tasks/Archive.tsx

import { addSerial } from "@/lib/helpers/addSerial";
import { changeDateToUTC } from "@/lib/helpers/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import {
  useLocation,
  useNavigate,
  useParams,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import SearchFilter from "../core/CommonComponents/SearchFilter";
import { SelectTaskProjects } from "../core/CommonComponents/SelectTaskProjects";
import { TasksSelectPriority } from "../core/CommonComponents/TasksSelectPriority";
import { TasksSelectStatusFilter } from "../core/CommonComponents/TasksSelectStatusFilter";
import DateRangeFilter from "../core/DateRangePicker";
import TanStackTable from "../core/TanstackTable";
import { Button } from "../ui/button";
import { archiveColumns } from "./ArchiveColumns"; // Ensure this is a function that returns an array
import LoadingComponent from "../core/LoadingComponent";
import UserSelectionPopover from "../core/MultipleUsersSelect";
import { toast } from "sonner";
import { getAllArchiveTasks } from "@/lib/services/tasks";

const Archive = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const router = useRouter();

  const searchParams = new URLSearchParams(location.search);
  const pageIndexParam = Number(searchParams.get("page")) || 1;
  const pageSizeParam = Number(searchParams.get("page_size")) || 25;
  const initialSearch = searchParams.get("search") || "";

  const [searchString, setSearchString] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(searchString);
  const [selectedDate, setSelectedDate] = useState<any>(new Date());
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [dateValue, setDateValue] = useState<any>(null);
  const [selectedMembers, setSelectedMembers] = useState<any[]>([]);

  const [pagination, setPagination] = useState({
    pageIndex: pageIndexParam,
    pageSize: pageSizeParam,
  });

  // Query for archive tasks
  const { isLoading, isError, data, error, isFetching } = useQuery({
    queryKey: [
      "archiveTasks",
      pagination,
      debouncedSearch,
      selectedDate,
      selectedStatus,
      selectedPriority,
      selectedProject,
      selectedMembers,
    ],
    queryFn: async () => {
      const response = await getAllArchiveTasks({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        search_string: debouncedSearch,
        status: selectedStatus,
        priority: selectedPriority,
        project_id: selectedProject,
        from_date: selectedDate?.length ? selectedDate[0] : null,
        to_date: selectedDate?.length ? selectedDate[1] : null,
        user_ids: selectedMembers.map((member) => member.id),
      });

      if (response?.status === 200) {
        return response;
      } else {
        // Handle non-200 responses appropriately
        toast.error("Failed to fetch archived tasks.");
        throw new Error("Failed to fetch archived tasks.");
      }
    },
  });

  // Handle filters and search debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchString);
      // Optionally reset to first page on filter change
      setPagination((prev) => ({ ...prev, pageIndex: 1 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [
    searchString,
    selectedStatus,
    selectedPriority,
    selectedProject,
    selectedMembers,
  ]);

  const handleDateChange = (fromDate: any, toDate: any) => {
    if (fromDate && toDate) {
      setDateValue(changeDateToUTC(fromDate, toDate));
      setSelectedDate([fromDate, toDate]);
    } else {
      setDateValue(null);
      setSelectedDate([]);
    }
  };

  const handleNavigation = () => {
    navigate({
      to: "/tasks/add",
    });
  };

  // Invoke archiveColumns to get the columns array
  const columns = archiveColumns();

  return (
    <section id="archive" className="relative">
      <div className="card-container shadow-md border p-3 rounded-lg mt-3 bg-white">
        <div className="archive-navbar flex justify-end items-center">
          <Button
            className="mr-3 font-normal text-sm"
            onClick={handleNavigation}
          >
            Add Task
          </Button>
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
                {/* // Uncomment and pass necessary props if needed
                  // usersData={usersData}
                  // getFullName={getFullName}
                  // memberIcon={memberIcon}
                  // selectDropIcon={selectDropIcon}
                  // onSelectMembers={handleSelectMembers} */}
              </li>
              <li>
                <SearchFilter
                  searchString={searchString}
                  setSearchString={setSearchString}
                  title="Search Archived Tasks"
                />
              </li>
              <li>
                <DateRangeFilter
                  dateValue={dateValue}
                  onChangeData={handleDateChange}
                />
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-3">
          {isError ? (
            <div>Error: {error.message}</div>
          ) : (
            <TanStackTable
              data={addSerial(
                data?.data?.data || [],
                pagination.pageIndex,
                pagination.pageSize
              )}
              columns={columns} // Use the invoked columns array
              paginationDetails={data?.data?.pagination_info}
              loading={isLoading || isFetching}
              // Optionally pass other props like getData if needed
            />
          )}
        </div>
      </div>
      <LoadingComponent loading={isLoading || isFetching} />
    </section>
  );
};

export default Archive;
