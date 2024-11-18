import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Adjust the import based on your setup
import { Button } from "@/components/ui/button"; // Adjust the import based on your setup
import { Input } from "@/components/ui/input"; // Adjust the import based on your setup
import { X, ChevronUp, ChevronDown,ChevronsUpDown  } from "lucide-react"; // Adjust the icons as needed

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
        {/* <Button
          variant="outline"
          role="combobox"
          aria-expanded={sortPopoverOpen}
          className="w-[200px] justify-between text-[#00000099] font-normal bg-[#ffffff] h-[35px] border-[#E2E2E2] rounded-[8px]"
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
        </Button> */}
        <Button
  variant="outline"
  role="combobox"
  aria-expanded={sortPopoverOpen}
  className="w-[200px] justify-between relative text-[#00000099] font-normal bg-[#ffffff] h-[35px] border-[#E2E2E2] rounded-[8px]"
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
    <ChevronsUpDown className="absolute right-[2%] top-[50%] -translate-y-1/2 bg-red-700 text-white rounded-full w-[20px] h-[20px] p-1" />
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
              className="w-full grid grid-cols-[10px,auto] items-center justify-start gap-x-2 font-normal border-none bg-white text-[#343434] capitalize  hover:bg-[#f7f8fa] hover:text-[#343434]"
            >
              <p>
              {isSortSelected && selectedSort === option.value && (
                <span>✓</span> // Checkmark for selected option
              )}
              </p>
            
              <p className="!mt-0">{option.label}</p>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SortPopover;
