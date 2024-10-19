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
interface ProjectPayload {
  title: string;
  description: string;
  select: string;
}

const AddProject = () => {
  const navigate = useNavigate();
  const { projectId } = useParams({ strict: false });
  const [projectData, setProjectData] = useState<any>({});
  console.log(projectData, "project");
  const [errorMessages, setErrorMessages] = useState<any>({});
  const [userTypeOpen, setUserTypeOpen] = useState(false);
  const [userType, setUserType] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  console.log(selectedMember, "member");

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
    const payload: any = {
      title: projectData?.title,
      description: projectData?.description,
      select: selectedMember,
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
          setUserType(data?.user_type);
        } else {
          throw response;
        }
      } catch (errData) {
        console.error(errData);
        // errPopper(errData);
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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {" "}
            {value
              ? membersConstants?.find((member) => member?.value === value)
                  ?.label
              : "Select Member"}
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
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setSelectedMember(currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === member.value ? "opacity-100" : "opacity-0"
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

      {/* <div className="space-y-4">
        <div className="border-t border-gray-200 mt-4">
          <div className="flex items-center space-x-4 py-2">
            <span className="w-10 text-sm font-semibold">S.No</span>
            <span className="w-40 text-sm font-semibold">Name</span>
            <span className="w-[120px] text-sm font-semibold">Role</span>
          </div>
        </div>
      </div> */}

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
