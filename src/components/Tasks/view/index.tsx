import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { capitalizeWords } from "@/lib/helpers/CapitalizeWords";
import {
  addPostCommentsAPI,
  getSingleTaskAPI,
  getTagsAPI,
} from "@/lib/services/tasks";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import AssignedUsers from "../AssigneTasks";
import UploadAttachments from "./Attachments";
import LoadingComponent from "@/components/core/LoadingComponent";

const TaskView = () => {
  const navigate = useNavigate();
  const router = useRouter();
  const { taskId } = useParams({ strict: false });
  const [commentsData, setCommentsData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [viewData, setViewData] = useState<any>();
  const [tagsData, setTagsData] = useState<any>();
  const [tagsInput, setTagsInput] = useState("");
  const [errorMessages, setErrorMessages] = useState({ tags: [] });

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["getSingleTask", taskId],
    queryFn: async () => {
      const response = await getSingleTaskAPI(taskId);
      const taskData = response?.data?.data;

      try {
        if (response?.status === 200 || response?.status === 201) {
          setViewData(taskData);
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

  const { isFetching } = useQuery({
    queryKey: ["gettags", taskId],
    queryFn: async () => {
      const response = await getTagsAPI(taskId);
      const tagsData = response?.data?.data;
      try {
        if (response?.status === 200 || response?.status === 201) {
          setTagsData(tagsData);
        } else {
          throw new Error("Failed to fetch task");
        }
      } catch (err: any) {
        toast.error(err?.message || "Something went wrong");
        throw err;
      }
    },
  });

  const addComment = async () => {
    setLoading(true);
    try {
      const payload = {
        task_id: taskId,
        message,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const response = await addPostCommentsAPI(taskId, payload);
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message || "Comment added successfully");

        setMessage("");
      } else {
        throw new Error("Failed to add comment");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
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
    <div className=" flex flex-col space-y-6 md:space-y-0 md:flex-row md:space-x-6 px-3 relative">
      <div className="md:w-2/3 w-full bg-white rounded-lg shadow-md  space-y-4">
        <div className="flex justify-between items-start border-b pb-4">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-semibold">
              {viewData?.title ? capitalizeWords(viewData?.title) : "--"}
            </h1>

            <div className="text-gray-500 font-medium">
              Project:{" "}
              <span className="font-semibold text-gray-800">
                {viewData?.project_title
                  ? capitalizeWords(viewData?.project_title)
                  : "--"}
              </span>
            </div>

            <div className="font-medium">
              Description:{" "}
              <span className="text-gray-800">
                {viewData?.project_description
                  ? capitalizeWords(viewData?.project_description)
                  : "--"}
              </span>
            </div>
            <div className="flex flex-col items-start ">
              <div className="text-blue-500 bg-gray-100 px-3 py-1 rounded-md mb-2">
                Tags
              </div>
              <div className="flex flex-wrap space-x-2">
                {tagsData && tagsData.length > 0 ? (
                  tagsData?.map((tag: any, idx: any) => (
                    <Badge key={idx} className="bg-pink-400" variant="outline">
                      {tag.title}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500">No Tags</p>
                )}
              </div>
            </div>
          </div>
          <div>
            <Button
              type="button"
              className="flex bg-blue-500"
              onClick={() => {
                router.navigate({
                  to: `/tasks/${taskId}`,
                });
              }}
            >
              Edit Task
            </Button>
          </div>
        </div>

        <div>
          <h2 className="font-semibold">Assigned To</h2>
          <div className="mt-2">
            <AssignedUsers />
          </div>
        </div>
        <div>
          <UploadAttachments />
        </div>
      </div>

      <div className="md:w-1/3 w-full bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="font-semibold">Comments</h2>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://i.pravatar.cc/150?img=5"
                  alt="Avatar"
                />
                <span className="font-semibold">Robert</span>
                <span className="text-gray-500 text-sm">1 month ago</span>
              </div>
              <button className="text-blue-500">Reply</button>
            </div>
            <p className="mt-2 text-gray-600">
              Impressive! Though it seems the drag feature could be improved.
              But overall it looks incredible.
            </p>
          </div>

          {/* Nested Reply */}
          <div className="ml-8 border-b pb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://i.pravatar.cc/150?img=6"
                  alt="Avatar"
                />
                <span className="font-semibold">Dyane</span>
                <span className="text-gray-500 text-sm">1 week ago</span>
              </div>
              <button className="text-blue-500">Reply</button>
            </div>
            <p className="mt-2 text-gray-600">
              @Robert If you’re still new, I’d recommend focusing on the
              fundamentals of HTML, CSS, and JS before considering React.
            </p>
          </div>
        </div>

        {/* Add Comment Section */}
        <div className="flex items-center space-x-3 mt-4">
          <img
            className="w-8 h-8 rounded-full"
            src="https://i.pravatar.cc/150?img=4"
            alt="User"
          />
          <input
            type="text"
            className="flex-grow border rounded-md px-4 py-2 focus:outline-none"
            placeholder="Add a comment..."
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Send
          </button>
        </div>
      </div>
      <LoadingComponent loading={isLoading || loading} />
    </div>
  );
};

export default TaskView;
