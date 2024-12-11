import LoadingComponent from "@/components/core/LoadingComponent";
import { Input } from "@/components/ui/input";
import {
  isMananger,
  isProjectAdmin,
  isProjectMemberOrNot,
} from "@/lib/helpers/loginHelpers";
import { getProjectMembersAPI } from "@/lib/services/projects/members";
import {
  addTasksAPI,
  getAllSubTasks,
  updateTasksAPI
} from "@/lib/services/tasks";
import {
  Button
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { SubTaskColumns } from "./SubTasksColumns";

export const SubTasks = ({ viewData }: { viewData: any }) => {
  const router = useRouter();
  const { taskId } = useParams({ strict: false });
  const { subtaskId } = useParams({ strict: false });
  const [del, setDel] = useState(0);
  const subTaskColumnsRef: any = useRef(null);

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
  const [updatePrority, setUpdatePriority] = useState<{
    label: string;
    value: string;
  }>();
  const [selectedStatus, setSelectedStatus] = useState<{
    label: string;
    value: string;
  }>();
  const [updateDetailsOfTask, setUpdateDetailsOfTask] = useState<any>(0);

  const [openProjects, setOpenProjects] = useState(false);
  const [tagInput, setTagInput] = useState<any>("");

  const [projectsList, setProjectsList] = useState<any>([]);
  const [openUsers, setOpenUsers] = useState(false);
  const [errorMessages, setErrorMessages] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedProjectLogo, setSelectedProjectLogo] = React.useState<any>(
    null
  );
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [showActionButton, setShowActionButton] = useState(false);
  const [selectedSubTaskStatus, setSelectedSubTaskStatus] = useState<{
    label: string;
    value: string;
  }>();
  const [selectedPriority, setSelectedPriority] = useState<any>();

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

      project_id: viewData?.project_id,
      title: task?.title,
      priority: "MEDIUM",
      status: "TODO",

      due_date: `${new Date().toISOString().split("T")[0]}T00:00:00.000Z`,
    };
    mutate(payload);
  };

  const { isFetching, isLoading } = useQuery({
    queryKey: [
      "subtasks",
      taskId,
      del,
      showDetailsDialog,
      selectedSubTaskStatus,
      selectedPriority,
      updateDetailsOfTask,
      updatePrority,
    ],
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
    setErrorMessages({});
  };

  return (
    <section className="border rounded-md my-2">
      <div className="relative">
        <div>
          <div className="flex justify-between items-center px-4 py-2 bg-gray-50">
            <h1 className="text-sm font-medium text-[#1B2459] ">SubTasks</h1>
            {!showActionButton && (
              <div
                title="Add SubTask"
                className="flex items-center  cursor-pointer bg-gray-600 text-white font-font-semibold px-3 py-0 rounded-md"
                onClick={handleAddSubtask}
              >
                Add <Plus className="pl-2 font-bold" />
              </div>
            )}
          </div>
          <hr />
          {showActionButton && (
            <div className="flex items-center gap-4 ">
              <div className="flex flex-1 gap-x-4 p-4 justify-center items-center">
                <Input
                  name="title"
                  value={task.title}
                  onChange={handleChange}
                  placeholder=" Enter Title"
                />
                                <Button
                  type="button"
                  variant="contained"
                  className="!bg-[#1B2459] !text-white font-medium text-md !hover:bg-[#1B2459] h-[30px] !hover:text-white px-8"
                  onClick={handleSubmit}
                  disabled={!handleValidation()}
                >
                  Create
                </Button>

                <Button
                  type="button"
                  variant="outlined"
                  className="!bg-white !border-transparent !text-[#FF6000] text-md px-8 font-medium h-[30px] !hover:bg-transparent !hover:text-[#FF6000]"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          {errorMessages.title && (
            <p style={{ color: "red", paddingLeft: "10px" }}>
              {errorMessages?.title?.[0]}
            </p>
          )}
          {subTasks.length > 0 ? (
            <div className="max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
              <SubTaskColumns
              data={subTasks}
              setDel={setDel}
              mainTask={viewData}
              showDetailsDialog={showDetailsDialog}
              setShowDetailsDialog={setShowDetailsDialog}
              selectedSubTaskStatus={selectedSubTaskStatus}
              setSelectedSubTaskStatus={setSelectedSubTaskStatus}
              setSelectedPriority={setSelectedPriority}
              selectedPriority={selectedPriority}
              setUpdateDetailsOfTask={setUpdateDetailsOfTask}
              setUpdatePriority={setUpdatePriority}
            />
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-lg">
              No Subtasks Found
            </div>
          )}
        </div>
        <LoadingComponent loading={loading} />
      </div>
    </section>
  );
};
