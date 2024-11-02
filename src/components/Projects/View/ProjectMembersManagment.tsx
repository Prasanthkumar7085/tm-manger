import { roleConstants } from "@/lib/helpers/statusConstants";
import {
  addMembersAPI,
  deleteMembersAPI,
  getAllMembers,
  getProjectMembersAPI,
  updateMembersAPI,
} from "@/lib/services/projects/members";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import LoadingComponent from "@/components/core/LoadingComponent";
import DeleteDialog from "@/components/core/deleteDialog";

const ProjectMembersManagment = () => {
  const { projectId } = useParams({ strict: false });
  const router = useRouter();
  const [selectedMembers, setSelectedMembers] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [open, setOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]);
  const [tempSelectedMember, setTempSelectedMember] = useState<string[]>([]);
  const [updatedOrNot, setUpdatedOrNot] = useState<boolean>(false);
  const [updating, setUpdating] = useState<any>(0);
  const [removedUser, setRemovedUser] = useState<any>({});
  const [removeUserDialog, serRemoveUserDialog] = useState<boolean>(false);
  const getFullName = (user: any) => {
    return `${user?.fname || ""} ${user?.lname || ""}`;
  };
  const confirmSelection = () => {
    const newMembers = tempSelectedMember
      ?.map((memberValue: string) => {
        const member = users.find(
          (user: any) => user.id.toString() === memberValue
        );
        return (
          member &&
          !selectedMembers.some((m: any) => m.id === member.id) && {
            id: member.id,
            role: member?.user_type.toUpperCase(),
            fname: member?.fname || "",
            lname: member?.lname || "",
            email: member?.email || "--",
            phone_number: member?.phone_number || "--",
          }
        );
      })
      .filter(Boolean);
    setSelectedMembers((prev: any) => [...prev, ...newMembers]);
    setTempSelectedMember([]);
    setOpen(false);
    let allMembers = [...newMembers];
    let payload = allMembers.map((member: any) => {
      return { user_id: member.id, role: member.role };
    });
    setUpdatedOrNot(false);
    mutate({
      project_members: payload,
    });
  };

  const changeRole = (userId: number, role: string) => {
    setSelectedMembers((prev: any) =>
      prev.map((member: any) =>
        member.user_id === userId ? { ...member, role } : member
      )
    );
    console.log(selectedMembers, "selectedMembers");
    let allMembers = [
      ...selectedMembers,
      ...selectedMembers.map((member: any) =>
        member.user_id === userId ? { ...member, role } : member
      ),
    ];
    console.log(allMembers, "allMembers");
    let payload = allMembers.map((member: any) => {
      return { user_id: member.user_id, role: member.role };
    });
    setUpdatedOrNot(true);

    mutate({
      project_members: payload,
    });
  };

  const removeMember = (memberDetails: any) => {
    setRemovedUser({ project_member_id: memberDetails?.id });
    serRemoveUserDialog(true);
  };

  const toggleValue = (currentValue: string) => {
    setTempSelectedMember((prev) =>
      prev.includes(currentValue)
        ? prev.filter((value) => value !== currentValue)
        : [...prev, currentValue]
    );
  };

  const { isLoading: isUsersLoading } = useQuery({
    queryKey: ["users", projectId],
    queryFn: async () => {
      const response = await getAllMembers();
      if (response?.data?.data && Array.isArray(response.data.data)) {
        let ActiveUsers = response.data.data.filter(
          (user: any) => user?.active === true
        );
        let addTitles = response?.data?.data?.map((user: any) => ({
          ...user,
          title: getFullName(user),
        }));
        setUsers(ActiveUsers);
      } else {
        setUsers([]);
      }
      return response;
    },
  });

  const { isFetching, isLoading } = useQuery({
    queryKey: ["getSingleProjectMembers", projectId, updating],
    queryFn: async () => {
      if (!projectId) return;
      try {
        const response = await getProjectMembersAPI(projectId);
        if (response.success) {
          const data = response.data?.data;
          setSelectedMembers(data?.records);
        } else {
          throw response;
        }
      } catch (errData) {
        console.error(errData);
      }
    },
    enabled: Boolean(projectId),
  });

  //add or update members
  const { mutate } = useMutation({
    mutationFn: async (payload: any) => {
      setErrorMessages({});
      setLoading(true);
      return updatedOrNot
        ? await updateMembersAPI(projectId, payload)
        : await addMembersAPI(projectId, payload);
    },
    onSuccess: (response: any) => {
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        setUpdating((prev: any) => prev + 1);
      } else if (response?.status === 422 || response?.status === 409) {
        setErrorMessages(response?.data?.errData || {});
        setUpdating((prev: any) => prev + 1);
      } else {
        toast.error(response?.data?.message);
        setUpdating((prev: any) => prev + 1);
      }
      setLoading(false);
    },
    onError: (response: any) => {
      toast.error(response?.message);
      setLoading(false);
      setUpdating((prev: any) => prev + 1);
    },
  });

  //delete members
  const { mutate: removeMembers } = useMutation({
    mutationFn: async (payload: any) => {
      setErrorMessages({});
      setLoading(true);
      return await deleteMembersAPI(projectId, payload);
    },
    onSuccess: (response: any) => {
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        setSelectedMembers(
          selectedMembers.filter((member: any) => member.id !== projectId)
        );
        setUpdating((prev: any) => prev + 1);
        serRemoveUserDialog(false);
      } else if (response?.status === 422 || response?.status === 409) {
        setErrorMessages(response?.data?.errData || {});
        setUpdating((prev: any) => prev + 1);
      } else {
        toast.error(response?.data?.message);
        setUpdating((prev: any) => prev + 1);
      }
      setLoading(false);
    },
    onError: (response: any) => {
      toast.error(response?.message);
      setLoading(false);
      setUpdating((prev: any) => prev + 1);
    },
  });

  const handleDeleteUser = () => {
    removeMembers(removedUser);
  };
  return (
    <div>
      <div className="flex flex-col justify-start gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowBigLeft
              className="h-10 w-10 cursor-pointer"
              onClick={() => window.history.back()}
            />
            <h1 className="text-xl font-semibold">Project Members</h1>
          </div>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[200px]"
                onClick={() => setTempSelectedMember([])}
              >
                Select Members
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 bg-white border z-[99999]">
              <Command>
                <CommandInput placeholder="Search Members" />
                <CommandList className="max-h-[200px] z-[99999]">
                  <CommandGroup>
                    {Array.isArray(users) &&
                      users.map((user: any) => (
                        <CommandItem
                          key={user.id}
                          value={getFullName(user)}
                          onSelect={() => toggleValue(user.id.toString())}
                          disabled={selectedMembers.some(
                            (m: any) => m.user_id == user.id
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
                          <p className="capitalize">{getFullName(user)}</p>
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
        </div>

        {selectedMembers.length > 0 ? (
          <div className="h-[300px] overflow-y-auto">
            <table className="min-w-full border ">
              <thead className="sticky top-0 bg-red-300">
                <tr>
                  <th className="border p-2">Sl.no</th>
                  <th className="border p-2">Members</th>
                  <th className="border p-2">Role</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {selectedMembers.map((member: any, index: number) => (
                  <tr key={member.id}>
                    <td className="border p-2 capitalize">{index + 1}</td>
                    <td className="border p-2 capitalize">
                      {getFullName(member)}
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
                        className="text-red-500"
                        onClick={() => removeMember(member)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            className={`text-center w-full ${loading || isLoading || isFetching ? "hidden" : "block"}`}
          >
            No members found
          </div>
        )}
      </div>
      <LoadingComponent loading={loading || isLoading || isFetching} />
      <DeleteDialog
        openOrNot={removeUserDialog}
        onCancelClick={() => serRemoveUserDialog(false)}
        label="Are you sure you want to remove this member?"
        onOKClick={handleDeleteUser}
        deleteLoading={loading || isLoading || isFetching}
      />
    </div>
  );
};
export default ProjectMembersManagment;
