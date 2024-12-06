import LoadingComponent from "@/components/core/LoadingComponent";
import { Button } from "@/components/ui/button";
import { capitalizeWords } from "@/lib/helpers/CapitalizeWords";
import { taskStatusConstants } from "@/lib/helpers/statusConstants";
import {
  getActivityLogsAPI,
  getAssignesAPI,
  getSingleTaskAPI,
} from "@/lib/services/tasks";
import { setRefId } from "@/redux/Modules/userlogin";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useRouter } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import TagsComponent from "../Add/TagsComponent";
import AssignedUsers from "../AssigneTasks";
import UploadAttachments from "./Attachments";
import PriorityStatus from "./PriorityStatus";
import TaskStatus from "./TaskStatus";
import TaskComments from "./Comments";
// import { ActivityDrawer } from "./ActivityDrawer";
import { isMananger } from "@/lib/helpers/loginHelpers";
import { momentWithTimezone } from "@/lib/helpers/timeZone";
import { ActivityDrawer } from "./ActivityDrawer";
import { SubTasks } from "../subtasks";

const TaskView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const router = useRouter();
  const { taskId } = useParams({ strict: false });
  const [loading, setLoading] = useState(false);
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

  const [openReplies, setOpenReplies] = useState<any>({
    commentId: null,
    open: false,
  });
  const [selectedPriority, setSelectedPriority] = useState<any>();
  const [activityOpen, setActivityOpen] = useState(false);
  const [activityLogData, setActivityLogData] = useState<any>();

  const { isLoading, isError, error } = useQuery({
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

  const {
    isFetching,
    isLoading: isLoadingAssignes,
    data: assignedUsers,
  } = useQuery({
    queryKey: ["getAssignes", taskId],
    queryFn: async () => {
      try {
        const response = await getAssignesAPI(taskId);
        if (response.status === 200 || response?.status === 201) {
          const data = response.data?.data;
          return data || [];
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error?.message || "Something went wrong");
      }
    },
    enabled: Boolean(taskId),
  });

  const { data } = useQuery({
    queryKey: ["getActivityLogs", taskId, activityOpen],
    queryFn: async () => {
      const response = await getActivityLogsAPI(taskId);
      const taskData = response?.data?.data;

      try {
        if (response?.status === 200 || response?.status === 201) {
          setActivityLogData(taskData);
        } else {
          throw new Error("Failed to fetch Activity");
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

  const onActivityClick = () => {
    setActivityOpen(true);
  };

  return (
    <div className="relative overflow-y-auto">
      <div
        id="task-details"
        className=" w-full h-full bg-white rounded-lg shadow-md p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
        style={{ height: "calc(100vh - 100px)" }}
      >
        <div className="task-primary-details">
          <div className="heading-row flex justify-between items-center mb-3">
            <div>
              <h1
                className="text-xl text-[#1B2459] font-medium overflow-hidden overflow-ellipsis whitespace-nowrap mb-1"
                title={viewData?.title}
              >
                {viewData?.title ? capitalizeWords(viewData?.title) : "--"}
              </h1>
              <div className="description">
                <p
                  className="text-black  text-[.85rem] rounded-md  whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[800px]"
                  title={viewData?.description}
                >
                  {viewData?.description ? viewData.description : "--"}
                </p>
              </div>
            </div>
            <div></div>

            <div className="action-buttons flex space-x-2">
              <TaskStatus
                taskId={taskId}
                setUpdateDetailsOfTask={setUpdateDetailsOfTask}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                assignedUsers={assignedUsers}
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
                <img
                  src="/edit-icon.svg"
                  alt="icon"
                  className="w-3 h-3 mr-2 text-[10px]"
                />
                Edit Task
              </Button>
              <button
                className="check-activity-button btn px-3 text-[12px] bg-[#28A74533] rounded-lg text-[#28A745] font-medium h-[35px] leading-[15px] "
                onClick={onActivityClick}
              >
                Check Activity
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[70%,auto] gap-5">
            <div className="leftItem">
              <UploadAttachments />
              {viewData?.sub_task === false ? (
                <SubTasks viewData={viewData} />
              ) : (
                ""
              )}

              <hr className="my-3" />
              <TaskComments taskId={taskId} />
            </div>
            <div
              className={`rightItem transition-transform duration-300 ${
                openReplies.open ? "translate-x-full" : "translate-x-0"
              }`}
            >
              <div className="focus-details border">
                <div className="card-header border-b px-4 py-0 bg-gray-50">
                  <h3 className="leading-1 text-black  text-[1.1em]">
                    Details
                  </h3>
                </div>
                <div className="card-body py-3 px-4">
                  <ul className="space-y-3">
                    <li className="grid grid-cols-[150px,auto]">
                      <p className="text-[#666666] text-sm font-medium mb-1">
                        Project
                      </p>
                      <p className="mt-0 text-black font-medium flex items-center">
                        <img
                          src={`${import.meta.env.VITE_IMAGE_URL}/${viewData?.project_logo}`}
                          alt={` logo`}
                          // onError={(e: any) => {
                          //   e.target.onerror = null;
                          //   e.target.src =
                          //     "https://via.placeholder.com/150?text=No preview";
                          // }}
                          onError={(e: any) => {
                            e.target.onerror = null;
                            e.target.src = "/favicon.png";
                          }}
                          className="mr-2 h-6 w-6 rounded-full object-cover"
                        />
                        {viewData?.project_title
                          ? capitalizeWords(viewData?.project_title)
                          : "--"}
                      </p>
                    </li>
                    <li className="grid grid-cols-[150px,auto]">
                      <p className="text-[#666666] text-sm font-medium mb-1">
                        Priority
                      </p>
                      <PriorityStatus
                        taskId={taskId}
                        setUpdatePriority={setUpdatePriority}
                        selectedPriority={selectedPriority}
                        setSelectedPriority={setSelectedPriority}
                        viewData={viewData}
                        assignedUsers={assignedUsers}
                      />
                    </li>
                    <li className="grid grid-cols-[150px,auto]">
                      <p className="text-[#666666] text-sm font-medium mb-1">
                        Due Date
                      </p>
                      <div className="inline-block  text-[#FF0021] text-md font-semibold rounded-sm">
                        {momentWithTimezone(viewData?.due_date, "MM/DD/YYYY")}
                      </div>
                    </li>
                    <li className="grid grid-cols-[150px,auto]">
                      <div>
                        <p className="text-[#666666] text-sm font-medium mb-1">
                          Created Date
                        </p>
                      </div>
                      <div>
                        <p className="text-black font-medium">
                          {momentWithTimezone(
                            viewData?.created_at,
                            "MM/DD/YYYY"
                          )}
                        </p>
                      </div>
                    </li>
                    <li className="grid grid-cols-[150px,auto]">
                      <div>
                        <p className="text-[#666666] text-sm font-medium mb-1">
                          Created By
                        </p>
                      </div>
                      <div>
                        <div className="created-person flex items-center space-x-3">
                          <img
                            src={
                              `${import.meta.env.VITE_IMAGE_URL}/${viewData?.created_profile_pic}` ||
                              "/profile-picture.png"
                            }
                            onError={(e: any) => {
                              e.target.onerror = null;
                              e.target.src = "/profile-picture.png";
                            }}
                            alt="User"
                            className="object-contain w-6 h-6 rounded-full border"
                          />
                          <p className="font-medium text-black !ml-2  text-md capitalize">
                            {viewData?.created_name}
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <AssignedUsers viewTaskData={viewData} />

              <TagsComponent errorMessages={errorMessages} />
              {setActivityOpen && (
                <ActivityDrawer
                  setActivityOpen={setActivityOpen}
                  activityOpen={activityOpen}
                  id={taskId}
                  activityLogData={activityLogData}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <LoadingComponent loading={isLoading || loading} /> */}
    </div>
  );
};

export default TaskView;
