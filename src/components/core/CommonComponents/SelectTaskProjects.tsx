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
  selectedProject: any;
  setSelectedProject: React.Dispatch<React.SetStateAction<string>>;
}

export const SelectTaskProjects: React.FC<StatusFilterProps> = ({
  selectedProject,
  setSelectedProject,
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedProjectLogo, setSelectedProjectLogo] =
    React.useState<any>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await getDropDownForProjectsTasksAPI();
      return response.data?.data;
    },
  });

  const handleSelect = (value: any) => {
    setSelectedProject(value === selectedProject ? "" : value?.id);
    setOpen(false);
    setSelectedProjectLogo(value?.logo_url || "/favicon.png");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between bg-[#F4F4F6] h-[35px] w-[220px] relative text-[#00000099] font-normal text-sm border border-[#E2E2E2]"
        >
          {selectedProjectLogo && selectedProject && (
            <img
              src={selectedProjectLogo || "/favicon.png"}
              alt={` logo`}
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/150?text=No preview";
              }}
              className="mr-2 h-6 w-6 rounded-full object-cover"
            />
          )}
          {selectedProject
            ? data?.find((item: any) => item.id == selectedProject)?.title
            : "Select Project"}
          <ChevronsUpDown className="absolute right-2 top-1/2 -translate-y-1/2  bg-red-700 text-white rounded-full w-[20px] h-[20px] p-1" />
          {selectedProject && (
            <X
              className="mr-4 h-4 w-4 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProject("");
                setSelectedProjectLogo("");
              }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0 bg-white">
        <Command>
          <CommandInput placeholder="Select Projects" />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : isError || !data ? (
              <CommandEmpty>No projects found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {data?.length > 0
                  ? data?.map((project: any) => (
                      <CommandItem
                        key={project.id}
                        onSelect={() => handleSelect(project)}
                      >
                        {(project.logo_url || "/favicon.png") && (
                          <img
                            src={project.logo_url || "/favicon.png"}
                            alt={`${project.title} logo`}
                            className="mr-2 h-6 w-6 rounded-full object-cover"
                            onError={(e: any) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/150?text=No preview";
                            }}
                          />
                        )}
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedProject === project.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {project.title}
                      </CommandItem>
                    ))
                  : ""}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
