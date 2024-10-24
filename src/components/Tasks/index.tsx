import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { addSerial } from "@/lib/helpers/addSerial";
import { changeDateToUTC } from "@/lib/helpers/apiHelpers";
import { getAllPaginatedTasks } from "@/lib/services/tasks";
import { useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import SearchFilter from "../core/CommonComponents/SearchFilter";
import DateRangeFilter from "../core/DateRangePicker";
import Loading from "../core/Loading";
import TanStackTable from "../core/TanstackTable";
import { Button } from "../ui/button";
import TotalCounts from "./Counts";
import { taskColumns } from "./TaskColumns";

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

  const taksDataAfterSerial =
    addSerial(
      data?.data?.data?.records,
      data?.data?.data?.pagination_info?.current_page,
      data?.data?.data?.pagination_info?.page_size
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
                data={taksDataAfterSerial}
                columns={taskColumns()}
                paginationDetails={data?.data?.data?.pagination_info}
                getData={getAllTasks}
                removeSortingForColumnIds={["serial", "actions"]}
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
