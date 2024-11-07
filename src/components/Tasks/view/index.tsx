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
    <div className="relative overflow-auto">
      <div
        id="task-details"
        className=" w-full h-full bg-white rounded-lg shadow-md p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
      >

        <div className="task-primary-details">
          <div className="grid grid-cols-1 lg:grid-cols-[70%,auto] gap-5">
            <div className="leftItem">
              <div>
                <h1
                  className="text-xl text-[#1B2459] font-medium overflow-hidden overflow-ellipsis whitespace-nowrap mb-1"
                  title={viewData?.title}
                >
                  {viewData?.title ? capitalizeWords(viewData?.title) : "--"}
                </h1>

                <div className="description mt-3 border p-2 rounded-sm mb-3">
                  <p
                    className="text-black  text-[.85rem] rounded-md overflow-hidden line-clamp-2"
                    title={viewData?.description}
                  >
                    {viewData?.description ? viewData.description : "--"}
                  </p>

                </div>
              </div>
              <AssignedUsers viewTaskData={viewData} />
              <hr className="my-3" />
              <TaskComments taskId={taskId} />
            </div>
            <div className="rightItem">
              <div className="action-buttons flex space-x-3">
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
              <div className="focus-details border">
                <div className="card-header border-b px-4 py-0 bg-gray-50">
                  <h3 className="leading-1 text-black  text-[1.1em]">Details</h3>
                </div>
                <div className="card-body py-3 px-4">
                  <ul className="space-y-3">
                    <li className="grid grid-cols-[150px,auto]">
                      <p className="text-[#666666] text-sm font-medium mb-1">Project</p>
                      <p className="mt-0 text-black font-medium">{viewData?.project_title
                        ? capitalizeWords(viewData?.project_title)
                        : "--"}</p>
                    </li>
                    <li className="grid grid-cols-[150px,auto]">
                      <p className="text-[#666666] text-sm font-medium mb-1">Priority</p>
                      <PriorityStatus
                        taskId={taskId}
                        setUpdatePriority={setUpdatePriority}
                        selectedPriority={selectedPriority}
                        setSelectedPriority={setSelectedPriority}
                        viewData={viewData}
                      />
                    </li>
                    <li className="grid grid-cols-[150px,auto]">
                      <p className="text-[#666666] text-sm font-medium mb-1">Due Date</p>
                      <div className="inline-block px-3 py-[1px] border text-[#FF0021] bg-[#FFE0E480] text-md font-semibold rounded-sm">
                        {dayjs(viewData?.due_date).format("MM/DD/YYYY")}
                      </div>
                    </li>
                    <li className="grid grid-cols-[150px,auto]">
                      <div>
                        <p className="text-[#666666] text-sm font-medium mb-1">Created Date</p>
                      </div>
                      <div>
                        <p className="text-black font-medium">
                          {dayjs(viewData?.created_at).format("MM/DD/YYYY")}
                        </p>
                      </div>
                    </li>
                    <li className="grid grid-cols-[150px,auto]">
                      <div>
                        <p className="text-[#666666] text-sm font-medium mb-1">Created By</p>
                      </div>
                      <div>
                        <div className="created-person flex items-center space-x-3">
                          <img
                            src={
                              viewData?.created_profile_pic_url || "/profile-picture.png"
                            }
                            alt="User"
                            className="object-contain w-6 h-6 rounded-full border"
                          />
                          <p className="font-medium text-black  text-md capitalize">
                            {viewData?.created_name}
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

              </div>
              <UploadAttachments />
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
        </div>
      </div>
      <LoadingComponent loading={isLoading || loading} />
    </div>
  );
};

export default TaskView;
