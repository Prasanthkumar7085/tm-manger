import React, { useState } from "react";
import { useRouter, useParams } from "@tanstack/react-router";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import LoadingComponent from "@/components/core/LoadingComponent";
import {
  addTasksAPI,
  getAllSubTasks,
  getSingleTaskAPI,
  updateTasksAPI,
} from "@/lib/services/tasks";
import { SubTaskColumns } from "./SubTasksColumns";
import { useSelector } from "react-redux";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { getProjectMembersAPI } from "@/lib/services/projects/members";
import { getDropDownForProjects } from "@/lib/services/projects";
import { ta } from "date-fns/locale";
import { Description } from "@radix-ui/react-dialog";
import { M } from "node_modules/vite/dist/node/types.d-aGj9QkWt";
import { Input } from "@/components/ui/input";

export const SubTasks = ({ viewData }: { viewData: any }) => {
  const router = useRouter();
  const { taskId } = useParams({ strict: false });
  const { subtaskId } = useParams({ strict: false });
  const [del, setDel] = useState(0);
  const { projectId } = useParams({ strict: false });
  const searchParams = new URLSearchParams(location.search);
  const [showNewSubtaskFields, setShowNewSubtaskFields] = useState(false);
  const profileData: any = useSelector(
    (state: any) => state.auth.user.user_details
  );
  const refernceId: any = useSelector((state: any) => state.auth.refId);
  const [task, setTask] = useState<any>({
    title: "",
    ref_id: "",
    description: "",
    priority: "LOW",
    status: searchParams.get("status") || "TODO",
    due_date: "",
    users: [],
    project_id: Number(searchParams.get("project_id")) || "",
  });
  const [subTasks, setSubTasks] = useState<any>([]);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  console.log(task, "task");
  console.log("Project ID before submit: ", task.project_id);

  const [openProjects, setOpenProjects] = useState(false);
  const [tagInput, setTagInput] = useState<any>("");

  const [projectsList, setProjectsList] = useState<any>([]);
  const [openUsers, setOpenUsers] = useState(false);
  const [errorMessages, setErrorMessages] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]);
  console.log(users, "users");
  const [selectedProjectLogo, setSelectedProjectLogo] =
    React.useState<any>(null);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [showActionButton, setShowActionButton] = useState(false);

  const handleChange = (e: any) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleProjectSelect = (project: any) => {
    setTask((prev: any) => ({
      ...prev,
      project_id: project.id ? project.id : "",

      users: [],
    }));
    setOpenProjects(false);
    setSelectedProjectLogo(
      `${import.meta.env.VITE_IMAGE_URL}/${project.logo}` || "/favicon.png"
    );
  };

  const handleSubmit = () => {
    setLoading(true);
    let payload = {
      parent_id: Number(taskId),
      ref_id: refernceId,
      description: "",

      // users: Array.from(selectedUsers),
      project_id: viewData?.project_id,
      title: task?.title,
      priority: "MEDIUM",
      status: "TODO",

      due_date: `${new Date().toISOString().split("T")[0]}T00:00:00.000Z`,
    };

    // if (!subtaskId) {
    //   payload["users"] = task?.users?.map((user: any) => ({
    //     name: user.name,
    //     id: user.user_id,
    //   }));
    // }
    mutate(payload);
    // router.navigate({ to: "/tasks/view/${taskId}" });
  };

  const { isFetching, isLoading } = useQuery({
    queryKey: ["subtasks", taskId, del, showDetailsDialog],
    queryFn: async () => {
      try {
        const response = await getAllSubTasks(taskId);
        if (response.status === 200 || response?.status === 201) {
          const data = response.data?.data;
          setSubTasks(data);
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
      return subtaskId
        ? updateTasksAPI(subtaskId, payload)
        : addTasksAPI(payload);
    },
    onSuccess: (response: any) => {
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        setShowActionButton(false);
        setDel((prev) => prev + 1);
        setTask({
          title: "",
        });
      } else if (response?.status === 422) {
        setErrorMessages(response?.data?.errData || {});
      } else if (response?.status === 409) {
        setErrorMessages(response?.data?.errData || {});
      } else {
        toast.error(response?.data?.message || "Something went wrong");
      }
      setLoading(false);
    },
    onError: (error: any) => {
      toast.error("An error occurred. Please try again.");
      console.error(error);
      setLoading(false);
    },
  });

  const { isLoading: isUsersLoading } = useQuery({
    queryKey: ["users", taskId],
    queryFn: async () => {
      const response = await getProjectMembersAPI(viewData?.project_id);
      if (response.success) {
        const data = response.data?.data;
        setUsers(data?.members || []);
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
      users: [
        ...(Array.isArray(prevTask?.users) ? prevTask.users : []),
        ...usersToAssign,
      ],
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

  const isAbleToAddOrEdit = () => {
    if (
      (isMananger(users, profileData?.id, profileData?.user_type) ||
        isProjectAdmin(users, profileData?.id, profileData?.user_type)) &&
      isProjectMemberOrNot(users, profileData?.id)
    ) {
      return true;
    }
  };

  const handleAddSubtask = () => {
    setShowNewSubtaskFields(!showNewSubtaskFields);
    setShowActionButton(true);
  };
  const handleValidation = () => {
    return task.title && task.title.length > 0;
  };
  const handleCancel = () => {
    setShowActionButton(false);
    setDel((prev) => prev + 1);
    setTask({
      title: "",
    });
    // setTask({
    //   title: "",
    //   ref_id: "",
    //   description: "",
    //   priority: "MEDIUM",
    //   status: "TODO",
    //   due_date: "",
    //   users: [],
    //   project_id: Number(searchParams.get("project_id")) || "",
    // });
    // setSelectedUsers(new Set());
  };

  return (
    <>
      <div className="relative">
        <div className="mt-5">
          {/* Add Subtask Button */}
          <div className="flex justify-end mb-3">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddSubtask}
            >
              Add SubTask
            </Button>
          </div>
          <SubTaskColumns
            data={subTasks}
            setDel={setDel}
            mainTask={viewData}
            showDetailsDialog={showDetailsDialog}
            setShowDetailsDialog={setShowDetailsDialog}
          />

          {showActionButton && (
            <div className="flex items-center gap-4 mb-4">
              <div style={{ display: "flex", gap: "10px", flex: "1" }}>
                <Input
                  name="title"
                  value={task.title}
                  onChange={handleChange}
                  placeholder=" Enter Title"
                />
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  disabled={!handleValidation()}
                >
                  Create
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                {/* <FormControl style={{ minWidth: 120 }}>
                  <InputLabel> Select Priority</InputLabel>
                  <Select
                    name="priority"
                    value={task.priority}
                    onChange={handleChange}
                    className="bg-slate-50 h-[40px] p-2 border w-full rounded-md"
                  >
                    <MenuItem value="HIGH">High</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="LOW">Low</MenuItem>
                  </Select>
                </FormControl>
                <FormControl style={{ minWidth: 120 }}>
                  <InputLabel>Select status</InputLabel>
                  <Select
                    name="status"
                    value={task.status}
                    onChange={handleChange}
                    className="bg-slate-50 h-[40px] p-2 border w-full rounded-md"
                  >
                    <MenuItem value="TODO">Todo</MenuItem>
                    <MenuItem value="IN_PROGRESS">Inprogress</MenuItem>
                    <MenuItem value="COMPLETED">Completed</MenuItem>
                    <MenuItem value="OVER_DUE">OverDue</MenuItem>
                  </Select>
                </FormControl> */}
              </div>
              {/* <div>
                <Popover open={openUsers} onOpenChange={setOpenUsers}>
                  <PopoverTrigger asChild>
                    <Button
                      disabled={
                        profileData?.user_type === "admin" ||
                        isAbleToAddOrEdit()
                          ? false
                          : true
                      }
                      className="justify-between  bg-slate-50 h-[40px] w-full relative text-[#00000099]"
                    >
                      Assigned Users
                      <ChevronsUpDown className="absolute right-2 top-1/2 -translate-y-1/2  bg-red-700 text-white rounded-full w-[20px] h-[20px] p-1" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[500px] p-0 bg-white">
                    <Command>
                      <CommandInput placeholder="Search Users" />
                      <CommandList>
                        <CommandEmpty>No Users found.</CommandEmpty>
                        <CommandGroup>
                          {users?.length > 0 &&
                            users.map((user) => (
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
                                    opacity: selectedUsers.has(user.id) ? 1 : 0,
                                  }}
                                />
                                <div className="w-6 h-6 object-contain	mr-2 rounded-full border  bg-white">
                                  <img
                                    src={
                                      user?.user_profile_pic_url ||
                                      "/profile-picture.png"
                                    }
                                  />
                                </div>
                                <p className="capitalize">
                                  {user.fname} {user.lname}
                                </p>
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                    <div className="flex justify-end p-2 border-t">
                      <Button
                        className="bg-[#000000] text-white px-6 font-medium text-sm rounded-[4px] hover:bg-[#000000]"
                        onClick={handleConfirmSelection}
                      >
                        Confirm
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div> */}
            </div>
          )}
          {/* {showActionButton && (
            <div className="flex gap-3">
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                disabled={!handleValidation()}
              >
                Create
              </Button>
              <Button variant="outlined" color="primary" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )} */}
        </div>
        <LoadingComponent loading={isLoading || loading} />
      </div>
    </>
  );
};
