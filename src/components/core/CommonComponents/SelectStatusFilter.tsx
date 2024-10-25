import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useState } from "react";

const SelectStatusFilter = ({ userId }: any) => {
  const [selectedStatus, setSelectedStatus] = useState<boolean | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const statuses = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];

  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-[200px] justify-between bg-white-700"
          disabled={loading}
        >
          {selectedStatus !== null
            ? selectedStatus
              ? "Active"
              : "Inactive"
            : "Select Status"}
          <div className="flex">
            {selectedStatus && (
              <X
              className="mr-2 h-4 w-4 shrink-0 opacity-50"
              onClick={(e: any) => {
                e.stopPropagation()
                setSelectedStatus(null);
                }}
              />
            )}
            {isOpen ? (
              <ChevronUp className="h-4 w-4 shrink-0 opacity-50" />
            ) : (
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <div className="max-h-[300px] overflow-y-auto">
          {statuses.map((status) => (
            <div
              key={status.label}
              onClick={() => (status.value)}
              className="cursor-pointer p-2 hover:bg-gray-100"
            >
              {status.label}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default SelectStatusFilter;
