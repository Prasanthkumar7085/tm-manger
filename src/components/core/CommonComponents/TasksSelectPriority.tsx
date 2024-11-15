"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  statusConstants,
  taskPriorityConstants,
  taskStatusConstants,
} from "@/lib/helpers/statusConstants";

interface StatusFilterProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

export const TasksSelectPriority: React.FC<StatusFilterProps> = ({
  value,
  setValue,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between bg-[#F4F4F6] h-[35px] w-[150px] overflow-hidden relative text-[#00000099] font-normal text-sm border border-[#E2E2E2]"
        >
          <div>
            {value ? (
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: taskPriorityConstants.find(
                    (item) => item.value === value
                  )?.color,
                  display: "inline-block",
                  marginRight: "8px",
                }}
              ></span>
            ) : (
              ""
            )}
            {value
              ? taskPriorityConstants.find((item) => item.value === value)
                ?.label
              : "Select Priortity"}
          </div>
          <div>
            <ChevronsUpDown className="absolute right-2 top-1/2 -translate-y-1/2  bg-red-700 text-white rounded-full w-[20px] h-[20px] p-1" />
            {value && (
              <X
                className="mr-4 h-4 w-4 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setValue("");
                }}
              />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-white">
        <Command>
          <CommandInput placeholder="Search Status" />
          <CommandList>
            <CommandEmpty>No Status found.</CommandEmpty>
            <CommandGroup>
              {taskPriorityConstants.map((status) => (
                <CommandItem
                  key={status.value}
                  value={status.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: status.color,
                      display: "inline-block",
                      marginRight: "8px",
                    }}
                  ></span>
                  {status.label}
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      value === status.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
