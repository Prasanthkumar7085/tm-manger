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

interface ProjectPayload {
  title: string;
  description: string;
  members: { name: string; role: string }[];
}

const AddProject = () => {
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
  });
  const [selectedMembers, setSelectedMembers] = useState<
    { name: string; role: string }[]
  >([]);
  const [open, setOpen] = useState(false);
  const [tempSelectedMember, setTempSelectedMember] = useState<string[]>([]);

  const handleInputChange = (e: any) => {
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
    tempSelectedMember.forEach((memberValue) => {
      const memberLabel = membersConstants.find(
        (member) => member.value === memberValue
      )?.label;
      if (memberLabel && !selectedMembers.some((m) => m.name === memberLabel)) {
        setSelectedMembers((prev) => [
          ...prev,
          { name: memberLabel, role: "User" },
        ]);
      }
    });
    setTempSelectedMember([]);
    setOpen(false);
  };

  const removeMember = (memberName: string) => {
    setSelectedMembers(
      selectedMembers.filter((member) => member.name !== memberName)
    );
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
        <Textarea
          placeholder="Enter project description"
          id="description"
          value={projectData.description}
          name="description"
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px]">
              {selectedMembers.length > 0
                ? selectedMembers.map((member) => member.name).join(", ")
                : "Select Members"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search Members" />
              <CommandList>
                <CommandEmpty>No Members Found</CommandEmpty>
                <CommandGroup>
                  {membersConstants.map((member) => (
                    <CommandItem
                      key={member?.value}
                      value={member?.value}
                      onSelect={() => toggleValue(member.value)}
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
                <Button size="sm" onClick={confirmSelection}>
                  Confirm
                </Button>
              </div>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedMembers.length > 0 && (
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">S No</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {selectedMembers.map((member, index) => (
                <tr key={member.name}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{member.name}</td>
                  <td className="border px-4 py-2 flex">
                    <Select
                      value={member.role}
                      onValueChange={(value) =>
                        setSelectedMembers((prev) =>
                          prev.map((m) =>
                            m.name === member.name ? { ...m, role: value } : m
                          )
                        )
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="User">User</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => removeMember(member.name)}
                      className="text-red-500"
                    >
                      ✖
                    </Button>
                  </td>
                  <td className="border px-4 py-2"></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => console.log("Cancel")}>
          Cancel
        </Button>
        <Button onClick={() => toast.success("Project submitted!")}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default AddProject;
