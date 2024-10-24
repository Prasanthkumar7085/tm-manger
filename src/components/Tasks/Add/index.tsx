import Loading from "@/components/core/Loading";
import UploadFiles from "@/components/core/UploadDocuments";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import { toast } from "sonner";
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
import { Check, ChevronsUpDown, X } from "lucide-react";
import { statusConstants } from "@/lib/helpers/statusConstants";

const usersList = [
  { name: "SUNDAR", id: 2 },
  { name: "Prasad", id: 8 },
  { name: "John", id: 9 },
  { name: "Test", id: 12 },
];

const AddTask = () => {
  const navigate = useNavigate();
  const [task, setTask] = useState<any>({
    title: "",
    ref_id: "",
    description: "",
    project_id: null,
    priority: "",
    status: "",
    due_date: "",
    tags: [],
    users: [],
  });
  const [openStatus, setOpenStatus] = useState(false);
  const [openUsers, setOpenUsers] = useState(false);
  const [tagInput, setTagInput] = useState<any>("");

  const handleChange = (e: any) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleTagSubmit = () => {
    if (tagInput.trim() && !task.tags.includes(tagInput.trim())) {
      setTask((prev: any) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleUserSelect = (user: any) => {
    setTask((prev: any) => {
      const isSelected = prev.users.some((u: any) => u.id === user.id);
      const users = isSelected
        ? prev.users.filter((u: any) => u.id !== user.id)
        : [...prev.users, user];
      return { ...prev, users };
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      ...task,
      users: task.users.map((user: any) => ({ name: user.name, id: user.id })),
    };
    console.log("Payload to submit:", payload);
    toast.success("Task added successfully!");
    navigate({ to: "/tasks" });
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <main className="flex-1 p-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Add Task</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Popover open={openStatus} onOpenChange={setOpenStatus}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openStatus}
                      className="w-[200px] justify-between"
                    >
                      {task.status
                        ? statusConstants.find(
                            (item) => item.value === task.status
                          )?.label
                        : "Select Status"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      {task.status && (
                        <X
                          className="ml-2 h-4 w-4 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTask((prev: any) => ({ ...prev, status: "" }));
                          }}
                        />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0 bg-white">
                    <Command>
                      <CommandInput placeholder="Search Status" />
                      <CommandList>
                        <CommandEmpty>No Status found.</CommandEmpty>
                        <CommandGroup>
                          {statusConstants.map((status) => (
                            <CommandItem
                              key={status.value}
                              onSelect={() => {
                                setTask((prev: any) => ({
                                  ...prev,
                                  status: status.value,
                                }));
                                setOpenStatus(false);
                              }}
                            >
                              <Check
                                className="mr-2 h-4 w-4"
                                style={{
                                  opacity:
                                    task.status === status.value ? 1 : 0.5,
                                }}
                              />
                              {status.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter Task Title"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={task.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter Task Description"
                  ></textarea>
                </div>

                <div className="mb-4">
                  <UploadFiles />
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="due_date"
                    value={task.due_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Priority Level
                  </label>
                  <select
                    name="priority"
                    value={task.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Select priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Tags
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleTagSubmit();
                          e.preventDefault();
                        }
                      }}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Enter tag"
                    />
                    <Button
                      type="button"
                      onClick={handleTagSubmit}
                      className="ml-2"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap mt-2">
                    {task.tags.map((tag: any, index: number) => (
                      <span
                        key={index}
                        className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-sm rounded mr-2"
                      >
                        {tag}
                        <button
                          className="ml-1 text-red-500"
                          onClick={() =>
                            setTask((prev: any) => ({
                              ...prev,
                              tags: prev.tags.filter((t: any) => t !== tag),
                            }))
                          }
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Assign To
                  </label>
                  <Popover open={openUsers} onOpenChange={setOpenUsers}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full">
                        {task.users.length > 0
                          ? task.users.map((user: any) => user.name).join(", ")
                          : "Select Users"}
                        <ChevronsUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 bg-white">
                      <Command>
                        <CommandInput placeholder="Search Users" />
                        <CommandList>
                          <CommandEmpty>No Users found.</CommandEmpty>
                          <CommandGroup>
                            {usersList.map((user) => (
                              <CommandItem
                                key={user.id}
                                onSelect={() => handleUserSelect(user)}
                              >
                                <Check
                                  className="mr-2 h-4 w-4"
                                  style={{
                                    opacity: task.users.some(
                                      (u: any) => u.id === user.id
                                    )
                                      ? 1
                                      : 0.5,
                                  }}
                                />
                                {user.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                type="button"
                className="px-6 py-2 bg-red-500 text-white rounded-md mr-2"
                onClick={() => navigate({ to: "/tasks" })}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddTask;
