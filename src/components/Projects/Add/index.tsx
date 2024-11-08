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
import {
  projectWiseConstants,
  roleConstants,
} from "@/lib/helpers/statusConstants";
import { ProjectPayload } from "@/lib/interfaces";

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
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        navigate({ to: "/projects" });
      } else if (response?.status === 422) {
        setErrorMessages(response?.data?.errData || {});
      } else if (response?.status === 409) {
        setInvalidErrors(response?.data?.errData);
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
    let payload: ProjectPayload = {
      title: projectData.title,
      code: projectData.code,
      description: projectData.description,
    };
    if (!projectId) {
      payload["project_members"] = selectedMembers;
    }
    mutate(payload);
  };

  const capitalize = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1);

  const getFullName = (user: any) => {
    return `${capitalize(user.fname)} ${capitalize(user.lname)}`;
  };

  return (
    <div className="max-w-full bg-white  p-12 space-y-6 overflow-auto h-[calc(100vh-4rem)] rounded-2xl relative ">
      <div className="w-[50%]">
        <h2 className="text-2xl font-semibold pb-6">
          {projectId ? "Edit Project" : "Add Project"}
        </h2>
        <div>
          <div className="mb-4">
            <label className="block text-[#383838] font-medium text-sm mb-1">
              Title<span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              placeholder="Enter title"
              value={projectData.title}
              name="title"
              onChange={handleInputChange}
              className="h-[48px] bg-[#F5F6FA] border border-[#CDCED2] rounded-[8px] placeholder-[#00000066]"
            />
            {errorMessages.title && (
              <p className="text-red-500">{errorMessages.title[0]}</p>
            )}
            {invalidErrors?.title && (
              <p className="text-red-500">{invalidErrors.title}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-[#383838] font-medium text-sm mb-1">
              Project code<span className="text-red-500">*</span>
            </label>
            <Input
              id="code"
              placeholder="Enter Code"
              value={projectData.code}
              name="code"
              onChange={handleInputChange}
              className="h-[48px] bg-[#F5F6FA] border border-[#CDCED2] rounded-[8px] placeholder-[#00000066]"
            />
            {errorMessages.code && (
              <p className="text-red-500">{errorMessages.code[0]}</p>
            )}
            {invalidErrors?.code && (
              <p className="text-red-500">{invalidErrors.code}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-[#383838] font-medium text-sm mb-1">
              Project Description
            </label>
            <Textarea
              placeholder="Enter project description"
              id="description"
              value={projectData.description}
              name="description"
              onChange={handleInputChange}
              className="h-[48px] bg-[#F5F6FA] border border-[#CDCED2] rounded-[8px] placeholder-[#00000066]"
            />
          </div>
        </div>
        {projectId ? (
          " "
        ) : (
          <div className="mb-6">
            <label className="block text-[#383838] font-medium text-sm mb-1">
              Members<span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col justify-start gap-4">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full text-left justify-start h-[40px] bg-[#F5F6FA] border border-[#CDCED2] rounded-[8px] text-[#00000066]"
                  >
                    Select Members
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0 bg-white border rounded-[8px]">
                  <Command>
                    <CommandInput placeholder="Search Members" />
                    <CommandList>
                      <CommandGroup>
                        {Array.isArray(users) &&
                          users.map((user: any) => (
                            <CommandItem
                              className="hover:bg-[#F5F5F5] active:bg-[#28A74533] cursor-pointer"
                              key={user.id}
                              value={getFullName(user)}
                              onSelect={() => toggleValue(user.id.toString())}
                              disabled={selectedMembers.some(
                                (m: any) => m.user_id === user.id
                              )}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4 ",
                                  tempSelectedMember.includes(
                                    user.id.toString()
                                  )
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div>{/* <img src={user?.} /> */}</div>
                              <span className="cursor-pointer">
                                {getFullName(user)}
                              </span>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                      <CommandEmpty>No members found.</CommandEmpty>
                    </CommandList>
                    <div className="flex justify-end space-x-2 p-2 border-t">
                      <Button
                        className="bg-white border-transparent px-6 text-[#000000] text-sm font-medium"
                        variant="outline"
                        size="sm"
                        onClick={() => setTempSelectedMember([])}
                      >
                        Clear
                      </Button>
                      <Button
                        className="bg-[#000000] text-white px-6 font-medium text-sm rounded-[4px]"
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
                <div className="overflow-hidden rounded-[10px] border border-gray-200 mt-4">
                  <table className="min-w-full ">
                    <thead>
                      <tr>
                        <th className="text-left p-2  !bg-[#F5F5F5] font-normal text-[#00000099]">
                          Members
                        </th>
                        <th className="text-left p-2  !bg-[#F5F5F5] font-normal text-[#00000099]">
                          Role
                        </th>
                        <th className="text-left p-2  !bg-[#F5F5F5] font-normal text-[#00000099]">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedMembers.map((member) => (
                        <tr key={member.user_id} className="text-left">
                          <td className=" !px-3 !py-2 capitalize text-[#000000CC]">
                            {getFullName(
                              users.find(
                                (user: any) => user.id === member.user_id
                              )
                            )}
                          </td>
                          <td className=" !px-3 !py-2 capitalize text-[#000000CC]">
                            <select
                              value={member.role}
                              onChange={(e) =>
                                changeRole(member.user_id, e.target.value)
                              }
                              className="border p-1 rounded"
                            >
                              {projectWiseConstants.map((memberConstant) => (
                                <option
                                  key={memberConstant.value}
                                  value={memberConstant.value}
                                >
                                  {memberConstant.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className=" !px-3 !py-2 capitalize text-[#000000CC]">
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
                </div>
              )}
            </div>
            {errorMessages.project_members && (
              <p className="text-red-500">{errorMessages.project_members[0]}</p>
            )}
          </div>
        )}

        <div className="flex justify-end mb-4 gap-5">
          <Button
            className="bg-white border-transparent text-[#FF6000] text-md font-medium"
            variant="outline"
            onClick={() => navigate({ to: "/projects" })}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#1B2459] text-white font-medium text-md"
            variant="outline"
            onClick={handleSubmit}
            disabled={loading}
          >
            {projectId ? "Update Project" : "Add Project"}
          </Button>
        </div>
        <LoadingComponent loading={loading || isFetching || isLoading} />
      </div>
    </div>
  );
};
export default AddProject;
