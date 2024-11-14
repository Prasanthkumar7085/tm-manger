import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getColorFromInitials } from "@/lib/constants/colorConstants";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface User {
  id: number;
  profile_pic?: string;
  first_name: string;
  last_name: string;
}
interface UserSelectionPopoverProps {
  usersData: User[];
  getFullName: (user: User) => string;
  memberIcon: string;
  selectDropIcon: string;
  selectedMembers: User[];
  setSelectedMembers: React.Dispatch<React.SetStateAction<User[]>>;
  onSelectMembers: (selectedMembers: any) => void;
}

const UserSelectionPopover: React.FC<UserSelectionPopoverProps> = ({
  usersData,
  getFullName,
  memberIcon,
  selectDropIcon,
  onSelectMembers,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [tempSelectedMember, setTempSelectedMember] = useState<string[]>([]);

  const toggleValue = (userId: string): void => {
    setTempSelectedMember((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const confirmSelection = (): void => {
    const selectedUsers = usersData.filter((user) =>
      tempSelectedMember.includes(user.id.toString())
    );
    setSelectedMembers(selectedUsers);
    setOpen(false);
    onSelectMembers(selectedUsers);
  };

  const displayUsers = selectedMembers.slice(0, 2);

  return (
    <TooltipProvider>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[220px] h-[35px] flex items-center justify-between px-2 bg-[#F4F4F6] border-[#E2E2E2] rounded-[8px] text-[#00000099]"
          >
            <div className="flex items-center gap-x-1">
              <img
                src={memberIcon}
                alt="Select Members"
                className="w-5 h-5 mr-1"
              />
            </div>
            <div className="flex items-center gap-1">
              {selectedMembers.length === 0 ? (
                <p>Select Assignees</p>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="flex justify-start -space-x-1 mt-1">
                    {selectedMembers?.slice(0, 5).map((user: any) => {
                      const initials = user.fname[0] + user.lname[0];
                      const backgroundColor = getColorFromInitials(initials);

                      return (
                        <Avatar
                          key={user.id}
                          title={getFullName(user)}
                          className={`w-6 h-6 ${backgroundColor}`}
                        >
                          <AvatarImage
                            src={user.profile_pic}
                            alt={getFullName(user)}
                            title={getFullName(user)}
                          />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                      );
                    })}
                    {selectedMembers?.length > 5 && (
                      <div className="flex items-center justify-center w-6 h-6 border-2 border-white rounded-full bg-gray-200 text-xs font-semibold">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center bg-[#F4F4F6] px-2 py-1 rounded-full text-sm text-[#00000099]">
                              +{selectedMembers.length - 5}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-white">
                            <div>
                              {selectedMembers.map((user) => (
                                <p key={user.id}>{getFullName(user)}</p>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                  </div>

                  <X
                    className="cursor-pointer text-red-700 w-4 h-4"
                    onClick={() => {
                      setSelectedMembers([]);
                      setTempSelectedMember([]);
                      onSelectMembers([]);
                    }}
                  />
                </div>
              )}
            </div>
            <span>
              <img
                src={selectDropIcon}
                alt="Dropdown Icon"
                className="w-5 h-5 mr-1"
              />
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0 bg-white border rounded-sm z-[99999]">
          <Command>
            <CommandInput placeholder="Search Assignees" />
            <CommandList className="max-h-[220px] z-[99999]">
              <CommandGroup>
                {Array.isArray(usersData) &&
                  usersData.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={getFullName(user)}
                      onSelect={() => toggleValue(user.id.toString())}
                      // disabled={selectedMembers.some((m) => m.id === user.id)}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          tempSelectedMember.includes(user.id.toString())
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                      <div className="w-6 h-6 object-contain mr-2 rounded-full border bg-white">
                        <img
                          src={user.profile_pic || "/profile-picture.png"}
                          alt="User Avatar"
                        />
                      </div>
                      <p className="capitalize cursor-pointer">
                        {getFullName(user)}
                      </p>
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandEmpty>No Assignees found.</CommandEmpty>
            </CommandList>
            <div className="flex justify-end space-x-2 p-2 border-t">
              <Button
                className="bg-white border-transparent px-6 text-[#000000] text-sm font-medium"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedMembers([]);
                  setTempSelectedMember([]);
                }}
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
    </TooltipProvider>
  );
};

export default UserSelectionPopover;
