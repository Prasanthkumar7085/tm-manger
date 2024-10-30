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
  updateTasksAPI,
} from "@/lib/services/tasks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Check, ChevronsUpDown, X } from "lucide-react";
import React, { useState, useMemo } from "react";
import { DatePicker } from "rsuite";
import { toast } from "sonner";

const AddTask = () => {
  const navigate = useNavigate();
  const { taskId } = useParams({ strict: false });

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
  const [projectsList, setProjectsList] = useState<any>([]);
  const [users, setUsers] = useState<any[]>([]);
  console.log(users, "users");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const [state, setState] = useState({
    tagInput: "",
    openProjects: false,
    openUsers: false,
    loading: false,
    errorMessages: {},
  });

  const { tagInput, openProjects, openUsers, loading, errorMessages } = state;

  const handleChange = (e: any) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleTagSubmit = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !task.tags.includes(trimmedTag)) {
      setTask((prev: any) => ({ ...prev, tags: [...prev.tags, trimmedTag] }));
      setState((prev) => ({ ...prev, tagInput: "" }));
    } else {
      setState((prev) => ({
        ...prev,
        errorMessages: { ...prev.errorMessages, tags: ["Tag already exists"] },
      }));
    }
  };

  const handleUserSelect = (user: any) => {
    setSelectedUsers((prev) => {
      const updated = new Set(prev);
      updated.has(user.id) ? updated.delete(user.id) : updated.add(user.id);
      return updated;
    });
  };

  const handleConfirmSelection = () => {
    const selected = users.filter((u) => selectedUsers.has(u.id));
    setTask((prevTask: any) => ({
      ...prevTask,
      users: [...prevTask.users, ...selected],
    }));
    setState((prev) => ({ ...prev, openUsers: false }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      ...task,
      users: task.users?.map(({ name, id }: any) => ({ name, id })),
    });
  };

  const { mutate } = useMutation({
    mutationFn: async (payload: any) => {
      setState((prev) => ({ ...prev, loading: true, errorMessages: {} }));
      return taskId ? updateTasksAPI(taskId, payload) : addTasksAPI(payload);
    },
    onSuccess: (response: any) => {
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        navigate({ to: "/tasks" });
      } else if (response?.status === 422) {
        setState((prev) => ({
          ...prev,
          errorMessages: response?.data?.errData || {},
        }));
      } else if (response?.status === 409) {
        setState((prev) => ({
          ...prev,
          errorMessages: response?.data?.errData || {},
        }));
      }
      setState((prev) => ({ ...prev, loading: false }));
    },
    onError: (error: any) => {
      toast.error("An error occurred. Please try again.");
      console.error(error);
      setState((prev) => ({ ...prev, loading: false }));
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
      const taskData = response?.data?.data;

      try {
        if (response?.status === 200 || response?.status === 201) {
          setTask(taskData);
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

  // to get the projects
  const {
    isLoading: isProjectsLoading,
    isError: isProjectsError,
    error: projectsError,
    data: projectsData,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await getDropDownForProjects();
      setProjectsList(response.data?.data);
      return response;
    },
  });

  // to get the users
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

  return (
    <div className="min-h-screen flex bg-gray-100 relative overflow-auto h-[90vh]">
      <main className="flex-1 p-8">
        <div className="bg-white shadow rounded-lg p-8 overflow-auto h-[80vh]">
          <h2 className="text-2xl font-bold mb-6">
            {taskId ? "Edit Task" : "Add Task"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Popover
                  open={openProjects}
                  onOpenChange={(open) =>
                    setState((prev) => ({ ...prev, openProjects: open }))
                  }
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
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
                          {projectsList?.map((project: any) => (
                            <CommandItem
                              key={project.id}
                              onSelect={() =>
                                setTask((prev: any) => ({
                                  ...prev,
                                  project_id: project.id,
                                }))
                              }
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

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2 w-full"
                    required
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
                    className="border border-gray-300 rounded-lg p-2 w-full"
                    rows={4}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={task.priority}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2 w-full"
                  >
                    <option value="">Select Priority</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={task.status}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2 w-full"
                  >
                    <option value="">Select Status</option>
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="OVER_DUE">Done</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Due Date
                  </label>
                  <DatePicker
                    format="yyyy-MM-dd"
                    onChange={(date: Date | null) =>
                      setTask((prev: any) => ({
                        ...prev,
                        due_date: date ? date.toISOString().split("T")[0] : "",
                      }))
                    }
                    value={task.due_date ? new Date(task.due_date) : null}
                  />
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Tags
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      name="tagInput"
                      value={tagInput}
                      onChange={(e) =>
                        setState({ ...state, tagInput: e.target.value })
                      }
                      className="border border-gray-300 rounded-lg p-2 w-full"
                      placeholder="Enter a tag"
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
                    {task.tags?.map((tag: string) => (
                      <span
                        key={tag}
                        className="bg-gray-200 text-gray-700 rounded-full px-4 py-1 mr-2 mt-2 text-sm"
                      >
                        {tag}
                        <X
                          className="ml-2 h-4 w-4 inline-block cursor-pointer"
                          onClick={() =>
                            setTask((prev: any) => ({
                              ...prev,
                              tags: prev.tags.filter((t: any) => t !== tag),
                            }))
                          }
                        />
                      </span>
                    ))}
                  </div>
                </div>

                <Popover
                  open={openUsers}
                  onOpenChange={(open) =>
                    setState((prev) => ({ ...prev, openUsers: open }))
                  }
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[200px] justify-between"
                    >
                      Select Users
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0 bg-white">
                    <Command>
                      <CommandInput placeholder="Search Users" />
                      <CommandList>
                        <CommandEmpty>No Users found.</CommandEmpty>
                        <CommandGroup>
                          {users?.map((user) => (
                            <CommandItem
                              key={user.id}
                              onSelect={() => handleUserSelect(user)}
                            >
                              <Check
                                className="mr-2 h-4 w-4"
                                style={{
                                  opacity: selectedUsers.has(user.id) ? 1 : 0.5,
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
                    <Button
                      className="w-full mt-2"
                      onClick={handleConfirmSelection}
                    >
                      Confirm Selection
                    </Button>
                  </PopoverContent>
                </Popover>

                <div className="mt-4">
                  <h3 className="font-bold text-lg">Selected Users:</h3>
                  <ul>
                    {task.users?.map((user: any) => (
                      <li key={user.id} className="flex items-center">
                        {user.name}
                        <X
                          className="ml-2 h-4 w-4 inline-block cursor-pointer"
                          onClick={() =>
                            setTask((prev: any) => ({
                              ...prev,
                              users: prev.users.filter(
                                (u: any) => u.id !== user.id
                              ),
                            }))
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <Button type="submit" className="mt-6 w-full">
              {loading ? (
                <LoadingComponent loading />
              ) : taskId ? (
                "Update Task"
              ) : (
                "Add Task"
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddTask;
