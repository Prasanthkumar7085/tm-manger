import { useQuery } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { Button } from "../ui/button";
import { useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import { addSerial } from "@/lib/helpers/addSerial";
import TanStackTable from "../core/TanstackTable";
import { getAllPaginatedTasks } from "@/lib/services/tasks";
import { taskColumns } from "./TaskColumns";
import SearchFilter from "../core/CommonComponents/SearchFilter";
import Loading from "../core/Loading";
import TotalCounts from "./Counts";
import viewButtonIcon from "@/assets/view.svg";
import DatePickerField from "../core/DateRangePicker";
import { StatusFilter } from "../core/StatusFilter";
import SearchField from "../core/CommonComponents/SearchFilter";

const Tasks = () => {
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const [pagination, setPagination] = useState({
    pageIndex: pageIndexParam,
    pageSize: pageSizeParam,
    order_by: orderBY,
  });

  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["tasks", pagination],
    queryFn: async () => {
      const response = await getAllPaginatedTasks({
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
      data?.data?.Tasks,
      data?.data?.pagination?.page,
      data?.data?.pagination?.limit
    ) || [];

  const getAllUsers = async ({ pageIndex, pageSize, order_by }: any) => {
    setPagination({ pageIndex, pageSize, order_by });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchString);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchString]);

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
              <img src={viewButtonIcon} alt="view" height={16} width={16} />
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
      to: "/tasks/add",
    });
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const isDashboard = location.pathname === "/dashboard";

  return (
    <>
      <div>{!isDashboard && <TotalCounts />}</div>

      <div className="relative mt-3">
        <div className="flex justify-between mb-4 gap-3">
          <h2>Tasks</h2>
          <div className="flex flex-row gap-2">
            <DatePickerField value={selectedDate} onChange={handleDateChange} />
            <div className="flex">
              <StatusFilter />
            </div>

            <SearchField value={searchString} onChange={handleSearchChange} />
            <Button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleNavigation}
            >
              Add Task
            </Button>
          </div>
        </div>

        <div>
          {isError ? (
            <div>Error: {error.message}</div>
          ) : (
            <div>
              <TanStackTable
                data={usersData}
                columns={[...taskColumns, ...userActions]}
                paginationDetails={data?.data}
                getData={getAllUsers}
                removeSortingForColumnIds={[
                  "serial",
                  "actions",
                  "title",
                  "description",
                  "priority",
                  "due_date",
                  "project",
                ]}
              />
            </div>
          )}

          <Loading loading={isLoading || isFetching} />
        </div>
      </div>
    </>
  );
};

export default Tasks;
