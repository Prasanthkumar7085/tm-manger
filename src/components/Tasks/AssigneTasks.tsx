import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "@tanstack/react-router";
import React, { useState } from "react";
import { toast } from "sonner";
import { addAssignesAPI, getAssignesAPI } from "@/lib/services/tasks";
import {
  getAllMembers,
  getProjectMembersAPI,
} from "@/lib/services/projects/members";
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
import LoadingComponent from "../core/LoadingComponent";

const AssignedUsers = ({ viewTaskData }: any) => {
  const { taskId } = useParams({ strict: false });
  const router = useRouter();
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
      download_url: any;
    }[]
  >([]);
  const [updatedOrNot, setUpdatedOrNot] = useState<boolean>(false);
  const page = 1;
  const limit = 10;

  const getFullName = (user: any) =>
    `${user?.fname || ""} ${user?.mname || ""} ${user?.lname || ""}`.trim();
  const getFullNames = (member: any) => `${member.fname} ${member.lname}`;
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const { isFetching, isLoading } = useQuery({
    queryKey: ["getAssignes", taskId, updating],
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

  // const { isLoading: isUsersLoading } = useQuery({
  //   queryKey: ["users", taskId],
  //   queryFn: async () => {
  //     const response = await getAllMembers();
  //     if (response?.data?.data && Array.isArray(response.data.data)) {
  //       let ActiveUsers = response.data.data.filter(
  //         (user: any) => user?.active === true
  //       );
  //       setUsers(ActiveUsers);
  //     } else {
  //       setUsers([]);
  //     }
  //     return response;
  //   },
  // });

  const { isFetching: isMembersFetching, isLoading: isMembersLoading } =
    useQuery({
      queryKey: ["getSingleProjectMembers", viewTaskData?.project_id, taskId],
      queryFn: async () => {
        if (!viewTaskData?.project_id) return;
        try {
          const response = await getProjectMembersAPI(viewTaskData?.project_id);
          if (response.success) {
            const data = response.data?.data;
            setUsers(data?.members || []);
          } else {
            throw response;
          }
        } catch (errData) {
          console.error(errData);
        }
      },
      enabled: Boolean(viewTaskData?.project_id),
    });

  const removeMember = (userId: number) => {
    setSelectedMembers(
      selectedMembers.filter((member) => member.user_id !== userId)
    );
    setUpdating((prev: any) => prev + 1);
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
          (user: any) => user.user_id.toString() === memberValue
        );
        return (
          member &&
          !selectedMembers.some((m: any) => m.id === member.id) && {
            id: member.user_id,
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
    console.log(allMembers, "allMembers");
    let payload = allMembers.map((member: any) => {
      return { user_id: member.id };
    });
    setUpdatedOrNot(false);
    mutate({
      user_ids: payload,
    });
  };
  const getInitials = (member: any) => {
    const firstInitial = member.fname ? member.fname.charAt(0) : "";
    const lastInitial = member.lname ? member.lname.charAt(0) : "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };
  return (
    <div className="flex flex-col justify-between w-full overflow-auto">
      <div>
        <div className="flex items-center">
          <p className="text-[#666666] text-sm font-medium mr-5">Assigned To</p>
          <div className="flex items-center justify-end gap-4">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="py-1 px-3  h-[20px]"
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
                          className="cursor-pointer gap-x-2"
                            key={user.id}
                            value={getFullName(user)}
                            onSelect={() =>
                              toggleValue(user.user_id.toString())
                            }
                            disabled={selectedMembers.some(
                              (m: any) => m.user_id == user.user_id
                            )}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                tempSelectedMember.includes(
                                  user.user_id.toString()
                                )
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />

                            <div className="w-6 h-6 object-contain	 rounded-full border  bg-white">
                              <img
                                src={
                                  user?.created_profile_pic_url ||
                                  "/profile-picture.png"
                                }
                              />
                            </div>
                            <p className="capitalize">{getFullName(user)}</p>
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
            <Button
              onClick={() => {
                router.navigate({
                  to: `/projects/view/${viewTaskData?.project_id}?tab=project_members`,
                });
              }}
              className="bg-primary text-white hover:text-white py-1 px-3  h-[20px]"
            >
              Add members
            </Button>
          </div>
        </div>

        {selectedMembers.length > 0 ? (
          <div className="mt-2 flex items-center space-x-4  pb-[2px] overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
            {selectedMembers.map((member, index) => (
              <>
                <div className="each-person relative flex  border items-center space-x-2 rounded-l-full bg-slate-100 rounded-sm pr-5 pt-[2px] pb-[2px] pl-[2px]">
                  <div className="profile-image">
                    {member.download_url ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200">
                          <img
                            src={member.download_url}
                            alt={`${getFullNames(member)}'s profile`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200">
                        <img
                          src={"/profile-picture.png"}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                  <div className="content">
                    <p className="font-medium text-black pr-3 pl-1 whitespace-nowrap">
                      {capitalize(getFullName(member))}
                    </p>
                    <DeleteAssignes
                      assigneeId={member.task_assignee_id}
                      onSuccess={() => {
                        removeMember(member.user_id);
                      }}
                    />
                  </div>
                </div>
              </>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center mt-3">
            <p>Task Not Assigned to any user</p>
          </div>
        )}

        {/* {errorMessages.user_ids[0] && (
          <p className="text-red-500">{errorMessages.user_ids[0]}</p>
        )} */}
      </div>
      <LoadingComponent loading={loading} />
    </div>
  );
};

export default AssignedUsers;
