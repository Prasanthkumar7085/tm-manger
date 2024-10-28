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
import { statusConstants, taskPriorityConstants, taskStatusConstants } from "@/lib/helpers/statusConstants";

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
          className="w-[200px] justify-between"
        >
          {value
            ? taskPriorityConstants.find((item) => item.value === value)?.label
            : "Select Priortity"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          {value && (
            <X
              className="ml-2 h-4 w-4 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setValue("");
              }}
            />
          )}
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
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === status.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {status.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
