import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import React, { useState } from "react";
import { toast } from "sonner";
import { addAssignesAPI, getAssignesAPI } from "@/lib/services/tasks";
import { getAllMembers } from "@/lib/services/projects/members";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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
import { roleConstants } from "@/lib/helpers/statusConstants";

const AssignedUsers = () => {
  const { taskId } = useParams({ strict: false });
  const queryClient = useQueryClient();
  const [users, setUsers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [assignData, setAssignData] = useState<any[]>([]);
  const [tempSelectedMember, setTempSelectedMember] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [updating, setUpdating] = useState<any>(0);
  const [selectedMembers, setSelectedMembers] = useState<
    { user_id: number; role: string }[]
  >([]);

  const getFullName = (user: any) =>
    `${user?.fname || ""} ${user?.mname || ""} ${user?.lname || ""}`.trim();

  const { isFetching, isLoading } = useQuery({
    queryKey: ["getAssignes", taskId],
    queryFn: async () => {
      try {
        const response = await getAssignesAPI(taskId);
        if (response.status === 200 || response?.status === 201) {
          const assignes = response?.data?.data;
          const assignesWithLabels = assignes.map((user: any) => ({
            ...user,
            label: getFullName(user),
            value: user.task_assignee_id.toString(),
          }));
          setAssignData(assignesWithLabels);
        } else {
          throw new Error("Failed to fetch assignee details");
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error?.message || "Something went wrong");
      }
    },
    enabled: Boolean(taskId),
  });

  const { mutate } = useMutation({
    mutationFn: async (payload: any) => {
      setErrorMessages({});
      setLoading(true);
      return addAssignesAPI(taskId, payload);
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
      toast.error(response?.message || "Failed to assign users");
      setLoading(false);
      setUpdating((prev: any) => prev + 1);
    },
  });

  const { isLoading: isUsersLoading } = useQuery({
    queryKey: ["users", taskId],
    queryFn: async () => {
      const response = await getAllMembers();
      if (response?.data?.data && Array.isArray(response.data.data)) {
        const activeUsers = response.data.data.filter(
          (user: any) => user?.active === true
        );
        const userOptions = activeUsers.map((user: any) => ({
          ...user,
          label: getFullName(user),
          value: user.user_id.toString(),
        }));
        setUsers(userOptions);
      } else {
        setUsers([]);
      }
      return response;
    },
  });

  const changeRole = (userId: number, role: string) => {
    setSelectedMembers((prev) =>
      prev.map((member) =>
        member.user_id === userId ? { ...member, role } : member
      )
    );
  };

  const removeMember = (userId: number) => {
    setSelectedMembers(
      selectedMembers.filter((member) => member.user_id !== userId)
    );
  };

  const confirmSelection = () => {
    const newMembers = tempSelectedMember
      .map((memberValue: string) => {
        const member = assignData.find(
          (user: any) => user.task_assignee_id.toString() === memberValue
        );
        return (
          member &&
          !selectedMembers.some(
            (m) => m.user_id === member.task_assignee_id
          ) && {
            user_id: member.task_assignee_id,
            role: "USER",
          }
        );
      })
      .filter(Boolean);

    const payload = {
      user_ids: [...selectedMembers, ...newMembers].map((member) => ({
        user_id: member.user_id,
        role: member.role,
      })),
    };

    if (Array.isArray(payload.user_ids) && payload.user_ids.length > 0) {
      mutate(payload);
    } else {
      toast.error("No members selected to assign.");
    }

    setSelectedMembers((prev) => [...prev, ...newMembers]);
    setTempSelectedMember([]);
    setOpen(false);
  };

  return (
    <div className="flex flex-col justify-between h-full w-full overflow-auto">
      <div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              Select Assignees
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search members..." className="h-9" />
              <CommandList>
                <CommandEmpty>No members found.</CommandEmpty>
                <CommandGroup>
                  {assignData.map((item: any) => (
                    <CommandItem
                      key={item.task_assignee_id}
                      value={item.value}
                      onSelect={() => {
                        setTempSelectedMember((prev) =>
                          prev.includes(item.value)
                            ? prev.filter((val) => val !== item.value)
                            : [...prev, item.value]
                        );
                      }}
                    >
                      {item.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          tempSelectedMember.includes(item.value)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
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
                <Button size="sm" variant="outline" onClick={confirmSelection}>
                  Confirm
                </Button>
              </div>
            </Command>
          </PopoverContent>
        </Popover>
        {selectedMembers.length > 0 && (
          <table className="min-w-full border mt-4">
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
                      assignData.find(
                        (user: any) => user.task_assignee_id === member.user_id
                      )
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
    </div>
  );
};

export default AssignedUsers;
