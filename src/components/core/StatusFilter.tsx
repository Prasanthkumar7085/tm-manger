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
import { statusConstants } from "@/lib/helpers/statusConstants";
import { StatusFilterProps } from "@/lib/interfaces";

export const StatusFilter: React.FC<StatusFilterProps> = ({
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
          className="justify-between bg-[#F4F4F6] border-[#E2E2E2] text-[#00000099] font-normal  rounded-[8px] h-[35px] w-[220px] relative"
        >
          {value
            ? statusConstants.find((item) => item.value === value)?.label
            : "Select Status"}
          <ChevronsUpDown className="absolute right-1 top-1/2 -translate-y-1/2  bg-red-700 text-white rounded-full w-[20px] h-[20px] p-1" />
          {value && (
            <X
              className="mr-4 h-4 w-4 cursor-pointer"
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
              {statusConstants.map((status) => (
                <CommandItem
                className="cursor-pointer"
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
