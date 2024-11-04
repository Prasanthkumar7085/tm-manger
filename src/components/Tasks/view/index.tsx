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
import TagsComponent from "../Add/TagsComponent";

const TaskView = () => {
  const navigate = useNavigate();
  const router = useRouter();
  const { taskId } = useParams({ strict: false });
  const [commentsData, setCommentsData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [viewData, setViewData] = useState<any>();
  const [tagsData, setTagsData] = useState<any>({ tags: [] });
  const [tagsInput, setTagsInput] = useState("");
  const [errorMessages, setErrorMessages] = useState();
  const [tagInput, setTagInput] = useState<any>("");

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
          const tagsDetails = tagsData.map((tag: any) => tag.title);

          setViewData((prev: any) => ({
            ...prev,
            tags: tagsDetails,
          }));
        } else {
          throw new Error("Failed to fetch task");
        }
      } catch (err: any) {
        toast.error(err?.message || "Something went wrong");
        throw err;
      }
    },
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
    <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row md:space-x-4 px-3 relative">
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
              <TagsComponent
                tagInput={tagInput}
                setTagInput={setTagInput}
                task={viewData}
                setTask={setViewData}
                errorMessages={errorMessages}
                setErrorMessages={setErrorMessages}
              />
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
            <AssignedUsers viewTaskData={viewData} />
          </div>
        </div>
        <div>
          <UploadAttachments />
        </div>
      </div>

      <div id="task-comments" className="w-full md:w-1/3 bg-white rounded-lg shadow-md relative">
        <div className="card-header flex justify-between px-4 py-2 items-center mb-4">
          <h3 className="text-lg font-semibold">Comments</h3>
          <button className="check-activity-button btn px-5 py-2 bg-[#28A74533] rounded-lg text-[#28A745] font-semibold">Check Activity</button>
        </div>
        <div className="card-body px-4">
          <div className="member-comments space-y-3">
            <div className="each-member bg-[#FEF7FD] py-3 px-4 rounded-md">
              <div className="flex justify-between items-center">
                <div className="member-details flex items-center space-x-3">
                  <div className="member-profile-image">
                    <img
                      className="w-8 h-8 rounded-full"
                      src="https://i.pravatar.cc/150?img=5"
                      alt="Avatar"
                    />
                  </div>
                  <div className="member-name">
                    <span className="font-semibold">Robert</span>
                    <span className="text-gray-500 text-sm pl-2">1 month ago</span>
                  </div>
                </div>
                <button className="replay-button text-[#5357B6] flex items-center font-semibold">
                  <img src="/replay-arrow.svg" alt="icon" className="mr-2" />
                  Replay
                </button>
              </div>
              <div className="person-message">
                <p className="mt-2 text-slate-500 leading-snug">
                  Impressive! Though it seems the drag feature could be improved.
                  But overall it looks incredible.
                </p>
              </div>
            </div>
            <div className="each-member bg-[#FEF7FD] py-3 px-4 rounded-md ml-5">
              <div className="flex justify-between items-center">
                <div className="member-details flex items-center space-x-3">
                  <div className="member-profile-image">
                    <img
                      className="w-8 h-8 rounded-full"
                      src="https://i.pravatar.cc/150?img=5"
                      alt="Avatar"
                    />
                  </div>
                  <div className="member-name">
                    <span className="font-semibold">Robert</span>
                    <span className="text-gray-500 text-sm pl-2">1 month ago</span>
                  </div>
                </div>
                <button className="replay-button text-[#5357B6] flex items-center font-semibold">
                  <img src="/replay-arrow.svg" alt="icon" className="mr-2" />
                  Replay
                </button>
              </div>
              <div className="person-message">
                <p className="mt-2 text-slate-500 leading-snug">
                  <span className="reply-person text-[#5357B6] font-semibold">@robert</span> Impressive! Though it seems the drag feature could be improved.
                  But overall it looks incredible.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card-footer px-4 absolute bottom-5 left-0 right-0">
          <div className="flex space-x-3">
            <div className="profile-image">
              <img
                className="shadow-lg rounded-full"
                src="/profile-avatar.png"
                alt="User"
              />
            </div>
            <div className="text-area-group w-full relative border border-[#A9A9A9] rounded-lg overflow-hidden flex items-start space-x-3">
              <textarea
                placeholder="Add a comment..."
                style={{
                  width: '100%',
                  padding: '0.5em',
                  resize: 'none',
                  overflow: 'hidden',
                  border: 'none',
                  height: '90px'
                }}
                className="focus:outline-none text-black"
              />
              <button className="rounded-md pt-2 pr-2">
                <img src="/add-comment-arrow.svg" alt="icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <LoadingComponent loading={isLoading || loading} />
    </div>
  );
};

export default TaskView;
