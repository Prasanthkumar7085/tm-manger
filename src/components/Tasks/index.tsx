import { useQuery } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { Button } from "../ui/button";
import {
  useLocation,
  useNavigate,
  useParams,
  useRouter,
} from "@tanstack/react-router";
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
import DateRangeFilter from "../core/DateRangePicker";
import { changeDateToUTC } from "@/lib/helpers/apiHelpers";

const Tasks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const router = useRouter();

  const searchParams = new URLSearchParams(location.search);
  const pageIndexParam = Number(searchParams.get("page")) || 1;
  const pageSizeParam = Number(searchParams.get("page_size")) || 10;
  const orderBY = searchParams.get("order_by") || "";
  const initialSearch = searchParams.get("search") || "";
  const [searchString, setSearchString] = useState<any>(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(searchString);
  const [selectedDate, setSelectedDate] = useState<any>(new Date());
  const [dateValue, setDateValue] = useState<any>(null);
  console.log(dateValue, "dataiejjrew");

  const [pagination, setPagination] = useState({
    pageIndex: pageIndexParam,
    pageSize: pageSizeParam,
    order_by: orderBY,
  });

  const { isLoading, isError, data, error, isFetching } = useQuery({
    queryKey: ["tasks", pagination, debouncedSearch, selectedDate],
    queryFn: async () => {
      const response = await getAllPaginatedTasks({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        order_by: pagination.order_by,
        search_string: debouncedSearch,
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
      };
      router.navigate({
        to: "/tasks",
        search: queryParams,
      });

      return response;
    },
  });

  const usersData =
    addSerial(
      data?.data?.data?.records,
      data?.data?.pagination?.page,
      data?.data?.pagination?.limit
    ) || [];

  const getAllTasks = async ({ pageIndex, pageSize, order_by }: any) => {
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

  const handleDateChange = (fromDate: any, toDate: any) => {
    if (fromDate) {
      setDateValue(changeDateToUTC(fromDate, toDate));
      setSelectedDate([fromDate, toDate]);
    } else {
      setDateValue([]);
      setSelectedDate([]);
    }
  };

  const isDashboard = location.pathname === "/dashboard";

  return (
    <>
      <div>{!isDashboard && <TotalCounts />}</div>

      <div className="relative mt-3">
        <div className="flex justify-between mb-4 gap-3">
          <h2>Tasks</h2>
          <div className="flex flex-row gap-2">
            <SearchFilter
              searchString={searchString}
              setSearchString={setSearchString}
              title="Search By Name"
            />
            <DateRangeFilter
              dateValue={dateValue}
              onChangeData={handleDateChange}
            />
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
                paginationDetails={data?.data?.data?.pagination_info}
                getData={getAllTasks}
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
