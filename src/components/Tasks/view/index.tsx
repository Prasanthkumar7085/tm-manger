import LoadingComponent from "@/components/core/LoadingComponent";
import { Button } from "@/components/ui/button";
import { capitalizeWords } from "@/lib/helpers/CapitalizeWords";
import { taskStatusConstants } from "@/lib/helpers/statusConstants";
import { getSingleTaskAPI } from "@/lib/services/tasks";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useRouter } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useState } from "react";
import { toast } from "sonner";
import TagsComponent from "../Add/TagsComponent";
import AssignedUsers from "../AssigneTasks";
import UploadAttachments from "./Attachments";
import PriorityStatus from "./PriorityStatus";
import TopBar from "@/components/TopBar";
import TaskStatus from "./TaskStatus";
import TaskComments from "./Comments";

const TaskView = () => {
  const navigate = useNavigate();
  const router = useRouter();
  const { taskId } = useParams({ strict: false });
  const [commentsData, setCommentsData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [viewData, setViewData] = useState<any>();
  console.log(viewData, "mani");
  const [tagsData, setTagsData] = useState<any>({ tags: [] });
  const [tagsInput, setTagsInput] = useState("");
  const [errorMessages, setErrorMessages] = useState();
  const [tagInput, setTagInput] = useState<any>("");
  const [updateDetailsOfTask, setUpdateDetailsOfTask] = useState<any>(0);
  const [updatePrority, setUpdatePriority] = useState<{
    label: string;
    value: string;
  }>();
  const [selectedStatus, setSelectedStatus] = useState<{
    label: string;
    value: string;
  }>();
  const [selectedPriority, setSelectedPriority] = useState<any>();

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["getSingleTask", taskId, updateDetailsOfTask],
    queryFn: async () => {
      const response = await getSingleTaskAPI(taskId);
      const taskData = response?.data?.data;

      try {
        if (response?.status === 200 || response?.status === 201) {
          setViewData(taskData);
          let status = taskStatusConstants.find(
            (item: any) => item.value === taskData?.status
          );
          setSelectedStatus(status);
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

  const title = viewData?.project_description;
  const shouldShowDescriptionTooltip = title && title.length > 30;
  const truncatedDescription = shouldShowDescriptionTooltip
    ? `${title.substring(0, 30)}...`
    : title;

  const handleTagSubmit = () => {
    // Ensure input is not empty
    const trimmedTag = tagsInput.trim();
    if (!trimmedTag) {
      setErrorMessages((prev: any) => ({
        ...prev,
        tags: ["Tag cannot be empty"],
      }));
      return;
    }

    // Check for duplicates
    const isTagAlreadyExists = tagsData?.some(
      (tag: any) => tag.title.toLowerCase() === trimmedTag.toLowerCase()
    );
    if (isTagAlreadyExists) {
      setErrorMessages((prev: any) => ({
        ...prev,
        tags: ["Tag already exists"],
      }));
      return;
    }
  };

  return (
    <div className="flex flex-col space-x-4 items-start relative h-full overflow-auto">
      <div
        id="task-comments"
        className="w-full max-h-[700px] mt-4 overflow-hidden bg-white rounded-lg shadow-md relative"
      >
        <TaskComments taskId={taskId} />
      </div>
      <LoadingComponent loading={isLoading || loading} />
    </div>
  );
};

export default TaskView;
