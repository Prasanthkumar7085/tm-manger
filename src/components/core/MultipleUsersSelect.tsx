import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Check } from "lucide-react";
import { Tooltip } from "../ui/tooltip";

// Define types for user data and props
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
}

const UserSelectionPopover: React.FC<UserSelectionPopoverProps> = ({
  usersData,
  getFullName,
  memberIcon,
  selectDropIcon,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [tempSelectedMember, setTempSelectedMember] = useState<string[]>([]); // Stores selected user IDs as strings

  // Toggle selection of a user
  const toggleValue = (userId: string): void => {
    setTempSelectedMember((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Confirm selection and update the selected members
  const confirmSelection = (): void => {
    const selectedUsers = usersData.filter((user) =>
      tempSelectedMember.includes(user.id.toString())
    );
    setSelectedMembers(selectedUsers);
    setTempSelectedMember([]);
    setOpen(false);
  };

  // Handle removing a user from the selected list
  const removeUser = (userId: number): void => {
    setSelectedMembers((prev) => prev.filter((user) => user.id !== userId));
  };

  // Get displayed users and count for extra users
  const displayUsers = selectedMembers.slice(0, 2); // Show first 2 users
  const extraUsers = selectedMembers.slice(2); // Remaining users

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[220px] flex items-center justify-between px-2 bg-[#F4F4F6] border-[#E2E2E2] rounded-[8px] text-[#00000099]"
        >
          <div className="flex items-center gap-x-1">
            <img
              src={memberIcon}
              alt="Select Members"
              className="w-5 h-5 mr-1"
            />
            <p>Select Members</p>
          </div>
          <div>
            <span>
              <img
                src={selectDropIcon}
                alt="Dropdown Icon"
                className="w-5 h-5 mr-1"
              />
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 bg-white border rounded-sm z-[99999]">
        <Command>
          <CommandInput placeholder="Search Members" />
          <CommandList className="max-h-[220px] z-[99999]">
            <CommandGroup>
              {Array.isArray(usersData) &&
                usersData.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={getFullName(user)}
                    onSelect={() => toggleValue(user.id.toString())}
                    disabled={selectedMembers.some((m) => m.id === user.id)}
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

      {/* Render selected users as chips */}
      <div className="mt-4 flex gap-2">
        {displayUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center bg-[#F4F4F6] px-2 py-1 rounded-full text-sm text-[#00000099]"
          >
            <div className="flex items-center gap-x-2">
              <img
                src={user.profile_pic || "/profile-picture.png"}
                alt="User Avatar"
                className="w-6 h-6 rounded-full"
              />
              <span>{getFullName(user)}</span>
              <button
                onClick={() => removeUser(user.id)}
                className="ml-2 text-[#999999] hover:text-[#000]"
              >
                x
              </button>
            </div>
          </div>
        ))}
      </div>
    </Popover>
  );
};

export default UserSelectionPopover;
