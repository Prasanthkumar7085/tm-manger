"use client";

import { Input } from "@/components/ui/input";
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as ShadCNPagination,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";

interface DynamicPaginationProps {
  paginationDetails: any;

  totalItems?: number;
  capturePageNum: (value: number) => void;
  captureRowPerItems: (value: number) => void;
  initialPage?: number;
  limitOptionsFromProps?: { title: string; value: number }[];
}

const Pagination = ({
  capturePageNum,
  captureRowPerItems,
  initialPage = 1,
  limitOptionsFromProps,
  paginationDetails,
}: DynamicPaginationProps) => {
  const [currentPage, setCurrentPage] = useState<any>();
  const [pageValue, setPageValue] = useState<any>();
  const [limitOptions, setLimitOptions] = useState<
    { title: string; value: number }[]
  >([]);
  const totalPages = paginationDetails ? paginationDetails?.total_pages : 1;

  const selectedValue = paginationDetails?.limit;

  useEffect(() => {
    setLimitOptions(
      limitOptionsFromProps?.length
        ? limitOptionsFromProps
        : [
            { title: "10/page", value: 10 },
            { title: "20/page", value: 20 },
            { title: "30/page", value: 30 },
            { title: "50/page", value: 50 },
            { title: "70/page", value: 70 },
            { title: "100/page", value: 100 },
          ]
    );
  }, [limitOptionsFromProps]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setPageValue(page);
      capturePageNum(page);
    }
  };

  const handleRowChange = (newLimit: string) => {
    captureRowPerItems(Number(newLimit));
  };

  const onKeyDownInPageChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const page = Math.max(1, Math.min(Number(pageValue) || 1, totalPages));
      handlePageChange(page);
    }
  };
  useEffect(() => {
    if (paginationDetails?.current_page) {
      setPageValue(paginationDetails?.current_page);
      setCurrentPage(paginationDetails?.current_page);
    }
  }, [paginationDetails]);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(null);
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push(null);
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push(null); // For ellipsis
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(null); // For ellipsis
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <ShadCNPagination className="flex justify-between px-2 py-0">
      <PaginationContent className="px-1 py-0 flex gap-2">
        <p>Total {paginationDetails?.total || "0"}</p>
        <Select
          value={selectedValue?.toString()}
          onValueChange={handleRowChange}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            {limitOptions.map((item, index) => (
              <SelectItem value={item.value?.toString()} key={index}>
                {item.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PaginationContent>

      <div className="flex justify-end items-center">
        <PaginationContent className="px-1 py-0">
          <div className="flex items-center">
            GoTo
            <Input
              type="number"
              value={pageValue}
              onChange={(e) => setPageValue(Number(e.target.value))}
              onKeyDown={onKeyDownInPageChange}
              className="ml-2 w-[50px] text-center "
              placeholder="Page"
            />
          </div>
        </PaginationContent>

        <PaginationContent className="px-1 py-0">
          <PaginationItem>
            <PaginationPrevious
              href={currentPage === 1 ? undefined : "#"}
              onClick={(e) => {
                if (currentPage === 1) {
                  e.preventDefault();
                  return;
                }
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }}
              aria-disabled={currentPage === 1}
              className={`${
                currentPage === 1
                  ? "pointer-events-none cursor-not-allowed opacity-50"
                  : "cursor-pointer opacity-100"
              }`}
            />
          </PaginationItem>

          {getPageNumbers().map((pageNumber, index) =>
            pageNumber === null ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href="#"
                  isActive={pageNumber === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(pageNumber);
                  }}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              href={currentPage === totalPages ? undefined : "#"}
              onClick={(e) => {
                if (currentPage === totalPages) {
                  e.preventDefault();
                  return;
                }
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
              aria-disabled={currentPage === totalPages}
              className={`${
                currentPage === totalPages
                  ? "pointer-events-none cursor-not-allowed opacity-50"
                  : "cursor-pointer opacity-100"
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </div>
    </ShadCNPagination>
  );
};

export default Pagination;
