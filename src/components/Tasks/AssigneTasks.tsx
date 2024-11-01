import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import React, { useState } from "react";
import { toast } from "sonner";
import { addAssignesAPI, getAssignesAPI } from "@/lib/services/tasks";
import { getAllMembers } from "@/lib/services/projects/members";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
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
import DeleteAssignes from "./view/DeleteAssigneeTask";

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
    {
      user_id: number;
      user_type: string;
      role: string;
      task_assignee_id: any;
    }[]
  >([]);
  const [updatedOrNot, setUpdatedOrNot] = useState<boolean>(false);

  const getFullName = (user: any) =>
    `${user?.fname || ""} ${user?.mname || ""} ${user?.lname || ""}`.trim();

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const { isFetching, isLoading } = useQuery({
    queryKey: ["getAssignes", taskId],
    queryFn: async () => {
      try {
        const response = await getAssignesAPI(taskId);
        if (response.status === 200 || response?.status === 201) {
          const data = response.data?.data;
          setSelectedMembers(data);
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
      toast.error(response?.message);
      setLoading(false);
      setUpdating((prev: any) => prev + 1);
    },
  });

  const { isLoading: isUsersLoading } = useQuery({
    queryKey: ["users", taskId],
    queryFn: async () => {
      const response = await getAllMembers();
      if (response?.data?.data && Array.isArray(response.data.data)) {
        let ActiveUsers = response.data.data.filter(
          (user: any) => user?.active === true
        );
        setUsers(ActiveUsers);
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
          !selectedMembers.some((m: any) => m.id === member.id) && {
            id: member.id,
            fname: member?.fname || "",
            lname: member?.lname || "",
            email: member?.email || "--",
            phone_number: member?.phone_number || "--",
            user_type: member?.user_type || "--",
          }
        );
      })
      .filter(Boolean);
    setSelectedMembers((prev: any) => [...prev, ...newMembers]);
    setTempSelectedMember([]);
    setOpen(false);
    let allMembers = [...newMembers];
    let payload = allMembers.map((member: any) => {
      return { user_id: member.id };
    });
    setUpdatedOrNot(false);
    mutate({
      user_ids: payload,
    });
  };

  return (
    <div className="flex flex-col justify-between h-full w-full overflow-auto">
      <div>
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
                <th className="border p-2">User Type</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedMembers.map((member) => (
                <tr key={member.user_id}>
                  <td className="border p-2 capitalize">
                    {capitalize(getFullName(member))}
                  </td>
                  <td className="border p-2">{capitalize(member.user_type)}</td>
                  <td className="border p-2">
                    <DeleteAssignes
                      assigneeId={member.task_assignee_id}
                      onSuccess={() => {
                        setUpdating((prev: any) => prev + 1);
                        removeMember(member.user_id);
                      }}
                      taskId={taskId}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* {errorMessages.user_ids[0] && (
          <p className="text-red-500">{errorMessages.user_ids[0]}</p>
        )} */}
      </div>
    </div>
  );
};

export default AssignedUsers;
