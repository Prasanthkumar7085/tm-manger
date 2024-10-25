import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Check, X } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addProjectAPI,
  updateProjectAPI,
  viewProjectAPI,
} from "@/lib/services/projects";
import { useNavigate, useParams } from "@tanstack/react-router";
import LoadingComponent from "@/components/core/LoadingComponent";
import { getAllMembers } from "@/lib/services/projects/members";
import { errPopper } from "@/lib/helpers/errPopper";
import { roleConstants } from "@/lib/helpers/statusConstants";

interface ProjectPayload {
  title: string;
  description: string;
  project_members: { user_id: number; role: string }[];
  code: string;
}
const AddProject = () => {
  const navigate = useNavigate();
  const { projectId } = useParams({ strict: false });
  const [users, setUsers] = useState<any[]>([]);
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    code: "",
  });
  const [errorMessages, setErrorMessages] = useState<any>({});
  const [invalidErrors, setInvalidErrors] = useState<any>();
  console.log(invalidErrors, "invalid");
  const [selectedMembers, setSelectedMembers] = useState<
    { user_id: number; role: string }[]
  >([]);
  const [open, setOpen] = useState(false);
  const [tempSelectedMember, setTempSelectedMember] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { isLoading: isUsersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await getAllMembers();
      if (response?.data?.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else {
        setUsers([]);
      }
      return response;
    },
  });

  const { isFetching, isLoading } = useQuery({
    queryKey: ["getSingleProject", projectId],
    queryFn: async () => {
      if (!projectId) return;
      try {
        const response = await viewProjectAPI(projectId);
        if (response.success) {
          const data = response.data?.data;
          setProjectData({
            title: data.title,
            description: data.description,
            code: data.code,
          });
          setSelectedMembers(data.project_members || []);
        } else {
          throw response;
        }
      } catch (errData) {
        console.error(errData);
        errPopper(errData);
      }
    },
    enabled: Boolean(projectId),
  });
  const { mutate } = useMutation({
    mutationFn: async (payload: ProjectPayload) => {
      setErrorMessages({});
      setLoading(true);
      return projectId
        ? updateProjectAPI(projectId, payload)
        : addProjectAPI(payload);
    },
    onSuccess: (response: any) => {
      console.log(response, "ikik");
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        navigate({ to: "/projects" });
      } else if (response?.status === 422) {
        setErrorMessages(response?.data?.errData || {});
      } else if (response?.status === 409) {
        setInvalidErrors(response?.data?.message);
      }
      setLoading(false);
    },
    onError: (response: any) => {
      toast.error(response?.message);
      setLoading(false);
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
      ?.map((memberValue: string) => {
        const member = users.find(
          (user: any) => user.id.toString() === memberValue
        );
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

  const changeRole = (userId: number, role: string) => {
    setSelectedMembers((prev) =>
      prev.map((member) =>
        member.user_id === userId ? { ...member, role } : member
      )
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

  const capitalize = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1);

  const getFullName = (user: any) => {
    return `${capitalize(user.fname)} ${capitalize(user.lname)}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-semibold">
        {projectId ? "Edit Project" : "Add Project"}
      </h2>
      <div className="space-y-4">
        <Input
          id="title"
          placeholder="Enter title"
          value={projectData.title}
          name="title"
          onChange={handleInputChange}
        />
        {errorMessages.title && (
          <p className="text-red-500">{errorMessages.title[0]}</p>
        )}
        {invalidErrors && <p className="text-red-500">{invalidErrors}</p>}

        <Input
          id="code"
          placeholder="Enter Code"
          value={projectData.code}
          name="code"
          onChange={handleInputChange}
        />
        {errorMessages.code && (
          <p className="text-red-500">{errorMessages.code[0]}</p>
        )}
        {invalidErrors && <p className="text-red-500">{invalidErrors}</p>}
        <Textarea
          placeholder="Enter project description"
          id="description"
          value={projectData.description}
          name="description"
          onChange={handleInputChange}
        />
      </div>
      {projectId ? (
        " "
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col justify-start gap-4">
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
                      {Array.isArray(users) &&
                        users.map((user: any) => (
                          <CommandItem
                            key={user.id}
                            value={getFullName(user)}
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
            {selectedMembers.length > 0 && (
              <table className="min-w-full border">
                <thead>
                  <tr>
                    <th className="border p-2">Members</th>
                    <th className="border p-2">Role</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedMembers.map((member) => (
                    <tr key={member.user_id}>
                      <td className="border p-2">
                        {getFullName(
                          users.find((user: any) => user.id === member.user_id)
                        )}
                      </td>
                      <td className="border p-2">
                        <select
                          value={member.role}
                          onChange={(e) =>
                            changeRole(member.user_id, e.target.value)
                          }
                          className="border p-1 rounded"
                        >
                          {roleConstants.map((memberConstant) => (
                            <option
                              key={memberConstant.value}
                              value={memberConstant.value}
                            >
                              {memberConstant.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border p-2">
                        <button
                          type="button"
                          onClick={() => removeMember(member.user_id)}
                        >
                          <span title="remove">
                            <X className="w-4 h-4 text-red-500" />
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {errorMessages.project_members && (
            <p className="text-red-500">{errorMessages.project_members[0]}</p>
          )}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => navigate({ to: "/projects" })}>
          Cancel
        </Button>
        <Button variant="outline" onClick={handleSubmit} disabled={loading}>
          {projectId ? "Update Project" : "Add Project"}
        </Button>
      </div>
      <LoadingComponent loading={loading || isFetching || isLoading} />
    </div>
  );
};
export default AddProject;
