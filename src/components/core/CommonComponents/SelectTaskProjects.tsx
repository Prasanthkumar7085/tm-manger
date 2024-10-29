import * as React from "react";
import { useQuery } from "@tanstack/react-query";
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
import { getDropDownForProjectsTasksAPI } from "@/lib/services/tasks";

interface StatusFilterProps {
  selectedProjects: string;
  setSelectedProjects: React.Dispatch<React.SetStateAction<string>>;
}

export const SelectTaskProjects: React.FC<StatusFilterProps> = ({
  selectedProjects,
  setSelectedProjects,
}) => {
  const [open, setOpen] = React.useState(false);
  const [projectsId, setProjectsId] = React.useState();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await getDropDownForProjectsTasksAPI();
      return response.data?.data;
    },
  });

  const handleSelect = (value: string) => {
    setSelectedProjects(value === selectedProjects ? "" : value);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[230px] justify-between"
        >
          {selectedProjects
            ? data?.find((item: any) => item.title === selectedProjects)?.title
            : "Select Projects"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          {selectedProjects && (
            <X
              className="ml-2 h-4 w-4 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProjects("");
              }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-white">
        <Command>
          <CommandInput placeholder="Select Projects" />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : isError || !data ? (
              <CommandEmpty>No projects found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {data?.map((project: any) => (
                  <CommandItem
                    key={project.id}
                    onSelect={() => handleSelect(project.title)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedProjects === project.title
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {project.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
