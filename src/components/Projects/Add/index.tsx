import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

const AddProject = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([
    { id: 1, name: "kedar", role: "User" },
    { id: 2, name: "Sundhar", role: "User" },
    { id: 3, name: "Srikanth", role: "User" },
    { id: 4, name: "Bhanu prasad", role: "User" },
  ]);

  const handleRoleChange = (id: any, role: any) => {
    setMembers(
      members.map((member) => (member.id === id ? { ...member, role } : member))
    );
  };
  const handleSubmit = () => {
    toast.success("Project added successfully!");

    navigate({
      to: "/projects",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center space-x-4">
        <div>
          <h2 className="text-2xl font-semibold">Add Project</h2>
        </div>
      </div>

      <div className="space-y-4">
        <Input placeholder="Enter Project Title" className="w-full" />
        <Textarea placeholder="Enter project Description" className="w-full" />
      </div>

      <div className="space-y-4">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Members" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Sundhar</SelectItem>
            <SelectItem value="dark">Bhanu Prasad</SelectItem>
          </SelectContent>
        </Select>

        <div className="border-t border-gray-200 mt-4">
          <div className="flex items-center space-x-4 py-2">
            <span className="w-10 text-sm font-semibold">S.No</span>
            <span className="w-40 text-sm font-semibold">Name</span>
            <span className="w-[120px] text-sm font-semibold">Role</span>
          </div>

          <div className="mt-4">
            {members.map((member, index) => (
              <div key={member.id} className="flex items-center space-x-4 py-2">
                <span className="w-10 text-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="flex items-center space-x-3 w-40">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={`https://i.pravatar.cc/150?img=${member.id}`}
                      alt={member.name}
                    />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{member.name}</span>
                </div>

                {/* Role */}
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Members" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Admin</SelectItem>
                    <SelectItem value="dark">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          className="px-6 py-2 bg-red-500 text-white rounded-md mr-2"
          onClick={() => navigate({ to: "/projects" })}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default AddProject;
