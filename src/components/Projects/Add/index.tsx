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
import { useMutation } from "@tanstack/react-query";
import { addProjectAPI, updateProjectAPI } from "@/lib/services/projects";
import { useNavigate, useParams } from "@tanstack/react-router";
import AddMember from "../Members/Add";
import LoadingComponent from "@/components/core/LoadingComponent";

interface ProjectPayload {
  title: string;
  description: string;
  project_members: { user_id: number; role: string }[];
}

const AddProject = () => {
  const navigate = useNavigate();
  const { projectId } = useParams({ strict: false });
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
  });
  const [errorMessages, setErrorMessages] = useState<any>({});
  const [selectedMembers, setSelectedMembers] = useState<
    { user_id: number; role: string }[]
  >([]);
  const [open, setOpen] = useState(false);
  const [tempSelectedMember, setTempSelectedMember] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { mutate } = useMutation({
    mutationFn: async (payload: ProjectPayload) => {
      if (projectId) {
        setErrorMessages({});
        setLoading(true);
        return await updateProjectAPI(payload, projectId);
      } else {
        setErrorMessages({});
        setLoading(true);
        return await addProjectAPI(payload);
      }
    },

    onSuccess: (response: any) => {
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        navigate({ to: "/projects" });
        setLoading(false);
      } else if (response?.status === 422) {
        setErrorMessages(response?.data?.errData || {});
        setLoading(false);
      }
    },
    onError: (error: any) => {
      toast.error("An error occurred. Please try again.");
      console.error(error);
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
    tempSelectedMember.forEach((memberValue: any) => {
      const member = membersConstants.find(
        (member) => member.value === memberValue
      );
      if (
        member &&
        !selectedMembers.some((m: any) => m.user_id === member.value)
      ) {
        setSelectedMembers((prev: any) => [
          ...prev,
          { user_id: member.value, role: "USER" },
        ]);
      }
    });
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
      description: projectData.description,
      project_members: selectedMembers,
    };

    mutate(payload);
  };

  const handleNavigation = () => {
    navigate({ to: "/projects" });
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
                  <CommandEmpty>No Members Found</CommandEmpty>
                  <CommandGroup>
                    {membersConstants.map((member: any) => (
                      <CommandItem
                        key={member?.value}
                        value={member?.value}
                        onSelect={() => toggleValue(member.value)}
                        disabled={selectedMembers.some(
                          (m: any) => m.user_id === member.value
                        )}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            tempSelectedMember.includes(member.value)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {member.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
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
          <div className="flex">
            <AddMember addNewMember={addNewMember} />
          </div>
        </div>
        {errorMessages.title && (
          <p style={{ color: "red" }}>{errorMessages?.project_members?.[0]}</p>
        )}
        {selectedMembers.length > 0 ? (
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">S No</th>
                <th className="border px-4 py-2">Member Name</th>
                <th className="border px-4 py-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {selectedMembers.map((member, index) => {
                const memberDetails = membersConstants.find(
                  (m) => m.value === member.user_id
                );
                return (
                  <tr key={member.user_id}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">
                      {memberDetails?.label || "Unknown"}
                    </td>
                    <td className="border px-4 py-2 flex">
                      <Select
                        value={member.role}
                        onValueChange={(value) =>
                          setSelectedMembers((prev) =>
                            prev.map((m) =>
                              m.user_id === member.user_id
                                ? { ...m, role: value }
                                : m
                            )
                          )
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="USER">User</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => removeMember(member.user_id)}
                        className="text-red-500"
                      >
                        ✖
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center items-center">
            "No Members Selected"
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={handleNavigation}>
          Cancel
        </Button>
        <Button variant="outline" onClick={handleSubmit} disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </Button>
      </div>
      <LoadingComponent loading={loading} />
    </div>
  );
};

export default AddProject;
