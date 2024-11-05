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
import TaskStatus from "./TaskStatus";
import dayjs from "dayjs";
import {
  bgColorObjectForStatus,
  colorObjectForStatus,
  taskStatusConstants,
} from "@/lib/helpers/statusConstants";
import PriorityStatus from "./PriorityStatus";

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
    <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row md:space-x-4  relative">
      <div
        id="task-details"
        className="md:w-2/3 w-full bg-white rounded-lg shadow-md  space-y-4 p-4 overflow-y-auto overflow-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
        style={{ height: "calc(100vh - 100px)" }}
      >
        <div className="task-prime-details grid grid-cols-2 border-b">
          <div className="relative">
            <div className="flex items-center pb-4">
              <h1
                className="text-2xl text-[#1B2459] font-medium overflow-hidden overflow-ellipsis whitespace-nowrap"
                title={viewData?.title}
              >
                {viewData?.title ? capitalizeWords(viewData?.title) : "--"}
              </h1>
              <span className="capitalize ml-10">
                <PriorityStatus
                  taskId={taskId}
                  setUpdatePriority={setUpdatePriority}
                  selectedPriority={selectedPriority}
                  setSelectedPriority={setSelectedPriority}
                  viewData={viewData}
                />
              </span>
            </div>
            <div className="relative">
              <div
                className="absolute left-0 bottom-full mb-1 hidden group-hover:block bg-gray-700 text-white text-sm rounded px-2 py-1"
                style={{ whiteSpace: "nowrap" }}
              >
                {viewData?.description ? viewData.description : "--"}
              </div>
            </div>

            <div>
              <h5 className="text-[#666666] text-sm font-medium">Project</h5>{" "}
              <p className="font-medium text-md text-[#000000]">
                {viewData?.project_title
                  ? capitalizeWords(viewData?.project_title)
                  : "--"}
              </p>
              <p
                className="font-medium text-[#000000CC] max-h-15 overflow-hidden overflow-ellipsis whitespace-nowrap"
                title={viewData?.description}
              >
                {viewData?.description ? viewData.description : "--"}
              </p>
            </div>
          </div>

          <div>
            <div className="flex justify-end space-x-3">
              <TaskStatus
                taskId={taskId}
                setUpdateDetailsOfTask={setUpdateDetailsOfTask}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
              />
              <Button
                type="button"
                variant="edit"
                size="DefaultButton"
                onClick={() => {
                  router.navigate({
                    to: `/tasks/${taskId}`,
                  });
                }}
              >
                <img src="/edit-icon.svg" alt="icon" className="w-3 h-3 mr-2" />
                Edit Task
              </Button>
            </div>
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
        <div className="flex items-center justify-between w-[60%]">
              <h2 className="font-medium text-[#0D0D0D] text-lg">
                Assigned To
              </h2>
              <div >
                {" "}
                <Button type="button" variant="add" size="DefaultButton" className="text-[#1B2459] border-[#1B2459] flex items-center border bg-white rounded-[10px] hover:bg-white">
                  <span className="text-xl text-[#1B2459] pr-2">+</span>
                  Add User
                </Button>{" "}
              </div>
            </div>
        <div className="task-assignment-details grid grid-cols-[60%,auto] gap-4">
          <div>
            <div className="mt-2">
              <AssignedUsers viewTaskData={viewData} />
            </div>
          </div>
          <div>
            <div className="px-4 py-1">
              <div className="flex items-center space-x-3">
                <img
                  src={viewData?.created_profile_pic}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-[#666666] text-[12px] !mt-0">Created By</p>
                  <p className="text-[#0000000] font-medium text-md !mt-0 py-1 capatitalize">
                    {viewData?.created_name}
                  </p>
                  <p className="text-[#666666] text-sm !mt-0 font-medium">
                    {dayjs(viewData?.created_at).format("MM/DD/YYYY")}
                  </p>
                </div>
              </div>

              {/* Due Date Section */}
              <div className="mt-4">
                <p className="text-[#666666] text-sm font-normal">Due Date</p>
                <div className="inline-block px-3 py-1 mt-1 text-[#FF0021] bg-[#FFE0E480] text-md font-medium rounded-[4px]">
                  {dayjs(viewData?.due_date).format("MM/DD/YYYY")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div></div>
        <div>
          <UploadAttachments />
        </div>
      </div>

      <div
        id="task-comments"
        className="w-full md:w-1/3 bg-white rounded-lg shadow-md relative"
      >
        <div className="card-header flex justify-between px-4 py-2 items-center mb-4">
          <h3 className="text-lg font-semibold">Comments</h3>
          <button className="check-activity-button btn px-5 py-2 bg-[#28A74533] rounded-lg text-[#28A745] font-semibold">
            Check Activity
          </button>
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
                    <span className="text-gray-500 text-sm pl-2">
                      1 month ago
                    </span>
                  </div>
                </div>
                <button className="replay-button text-[#5357B6] flex items-center font-semibold">
                  <img src="/replay-arrow.svg" alt="icon" className="mr-2" />
                  Replay
                </button>
              </div>
              <div className="person-message">
                <p className="mt-2 text-slate-500 leading-snug">
                  Impressive! Though it seems the drag feature could be
                  improved. But overall it looks incredible.
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
                    <span className="text-gray-500 text-sm pl-2">
                      1 month ago
                    </span>
                  </div>
                </div>
                <button className="replay-button text-[#5357B6] flex items-center font-semibold">
                  <img src="/replay-arrow.svg" alt="icon" className="mr-2" />
                  Replay
                </button>
              </div>
              <div className="person-message">
                <p className="mt-2 text-slate-500 leading-snug">
                  <span className="reply-person text-[#5357B6] font-semibold">
                    @robert
                  </span>{" "}
                  Impressive! Though it seems the drag feature could be
                  improved. But overall it looks incredible.
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
                  width: "100%",
                  padding: "0.5em",
                  resize: "none",
                  overflow: "hidden",
                  border: "none",
                  height: "90px",
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
