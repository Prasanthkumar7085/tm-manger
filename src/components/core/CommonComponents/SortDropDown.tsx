import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Adjust the import based on your setup
import { Button } from "@/components/ui/button"; // Adjust the import based on your setup
import { Input } from "@/components/ui/input"; // Adjust the import based on your setup
import { X, ChevronUp, ChevronDown } from "lucide-react"; // Adjust the icons as needed

const sortOptions = [
  { label: "Title Asc", value: "title:asc" },
  { label: "Title Desc", value: "title:desc" },
  { label: "Created At Asc", value: "created_at:asc" },
  { label: "Created At Desc", value: "created_at:desc" },
];

const SortPopover = ({ selectedSort, setSelectedSort }: any) => {
  const [isSortSelected, setIsSortSelected] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortPopoverOpen, setSortPopoverOpen] = useState(false);

  useEffect(() => {
    setIsSortSelected(!!selectedSort);
  }, [selectedSort]);

  const handleSortChange = (value: any) => {
    setSelectedSort(value);
    setSortPopoverOpen(false);
  };

  const handleRemoveSort = (e: any) => {
    e.stopPropagation();
    setSelectedSort(null);
    setSortPopoverOpen(false);
  };

  const filteredOptions = sortOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover open={sortPopoverOpen} onOpenChange={setSortPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={sortPopoverOpen}
          className="w-[200px] justify-between text-[#00000099] font-normal bg-[#F4F4F6] h-[35px] border-[#E2E2E2] rounded-[8px]"
        > 
          {isSortSelected
            ? sortOptions.find((option) => option.value === selectedSort)?.label
            : "Select Sort"}
          <div className="flex">
            {isSortSelected && (
              <X
                className="mr-2 h-4 w-4 shrink-0 opacity-50"
                onClick={handleRemoveSort}
              />
            )}
            {sortPopoverOpen ? (
              <ChevronUp className="h-4 w-4 shrink-0 opacity-50" />
            ) : (
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
       
        <div className="max-h-[300px] overflow-y-auto">
        <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
           className="border-none rounded-[8px] focus:outline-none ring-0 focus:ring-0"
          />
          {filteredOptions.map((option) => (
            <Button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className="w-full justify-start font-normal border-none bg-white text-[#343434] capitalize  hover:bg-[#f7f8fa] hover:text-[#343434]"
            >
              {isSortSelected && selectedSort === option.value && (
                <span className="mr-2">✓</span> // Checkmark for selected option
              )}
              {option.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SortPopover;
