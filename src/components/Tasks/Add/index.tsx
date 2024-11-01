import LoadingComponent from "@/components/core/LoadingComponent";
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
import {
  addTasksAPI,
  getSingleTaskAPI,
  getTasksBasedTagsAPI,
  updateTasksAPI,
} from "@/lib/services/tasks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Check, ChevronsUpDown, X } from "lucide-react";
import React, { useState } from "react";
import { DatePicker } from "rsuite";
import { toast } from "sonner";
import TagsComponent from "./TagsComponent";

const AddTask = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { taskId } = useParams({ strict: false });
  const searchParams = new URLSearchParams(location.search);

  const [task, setTask] = useState<any>({
    title: "",
    ref_id: "",
    description: "",
    priority: "",
    status: searchParams.get("status") || "",
    due_date: "",
    tags: [],
    users: [],
    project_id: Number(searchParams.get("project_id")) || "",
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

  const handleProjectSelect = (project: any) => {
    setTask((prev: any) => ({
      ...prev,
      project_id: project.id ? project.id : "",
    }));
    setOpenProjects(false);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let payload = {
      ...task,
    };
    if (!taskId) {
      payload["users"] = task.users.map((user: any) => ({
        name: user.name,
        id: user.id,
      }));
    }
    mutate(payload);
  };

  //to add the task in the database
  const { mutate } = useMutation({
    mutationFn: async (payload: any) => {
      setErrorMessages({});
      setLoading(true);
      return taskId ? updateTasksAPI(taskId, payload) : addTasksAPI(payload);
    },
    onSuccess: (response: any) => {
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        window.history.back();
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
  // to get the single task
  const {
    isLoading: isTaskLoading,
    isError: isTaskError,
    error: taskError,
    data: taskData,
  } = useQuery({
    queryKey: ["getSingleTask", taskId],
    queryFn: async () => {
      const response = await getSingleTaskAPI(taskId);
      const tagsResponse = await getTasksBasedTagsAPI(taskId);
      const taskData = response?.data?.data;
      const tagsData = tagsResponse?.data?.data.map((tag: any) => tag.title);
      try {
        if (response?.status === 200 || response?.status === 201) {
          setTask(taskData);
          setTask((prev: any) => ({
            ...prev,
            tags: tagsData || [],
          }));
        } else {
          throw new Error("Failed to fetch task");
        }
      } catch (err: any) {
        toast.error(err?.message || "Something went wrong");
        throw err;
      }
    },
    enabled: Boolean(taskId),
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
          <h2 className="text-2xl font-bold mb-6">
            {taskId ? "Edit Task" : "Add Task"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
              <div className="w-full">
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
                              className="text-ellipsis overflow-hidden"
                            >
                              <Check
                                className="mr-2 h-4 w-4"
                                style={{
                                  opacity:
                                    task.project_id === project.id ? 1 : 0,
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
                {!taskId && (
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
                                  disabled={task.users?.some(
                                    (u: any) => u.id === user.id
                                  )}
                                >
                                  <Check
                                    className="mr-2 h-4 w-4"
                                    style={{
                                      opacity: selectedUsers.has(user.id)
                                        ? 1
                                        : 0,
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
                )}
              </div>

              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Due Date
                  </label>
                  <DatePicker
                    name="due_date"
                    onChange={(date: any) =>
                      handleChange({
                        target: { name: "due_date", value: date },
                      })
                    }
                    value={task.due_date ? new Date(task.due_date) : null}
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
                    Task Status
                  </label>
                  <select
                    name="status"
                    value={task.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Select Status</option>
                    <option value="TODO">Todo</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="OVER_DUE">Overdue</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                  {errorMessages.status && (
                    <p style={{ color: "red" }}>{errorMessages?.status?.[0]}</p>
                  )}
                </div>

                <TagsComponent
                  tagInput={tagInput}
                  setTagInput={setTagInput}
                  task={task}
                  setTask={setTask}
                  errorMessages={errorMessages}
                  setErrorMessages={setErrorMessages}
                />

                <div className="flex justify-end">
                  <Button
                    type="button"
                    className="px-6 py-2 bg-red-500 text-white rounded-md mr-2"
                    onClick={() => window.history.back()}
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
      <LoadingComponent loading={loading || isLoading || isTaskLoading} />
    </div>
  );
};

export default AddTask;
