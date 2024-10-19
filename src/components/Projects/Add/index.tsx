import { SheetDemo } from "@/components/core/CommonComponents/Sheet";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { membersConstants } from "@/lib/helpers/memberConstants";
import {
  addProjectAPI,
  updateProjectAPI,
  viewProjectAPI,
} from "@/lib/services/projects";
import { cn } from "@/lib/utils";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AddMember from "../Members/Add";

interface ProjectPayload {
  title: string;
  description: string;
  select: string[];
}

const AddProject = () => {
  const navigate = useNavigate();
  const { projectId } = useParams({ strict: false });
  const [projectData, setProjectData] = useState<any>({});
  const [errorMessages, setErrorMessages] = useState<any>({});
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [selectedMember, setSelectedMember] = useState<string[]>([]); // Initialize as array of strings

  const { mutate, isPending, isError, error, data, isSuccess } = useMutation({
    mutationFn: async (payload: ProjectPayload) => {
      if (projectId) {
        return await updateProjectAPI(payload, projectId);
      } else {
        return await addProjectAPI(payload);
      }
    },
    onSuccess: (response: any) => {
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        navigate({
          to: "/projects",
        });
      }
      if (response?.status === 422) {
        setErrorMessages(response?.data?.errData || [""]);
        toast.error(response?.data?.message);
      }
    },
  });

  const addProject = () => {
    const payload: ProjectPayload = {
      title: projectData?.title,
      description: projectData?.description,
      select: selectedMember, // Use selected members for API payload
    };

    mutate(payload);
  };

  const { isFetching } = useQuery({
    queryKey: ["getProject", projectId],
    queryFn: async () => {
      if (!projectId) return;
      try {
        const response = await viewProjectAPI(projectId);

        if (response.success) {
          const data = response?.data?.data;
          setProjectData({
            title: data?.title,
            description: data?.description,
            prirority: data?.prirority,
            due_date: data?.due_date,
          });
        } else {
          throw response;
        }
      } catch (errData) {
        console.error(errData);
      }
    },
    enabled: Boolean(projectId),
  });

  const handleInputChange = (e: any) => {
    let { name, value } = e.target;
    const updatedValue = value
      .replace(/[^a-zA-Z\s]/g, "")
      .replace(/^\s+/g, "")
      .replace(/\s{2,}/g, " ");
    setProjectData({
      ...projectData,
      [name]: updatedValue,
    });
  };

  const toggleValue = (currentValue: string) => {
    setSelectedMember((prev) =>
      prev.includes(currentValue)
        ? prev.filter((value) => value !== currentValue)
        : [...prev, currentValue]
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center space-x-4">
        <div>
          <h2 className="text-2xl font-semibold">Add Project</h2>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          id="title"
          placeholder="Enter title"
          value={projectData?.title}
          name="title"
          onChange={handleInputChange}
        />
        <Textarea
          placeholder="Enter project Description"
          id="description"
          value={projectData?.description}
          name="description"
          onChange={handleInputChange}
        />
      </div>

      <div className="flex space-x-4 items-center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {selectedMember.length > 0
                ? selectedMember
                    .map(
                      (value) =>
                        membersConstants.find(
                          (member) => member.value === value
                        )?.label
                    )
                    .join(", ")
                : "Select Members"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Select Member" />
              <CommandList>
                <CommandEmpty>No Members Found</CommandEmpty>
                <CommandGroup>
                  {membersConstants.map((member) => (
                    <CommandItem
                      key={member?.value}
                      value={member?.value}
                      onSelect={() => {
                        toggleValue(member.value);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedMember.includes(member.value)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {member.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <AddMember />
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          className="px-6 py-2 bg-red-500 text-white rounded-md mr-2"
          onClick={() => navigate({ to: "/projects" })}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md"
          onClick={addProject}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default AddProject;
