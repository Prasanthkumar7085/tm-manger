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

const Tasks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const router = useRouter();
  const searchParams = new URLSearchParams(location.search);
  const pageIndexParam = Number(searchParams.get("page")) || 1;
  const pageSizeParam = Number(searchParams.get("page_size")) || 10;
  const orderBY = searchParams.get("order_by")
    ? searchParams.get("order_by")
    : "";
  const initialSearch = searchParams.get("search") || "";
  const [searchString, setSearchString] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(searchString);

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

      const queryParams: Record<string, any> = {
        page: pagination.pageIndex,
        limit: pagination.pageSize,
        order_by: pagination.order_by || undefined,
        search: debouncedSearch || undefined,
      };

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

  const userActions = [
    {
      accessorFn: (row: any) => row.actions,
      id: "actions",
      cell: (info: any) => {
        return (
          <div>
            {/* <Button title="View" size={"sm"} variant={"ghost"}>
              <img src={"/table/view.svg"} alt="view" height={16} width={16} />
            </Button> */}
            <Button
              title="Edit"
              onClick={() =>
                navigate({
                  to: `/users/${info.row.original.id}/update`,
                })
              }
              size={"sm"}
              variant={"ghost"}
            >
              <img src={"/table/edit.svg"} alt="view" height={16} width={16} />
            </Button>
            {/* <Button
              title="delete"
              onClick={() => onClickOpen(info.row.original.id)}
              size={"sm"}
              variant={"ghost"}
            >
              <img
                src={"/table/delete.svg"}
                alt="view"
                height={16}
                width={16}
              />
            </Button> */}
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

  return (
    <div className="relative">
      <div className="flex justify-end mb-4 gap-3">
        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleNavigation}
        >
          Add Task
        </Button>
        <SearchFilter
          searchString={searchString}
          setSearchString={setSearchString}
        />
      </div>

      <div className="flex justify-end gap-3"></div>
      <div>
        {isError ? (
          <div>Error: {error.message}</div>
        ) : (
          <div>
            <TanStackTable
              data={usersData}
              columns={[...taskColumns]}
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

        {/* <Loading loading={isLoading || isFetching} /> */}
      </div>
    </div>
  );
};

export default Tasks;
