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
  const [projectList, setProjectList] = React.useState<any>([]);
  const [selectedProjectLogo, setSelectedProjectLogo] =
    React.useState<any>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await getDropDownForProjectsTasksAPI();
      setProjectList(response.data?.data || []);
      return response.data?.data;
    },
  });

  const handleSelect = (value: any) => {
    setSelectedProject(value === selectedProject ? "" : value?.id);
    setOpen(false);
    setSelectedProjectLogo(value?.logo || "/favicon.png");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex justify-start bg-[#F4F4F6] h-[35px] w-[220px] relative text-[#00000099] font-normal text-sm pl-2 border border-[#E2E2E2]"
        >
          {selectedProject && (
            <img
              src={
                projectList?.find((item: any) => item.id == selectedProject)
                  ? `${import.meta.env.VITE_IMAGE_URL}/${
                      projectList.find(
                        (item: any) => item.id == selectedProject
                      )?.logo
                    }`
                  : "/favicon.png"
              }
              alt={`logo`}
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = "/favicon.png";
              }}
              className="mr-2 h-6 w-6 rounded-full object-cover"
            />
          )}
          <div className="inputContent flex items-center">
            <div className="content truncate w-[125px]">
              {selectedProject
                ? projectList?.find((item: any) => item.id == selectedProject)
                    ?.title
                : "Select Project"}
            </div>
            <ChevronsUpDown className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-700 text-white rounded-full w-[20px] h-[20px] p-1" />
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
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-white">
        <Command>
          <CommandInput placeholder="Select Projects" />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : isError || !projectList ? (
              <CommandEmpty>No projects found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {projectList?.length > 0
                  ? projectList?.map((project: any) =>
                      project.id ? (
                        <CommandItem
                          key={project.id}
                          onSelect={() => handleSelect(project)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedProject == project.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {(project.logo_url || "/favicon.png") && (
                            <img
                              src={`${import.meta.env.VITE_IMAGE_URL}/${project.logo}`}
                              alt={`${project.title} logo`}
                              className="mr-2 h-6 w-6 rounded-full object-cover"
                              onError={(e: any) => {
                                e.target.onerror = null;
                                e.target.src = "/favicon.png";
                              }}
                            />
                          )}
                          {project.title}
                        </CommandItem>
                      ) : null
                    )
                  : ""}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
