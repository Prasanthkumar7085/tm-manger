import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import { toast } from "sonner";
import { membersConstants } from "@/lib/helpers/memberConstants";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addProjectAPI, updateProjectAPI } from "@/lib/services/projects";
import { useLocation, useNavigate, useParams } from "@tanstack/react-router";
import LoadingComponent from "@/components/core/LoadingComponent";
import { getAllPaginatedUsersAPI } from "@/lib/services/users";
import Loading from "@/components/core/Loading";

interface ProjectPayload {
  title: string;
  description: string;
  project_members: { user_id: number; role: string }[];
  code: string;
}

const AddProject = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams({ strict: false });
  const [users, setUsers] = useState<any[]>([]);
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    code: "",
  });
  const [errorMessages, setErrorMessages] = useState<any>({});
  const [selectedMembers, setSelectedMembers] = useState<
    { user_id: number; role: string }[]
  >([]);
  const [open, setOpen] = useState(false);
  const [tempSelectedMember, setTempSelectedMember] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = new URLSearchParams(location.search);
  const pageIndexParam = Number(searchParams.get("current_page")) || 1;
  const pageSizeParam = Number(searchParams.get("page_size")) || 10;
  const [pagination, setPagination] = useState({
    pageIndex: pageIndexParam,
    pageSize: pageSizeParam,
  });

  const { mutate } = useMutation({
    mutationFn: async (payload: ProjectPayload) => {
      setErrorMessages({});
      setLoading(true);
      return projectId
        ? updateProjectAPI(payload, projectId)
        : addProjectAPI(payload);
    },
    onSuccess: (response: any) => {
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        navigate({ to: "/projects" });
      } else if (response?.status === 422) {
        setErrorMessages(response?.data?.errData || {});
      } else if (response?.status === 409) {
        setErrorMessages(response?.data?.errData || {});
      }
      setLoading(false);
    },
    onError: (error: any) => {
      toast.error("An error occurred. Please try again.");
      console.error(error);
      setLoading(false);
    },
  });

  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["users", pagination],
    queryFn: async () => {
      const response = await getAllPaginatedUsersAPI({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      });
      setUsers(response.data?.data?.records);
      return response;
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const toggleValue = (currentValue: string) => {
    setTempSelectedMember((prev) =>
      prev.includes(currentValue)
        ? prev.filter((value) => value !== currentValue)
        : [...prev, currentValue]
    );
  };

  const confirmSelection = () => {
    const newMembers = tempSelectedMember
      .map((memberValue: string) => {
        const member = users.find((user) => user.id.toString() === memberValue);
        return (
          member &&
          !selectedMembers.some((m) => m.user_id === member.id) && {
            user_id: member.id,
            role: "USER",
          }
        );
      })
      .filter(Boolean);

    setSelectedMembers((prev) => [...prev, ...newMembers]);
    setTempSelectedMember([]);
    setOpen(false);
  };

  const removeMember = (userId: number) => {
    setSelectedMembers(
      selectedMembers.filter((member) => member.user_id !== userId)
    );
  };

  const handleSubmit = () => {
    const payload: ProjectPayload = {
      title: projectData.title,
      code: projectData.code,
      description: projectData.description,
      project_members: selectedMembers,
    };

    mutate(payload);
  };

  const addNewMember = (newMember: { value: number; label: string }) => {
    if (
      !selectedMembers.some((member: any) => member.user_id === newMember.value)
    ) {
      setSelectedMembers((prev: any) => [
        ...prev,
        { user_id: newMember.value, role: "USER" },
      ]);
    }
  };

  const getFullName = (user: any) => {
    return `${user.fname} ${user.lname}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-semibold">Add Project</h2>

      <div className="space-y-4">
        <Input
          id="title"
          placeholder="Enter title"
          value={projectData.title}
          name="title"
          onChange={handleInputChange}
        />
        {errorMessages.title && (
          <p style={{ color: "red" }}>{errorMessages?.title?.[0]}</p>
        )}
        <Input
          id="code"
          placeholder="Enter Code"
          value={projectData.code}
          name="code"
          onChange={handleInputChange}
        />
        {errorMessages.code && (
          <p style={{ color: "red" }}>{errorMessages?.code?.[0]}</p>
        )}
        <Textarea
          placeholder="Enter project description"
          id="description"
          value={projectData.description}
          name="description"
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-start gap-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px]">
                Select Members
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 bg-white border">
              <Command>
                <CommandInput placeholder="Search Members" />
                <CommandList>
                  <CommandGroup>
                    {users.map((user: any) => (
                      <CommandItem
                        key={user.id}
                        value={user.id.toString()}
                        onSelect={() => toggleValue(user.id.toString())}
                        disabled={selectedMembers.some(
                          (m: any) => m.user_id === user.id
                        )}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            tempSelectedMember.includes(user.id.toString())
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {getFullName(user)}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandEmpty>No members found.</CommandEmpty>
                </CommandList>

                <div className="flex justify-end space-x-2 p-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTempSelectedMember([])}
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={confirmSelection}
                  >
                    Confirm
                  </Button>
                </div>
              </Command>
            </PopoverContent>
          </Popover>
          {selectedMembers.length > 0 ? (
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">S No</th>
                  <th className="border px-4 py-2">Member Name</th>
                  <th className="border px-4 py-2">Role</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedMembers.map((member, index) => {
                  const memberDetails = users.find(
                    (m) => m.id === member.user_id
                  );
                  return (
                    <tr key={member.user_id} className="border-b">
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">
                        {memberDetails ? getFullName(memberDetails) : "N/A"}
                      </td>
                      <td className="border px-4 py-2">{member.role}</td>
                      <td className="border px-4 py-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeMember(member.user_id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p>No members selected.</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => navigate({ to: "/projects" })}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "" : projectId ? "Update Project" : "Add Project"}
        </Button>
      </div>
    </div>
  );
};

export default AddProject;
