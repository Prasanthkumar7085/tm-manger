import LoadingComponent from "@/components/core/LoadingComponent";
import UploadFiles from "@/components/core/UploadDocuments";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getDropDownForProjects } from "@/lib/services/projects";
import { getAllMembers } from "@/lib/services/projects/members";
import { addTasksAPI } from "@/lib/services/tasks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Check, ChevronsUpDown, X } from "lucide-react";
import React, { useState } from "react";
import { DatePicker } from "rsuite";
import { toast } from "sonner";

const AddTask = () => {
  const navigate = useNavigate();
  const [task, setTask] = useState<any>({
    title: "",
    ref_id: "",
    description: "",
    priority: "",
    status: "",
    due_date: "",
    tags: [],
    users: [],
  });
  const [openProjects, setOpenProjects] = useState(false);
  const [tagInput, setTagInput] = useState<any>("");
  const [projectsList, setProjectsList] = useState<any>([]);
  const [openUsers, setOpenUsers] = useState(false);
  const [errorMessages, setErrorMessages] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const handleChange = (e: any) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleTagSubmit = () => {
    if (tagInput.trim() && !task.tags.includes(tagInput.trim())) {
      setErrorMessages((prev: any) => ({
        ...prev,
        tags: [""],
      }));
      setTask((prev: any) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
    if (task.tags.includes(tagInput.trim())) {
      setErrorMessages((prev: any) => ({
        ...prev,
        tags: ["Tag already exists"],
      }));
    }
  };

  const handleTagDelete = (tag: any) => {
    setTask((prev: any) => ({
      ...prev,
      tags: prev.tags.filter((t: any) => t !== tag),
    }));
  };

  const handleProjectSelect = (project: any) => {
    setTask((prev: any) => ({
      ...prev,
      project_id: project.id ? project.id : "",
    }));
    setOpenProjects(false);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      ...task,
      users: task.users.map((user: any) => ({ name: user.name, id: user.id })),
    };
    mutate(payload);
  };

  //to add the task in the database
  const { mutate } = useMutation({
    mutationFn: async (payload: any) => {
      setErrorMessages({});
      setLoading(true);
      return await addTasksAPI(payload);
    },
    onSuccess: (response: any) => {
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        navigate({ to: "/tasks" });
      } else if (response?.status === 422) {
        setErrorMessages(response?.data?.errData || {});
      } else if (response?.status === 409) {
        setErrorMessages(response?.data?.errData || {});
      }
      setLoading(false);
    },
    onError: (error: any) => {
      toast.error("An error occurred. Please try again.");
      console.error(error);
      setLoading(false);
    },
  });

  //to get the projects
  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await getDropDownForProjects();
      setProjectsList(response.data?.data);
      return response;
    },
  });

  //to get the users
  const { isLoading: isUsersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await getAllMembers();
      if (response?.data?.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else {
        setUsers([]);
      }
      return response;
    },
  });

  const handleUserSelect = (user: any) => {
    const updatedSelectedUsers = new Set(selectedUsers);
    if (updatedSelectedUsers.has(user.id)) {
      updatedSelectedUsers.delete(user.id);
    } else {
      updatedSelectedUsers.add(user.id);
    }
    setSelectedUsers(updatedSelectedUsers);
  };

  const handleConfirmSelection = () => {
    const usersToAssign = users.filter((user) => selectedUsers.has(user.id));
    setTask((prevTask: any) => ({
      ...prevTask,
      users: [...prevTask.users, ...usersToAssign],
    }));
    setOpenUsers(false);
    setSelectedUsers(new Set());
  };

  const handleUserRemove = (userId: any) => {
    setTask((prevTask: any) => ({
      ...prevTask,
      users: prevTask.users.filter((user: any) => user.id !== userId),
    }));
  };

  return (
    <div className="min-h-screen flex bg-gray-100 relative overflow-auto h-[90vh]">
      <main className="flex-1 p-8">
        <div className="bg-white shadow rounded-lg p-8 overflow-auto h-[80vh]">
          <h2 className="text-2xl font-bold mb-6">Add Task</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Popover open={openProjects} onOpenChange={setOpenProjects}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openProjects}
                      className="w-[200px] justify-between"
                    >
                      {task.project_id
                        ? projectsList.find(
                            (p: any) => p.id === task.project_id
                          )?.title
                        : "Select Project"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      {task.project_id && (
                        <X
                          className="ml-2 h-4 w-4 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTask((prev: any) => ({
                              ...prev,
                              project_id: null,
                            }));
                          }}
                        />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0 bg-white">
                    <Command>
                      <CommandInput placeholder="Search Projects" />
                      <CommandList>
                        <CommandEmpty>No Projects found.</CommandEmpty>
                        <CommandGroup>
                          {projectsList.map((project: any) => (
                            <CommandItem
                              key={project.id}
                              onSelect={() => handleProjectSelect(project)}
                            >
                              <Check
                                className="mr-2 h-4 w-4"
                                style={{
                                  opacity:
                                    task.project_id === project.id ? 1 : 0.5,
                                }}
                              />
                              {project.title}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {errorMessages.project_id && (
                  <p style={{ color: "red" }}>
                    {errorMessages?.project_id?.[0]}
                  </p>
                )}

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
                  {errorMessages.title && (
                    <p style={{ color: "red" }}>{errorMessages?.title?.[0]}</p>
                  )}
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
                  {errorMessages.description && (
                    <p style={{ color: "red" }}>
                      {errorMessages?.description?.[0]}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Assign To
                  </label>
                  <Popover open={openUsers} onOpenChange={setOpenUsers}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full">
                        Select Users
                        <ChevronsUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 bg-white">
                      <Command>
                        <CommandInput placeholder="Search Users" />
                        <CommandList>
                          <CommandEmpty>No Users found.</CommandEmpty>
                          <CommandGroup>
                            {users.map((user) => (
                              <CommandItem
                                key={user.id}
                                onSelect={() => handleUserSelect(user)}
                              >
                                <Check
                                  className="mr-2 h-4 w-4"
                                  style={{
                                    opacity: selectedUsers.has(user.id)
                                      ? 1
                                      : 0.5,
                                  }}
                                />
                                <p className="capitalize">
                                  {user.fname} {user.lname}
                                </p>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                      <div className="flex justify-end p-2">
                        <Button onClick={handleConfirmSelection}>
                          Confirm
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  {task.users?.length > 0 ? (
                    <div>
                      <label className="block text-gray-700 font-bold mb-2 mt-4">
                        Assigned Users
                      </label>

                      <div className="overflow-auto max-h-40">
                        <table className="min-w-full bg-white border border-gray-300">
                          <thead className="bg-gray-200 sticky top-0">
                            <tr>
                              <th className="border px-4 py-2">S.No.</th>
                              <th className="border px-4 py-2">Name</th>
                              <th className="border px-4 py-2">User Type</th>
                              <th className="border px-4 py-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {task.users.map((user: any, index: number) => (
                              <tr key={user.id} className="hover:bg-gray-100">
                                <td className="border px-4 py-2">
                                  {index + 1}
                                </td>
                                <td className="border px-4 py-2 capitalize">
                                  {user.fname} {user.lname}
                                </td>
                                <td className="border px-4 py-2 capitalize">
                                  {user.user_type}
                                </td>
                                <td className="border px-4 py-2">
                                  <button
                                    className="text-red-500 hover:underline"
                                    onClick={() => handleUserRemove(user.id)}
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {task.users.length === 0 && (
                              <tr>
                                <td className="text-center border px-4 py-2">
                                  No Users Assigned
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Due Date
                  </label>
                  <DatePicker
                    name="due_date"
                    value={task.due_date}
                    onChange={(date: any) =>
                      handleChange({
                        target: { name: "due_date", value: date },
                      })
                    }
                    placeholder="Select Due Date"
                    editable={false}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    disabledDate={(date: any) => date < new Date()}
                    style={{ width: "100%" }}
                  />

                  {errorMessages.due_date && (
                    <p style={{ color: "red" }}>
                      {errorMessages?.due_date?.[0]}
                    </p>
                  )}
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
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                  {errorMessages.priority && (
                    <p style={{ color: "red" }}>
                      {errorMessages?.priority?.[0]}
                    </p>
                  )}
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
                  {errorMessages.tags && (
                    <p style={{ color: "red" }}>{errorMessages?.tags?.[0]}</p>
                  )}
                  <div className="flex flex-wrap mt-2">
                    {task.tags.map((tag: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center mt-2 px-3 py-1 bg-green-100 text-green-800 text-sm rounded mr-2"
                      >
                        {tag}
                        <p
                          className="ml-1 text-red-500 rotate-[45deg] cursor-pointer"
                          onClick={() => handleTagDelete(tag)}
                        >
                          +
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
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
              </div>
            </div>
          </form>
        </div>
      </main>
      <LoadingComponent loading={loading} />
    </div>
  );
};

export default AddTask;
