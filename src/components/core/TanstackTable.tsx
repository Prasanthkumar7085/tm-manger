import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { FC, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLocation } from "@tanstack/react-router";
import Pagination from "./Pagination";

interface pageProps {
  columns: any[];
  data: any[];
  loading?: boolean;

  getData?: any;
  paginationDetails: any;
  removeSortingForColumnIds?: string[];
}

const TanStackTable: FC<pageProps> = ({
  columns,
  data,
  loading = false,
  getData,
  paginationDetails,
  removeSortingForColumnIds,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const table = useReactTable({
    columns,
    data: data?.length ? data : [],
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const capturePageNum = (value: number) => {
    getData({
      ...searchParams,
      pageSize: searchParams.get("page_size")
        ? searchParams.get("page_size")
        : 5,
      pageIndex: value,
    });
  };
  const captureRowPerItems = (value: number) => {
    getData({
      ...searchParams,
      pageSize: value,
      pageIndex: 1,
    });
  };

  const getWidth = (id: string) => {
    const widthObj = columns.find((col) => col.id === id);
    return widthObj ? widthObj?.width || "100px" : "100px";
  };

  const sortAndGetData = (header: any) => {
    if (
      removeSortingForColumnIds &&
      removeSortingForColumnIds.length &&
      removeSortingForColumnIds.includes(header.id)
    ) {
      return;
    }

    let sortBy = header.id;
    let sortDirection = "asc";
    let orderBy = `${sortBy}:asc`;

    if (searchParams.get("order_by")?.startsWith(header.id)) {
      if (searchParams.get("order_by") === `${header.id}:asc`) {
        sortDirection = "desc";
        orderBy = `${header.id}:desc`;
      } else {
        sortBy = "";
        sortDirection = "";
        orderBy = "";
      }
    }

    getData({
      ...searchParams,
      pageIndex: searchParams.get("current_page"),
      pageSize: searchParams.get("page_size"),
      order_by: orderBy,
    });
  };

  return (
    <div className="overflow-x-auto w-full">
      {/* Outer container with rounded corners and shadow */}
      <div className="max-h-[80vh] overflow-y-auto rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-100 rounded-t-lg">
            {table?.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={index}
                    colSpan={header.colSpan}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 bg-[#f3e5f6] uppercase tracking-wider"
                    style={{
                      minWidth: getWidth(header.id),
                      width: getWidth(header.id),
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`${
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : ""
                        } flex items-center gap-2`}
                        onClick={() => sortAndGetData(header)}
                        style={{
                          minWidth: getWidth(header.id),
                          width: getWidth(header.id),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {/* Sorting icon component */}
                        <SortItems
                          header={header}
                          removeSortingForColumnIds={removeSortingForColumnIds}
                        />
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-100">
            {data?.length ? (
              table?.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 text-sm text-gray-800"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : !loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-6 text-center">
                  <img
                    src="/No-Files.jpg"
                    alt="No Data"
                    className="mx-auto h-40 w-60 object-contain"
                  />
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Component */}
      <div className="mt-4">
        <Pagination
          paginationDetails={paginationDetails}
          capturePageNum={capturePageNum}
          captureRowPerItems={captureRowPerItems}
        />
      </div>
    </div>
  );
};

export default TanStackTable;

const SortItems = ({
  header,
  removeSortingForColumnIds,
}: {
  header: any;
  removeSortingForColumnIds?: string[];
}) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);

  const sortBy = searchParams.get("order_by")?.split(":")[0];
  const sortDirection = searchParams.get("order_by")?.split(":")[1];
  if (removeSortingForColumnIds?.includes(header.id)) {
    return null;
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {sortBy === header.id ? (
        sortDirection === "asc" ? (
          <img src="/table/sort-asc.svg" height={20} width={20} alt="Asc" />
        ) : (
          <img src="/table/sort-desc.svg" height={20} width={20} alt="Desc" />
        )
      ) : (
        <img src="/table/sort-norm.svg" height={20} width={20} alt="No Sort" />
      )}
    </div>
  );
};
