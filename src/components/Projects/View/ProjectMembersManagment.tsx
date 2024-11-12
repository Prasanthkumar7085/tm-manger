import memberIcon from "@/assets/members.svg";
import selectDropIcon from "@/assets/select-dropdown.svg";
import LoadingComponent from "@/components/core/LoadingComponent";
import DeleteDialog from "@/components/core/deleteDialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  isMananger,
  isProjectAdmin,
  isProjectMemberOrNot,
} from "@/lib/helpers/loginHelpers";
import { roleConstants } from "@/lib/helpers/statusConstants";
import {
  addMembersAPI,
  deleteMembersAPI,
  getAllMembers,
  getProjectMembersAPI,
  updateMembersAPI,
} from "@/lib/services/projects/members";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useParams, useRouter } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const ProjectMembersManagment = ({ projectDetails }: any) => {
  const { projectId } = useParams({ strict: false });
  const router = useRouter();
  const { pathname } = useLocation();
  const profileData: any = useSelector(
    (state: any) => state.auth.user.user_details
  );
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
    let allMembers = [
      ...selectedMembers,
      ...selectedMembers.map((member: any) =>
        member.user_id === userId ? { ...member, role } : member
      ),
    ];
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
    queryKey: ["users", projectId, pathname],
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
    queryKey: ["getSingleProjectMembers", projectId, updating, pathname],
    queryFn: async () => {
      if (!projectId) return;
      try {
        const response = await getProjectMembersAPI(projectId);
        if (response.success) {
          const data = response.data?.data;
          setSelectedMembers(data?.members || []);
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

  const isAbleToAddOrEdit = () => {
    if (
      (isMananger(selectedMembers, profileData?.id, profileData?.user_type) ||
        isProjectAdmin(
          selectedMembers,
          profileData?.id,
          profileData?.user_type
        )) &&
      isProjectMemberOrNot(selectedMembers, profileData?.id) &&
      projectDetails?.active
    ) {
      return true;
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-col justify-start gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Project Members</h1>
          </div>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                disabled={
                  profileData?.user_type === "admin" || isAbleToAddOrEdit()
                    ? false
                    : true
                }
                variant="outline"
                className="w-[220px] flex items-center justify-between px-2 bg-[#F4F4F6] border-[#E2E2E2] rounded-[8px] text-[#00000099]"
                onClick={() => setTempSelectedMember([])}
              >
                <div className="flex items-center gap-x-1">
                  <img
                    src={memberIcon}
                    alt="No tags"
                    className="w-5 h-5 mr-1"
                  />
                  <p>Select Members</p>
                </div>
                <div>
                  <span>
                    {" "}
                    <img
                      src={selectDropIcon}
                      alt="No tags"
                      className="w-5 h-5 mr-1"
                    />{" "}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0 bg-white border rounded-sm z-[99999]">
              <Command>
                <CommandInput placeholder="Search Members" />
                <CommandList className="max-h-[220px] z-[99999]">
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
                          <div className="w-6 h-6 object-contain	mr-2 rounded-full border  bg-white">
                            <img
                              src={user?.profile_pic || "/profile-picture.png"}
                            />
                          </div>
                          <p className="capitalize cursor-pointer">
                            {getFullName(user)}
                          </p>
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
                    title={
                      projectDetails?.active ? "" : "Project is not active"
                    }
                    disabled={
                      projectDetails?.active && tempSelectedMember.length > 0
                        ? false
                        : true
                    }
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
            <div className="rounded-[10px] border border-gray-200">
              <table className="min-w-full ">
                <thead
                  className={`sticky top-0 ${removeUserDialog ? "" : "z-[9]"}`}
                >
                  <tr>
                    <th className=" p-2 bg-[#F5F5F5] text-left font-normal text-[#00000099]">
                      Sl.no
                    </th>
                    <th className=" p-2 !bg-[#F5F5F5] text-left font-normal text-[#00000099]">
                      Members
                    </th>
                    <th className=" p-2 !bg-[#F5F5F5] text-left font-normal text-[#00000099]">
                      Role
                    </th>
                    <th className=" p-2 !bg-[#F5F5F5] text-left font-normal text-[#00000099]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="text-left ">
                  {selectedMembers.map((member: any, index: number) => (
                    <tr key={member.id}>
                      <td className=" p-2 capitalize">{index + 1}</td>
                      <td className=" p-2 capitalize flex justify-left items-center gap-3">
                        <img
                          className="w-8 h-8 rounded-full"
                          onError={(e: any) => {
                            e.target.onerror = null;
                            e.target.src = "/profile-picture.png";
                          }}
                          src={
                            member.user_profile_pic_url ||
                            "/profile-picture.png"
                          }
                          alt="Avatar"
                        />
                        {getFullName(member)}
                      </td>
                      <td className=" p-2">
                        <select
                          value={member.role}
                          disabled={
                            profileData?.user_type === "admin" ||
                            isAbleToAddOrEdit()
                              ? false
                              : true
                          }
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
                      <td className="p-2">
                        <button
                          type="button"
                          disabled={
                            profileData?.user_type === "admin" ||
                            isAbleToAddOrEdit()
                              ? false
                              : true
                          }
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
          </div>
        ) : (
          <div
            className={`min-h-[300px] text-center w-full ${loading || isLoading || isFetching ? "hidden" : "block"}`}
          >
            No members found
          </div>
        )}
      </div>
      <LoadingComponent loading={loading} />
      <DeleteDialog
        openOrNot={removeUserDialog}
        onCancelClick={() => serRemoveUserDialog(false)}
        label="Are you sure you want to remove this member?"
        onOKClick={handleDeleteUser}
        deleteLoading={loading || isLoading || isFetching}
      />
      <LoadingComponent loading={loading || isLoading || isFetching} />
    </div>
  );
};
export default ProjectMembersManagment;
