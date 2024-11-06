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
    <div className="flex flex-col space-y-6 md:space-y-6 md:flex-col md:space-x-4  relative">
      <div
        id="task-details"
        className=" w-full bg-white rounded-lg shadow-md  space-y-4 p-4 overflow-y-auto  scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
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
          <h2 className="font-medium text-[#0D0D0D] text-lg">Assigned To</h2>
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
                  src={
                    viewData?.created_profile_pic_url || "/profile-picture.png"
                  }
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
        className="w-full max-h-[600px]  overflow-hidden bg-white rounded-lg shadow-md relative"
      >
        <TaskComments taskId={taskId} />
      </div>
      <LoadingComponent loading={isLoading || loading} />
    </div>
  );
};

export default TaskView;
