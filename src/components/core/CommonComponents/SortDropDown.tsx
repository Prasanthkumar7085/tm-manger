import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";

const sortOptions = [
  { label: "Title Asc", value: "title asc" },
  { label: "Title Desc", value: "title desc" },
  { label: "Created At Asc", value: "created_at asc" },
  { label: "Created At Desc", value: "created_at desc" },
];

const SortDropDown = ({ selectedSort, setSelectedSort }: any) => {
  const handleSortChange = (value: string) => {
    setSelectedSort(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-4 py-2 bg-gray-200 text-black rounded-lg">
        Sort By
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => handleSortChange(option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortDropDown;
