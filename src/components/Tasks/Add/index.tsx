import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  addTasksAPI,
  getSingleTaskAPI,
  updateTasksAPI,
} from "@/lib/services/tasks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

interface ReportPayload {
  title: string;
  description: string;
  prirority: string;
  due_date: string;
  project_id: string;
}

const AddTask = () => {
  const navigate = useNavigate();
  const { taskId } = useParams({ strict: false });

  const [userData, setUserData] = useState<any>({});
  const [errorMessages, setErrorMessages] = useState<any>({});
  const [userTypeOpen, setUserTypeOpen] = useState(false);
  const [userType, setUserType] = useState("");

  const { mutate, isPending, isError, error, data, isSuccess } = useMutation({
    mutationFn: async (payload: ReportPayload) => {
      if (taskId) {
        return await updateTasksAPI(payload, taskId);
      } else {
        return await addTasksAPI(payload);
      }
    },
    onSuccess: (response: any) => {
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        navigate({
          to: "/tasks",
        });
      }
      if (response?.status === 422) {
        setErrorMessages(response?.data?.errData || [""]);
        toast.error(response?.data?.message);
      }
    },
  });

  const addUser = () => {
    if (taskId) {
      const payload: any = {
        title: userData?.title,
        description: userData?.description,
        project_id: userData?.project_id,
        prirority: userData?.prirority,
        due_date: userData?.due_date,
      };

      mutate(payload);
    } else {
    }
  };

  const { isFetching } = useQuery({
    queryKey: ["getSingleUser", taskId],
    queryFn: async () => {
      if (!taskId) return;
      try {
        const response = await getSingleTaskAPI(taskId);

        if (response.success) {
          const data = response?.data?.data;
          setUserData({
            title: data?.title,
            description: data?.description,
            prirority: data?.prirority,
            due_date: data?.due_date,
          });
          setUserType(data?.user_type);
        } else {
          throw response;
        }
      } catch (errData) {
        console.error(errData);
        // errPopper(errData);
      }
    },
    enabled: Boolean(taskId),
  });

  const handleInputChange = (e: any) => {
    let { name, value } = e.target;
    const updatedValue = value
      .replace(/[^a-zA-Z\s]/g, "")
      .replace(/^\s+/g, "")
      .replace(/\s{2,}/g, " ");
    setUserData({
      ...userData,
      [name]: updatedValue,
    });
  };

  const handleChangeEmail = (e: any) => {
    let { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };
  const handleChangePassword = (e: any) => {
    let { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };
  const onChangeStatus = (value: string) => {
    setUserType(value);
  };

  return (
    <Card className="p-6 max-w-lg mx-auto shadow-md">
      <h1 className="text-2xl font-bold text-black-600 ml-2">
        {taskId ? "Update Task" : "Add Task"}
      </h1>
      <Button
        variant="ghost"
        onClick={() =>
          navigate({
            to: "/tasks",
          })
        }
        className="mb-4 border-black"
      >
        ← Back
      </Button>

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Task Title
          </label>
          <Input
            id="title"
            placeholder="Enter Title"
            value={userData.title}
            name="title"
            onChange={handleInputChange}
          />
          {errorMessages?.title && (
            <p style={{ color: "red" }}>{errorMessages.title[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <Input
            id="ldescription"
            placeholder="Enter Description"
            value={userData.last_name}
            name="description"
            onChange={handleInputChange}
          />
          {errorMessages?.description && (
            <p style={{ color: "red" }}>{errorMessages.description[0]}</p>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() =>
              navigate({
                to: "/users",
              })
            }
          >
            Cancel
          </Button>
          <Button type="submit" onClick={addUser}>
            {taskId ? "Update" : "Add"}
          </Button>
        </div>
      </div>
    </Card>
  );
};
export default AddTask;
