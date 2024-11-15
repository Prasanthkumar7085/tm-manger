import LoadingComponent from "@/components/core/LoadingComponent";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getColorFromInitials } from "@/lib/constants/colorConstants";
import { taskStatusConstants } from "@/lib/helpers/statusConstants";
import {
  getTasksBasedOnProjectAPI,
  updateProjectTaskStatusAPI,
} from "@/lib/services/projects";
import { useParams, useRouter } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { toast } from "sonner";

type Task = {
  assignees: any[];
  created_at: string;
  description: string;
  id: number;
  task_id: string;
  status: string;
  title: string;
};

type TaskColumn = {
  [key: string]: Task[];
};

const KanbanBoard: React.FC<any> = ({
  projectDetails,
  setProjetStatsUpdate,
}: any) => {
  const { projectId } = useParams({ strict: false });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [callProjectTasks, setCallProjectTasks] = useState(0);
  const [pagination, setPagination] = useState<any>({
    TODO: {},
    IN_PROGRESS: {},
    OVER_DUE: {},
    COMPLETED: {},
  });
  const [tasks, setTasks] = useState<TaskColumn>({
    TODO: [],
    IN_PROGRESS: [],
    OVER_DUE: [],
    COMPLETED: [],
  });

  const [isFetching, setIsFetching] = useState<any>({
    TODO: false,
    IN_PROGRESS: false,
    OVER_DUE: false,
    COMPLETED: false,
  });

  const [page, setPage] = useState<any>({
    TODO: 1,
    IN_PROGRESS: 1,
    OVER_DUE: 1,
    COMPLETED: 1,
  });

  const fetchTasks = async (status: string, page: number) => {
    try {
      setIsFetching((prev: any) => ({ ...prev, [status]: true }));
      const response = await getTasksBasedOnProjectAPI(projectId, {
        page: page,
        page_size: 10,
        status,
        order_by: "created_at:asc",
      });

      let data = response?.data?.data;
      if (response.data.status === 200) {
        const newTasks = data.records;
        setPagination((prev: any) => ({
          ...prev,
          [status]: data.pagination,
        }));
        setTasks((prev) => ({
          ...prev,
          [status]: [
            ...prev[status],
            ...newTasks.filter(
              (task: Task) =>
                !prev[status].some(
                  (existingTask) => existingTask.task_id === task.task_id
                )
            ),
          ],
        }));
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsFetching((prev: any) => ({ ...prev, [status]: false }));
    }
  };

  useEffect(() => {
    ["TODO", "IN_PROGRESS", "OVER_DUE", "COMPLETED"].forEach((status) => {
      fetchTasks(status, page[status]);
    });
  }, [projectId]);

  const handleScroll = (
    status: string,
    event: React.UIEvent<HTMLDivElement>
  ) => {
    const bottom =
      event.currentTarget.scrollHeight <=
      event.currentTarget.scrollTop + event.currentTarget.clientHeight + 50;

    if (
      bottom &&
      !isFetching[status] &&
      pagination[status]?.totalPages > page[status]
    ) {
      setPage((prev: any) => {
        const nextPage = prev[status] + 1;
        fetchTasks(status, nextPage);
        return { ...prev, [status]: nextPage };
      });
    }
  };

  const updateTaskStatus = async (task: Task, status: string) => {
    setLoading(true);
    try {
      const body = {
        status: status,
      };
      const response = await updateProjectTaskStatusAPI(task.task_id, body);
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        setCallProjectTasks((prev) => prev + 1);
        setProjetStatsUpdate((prev: any) => prev + 1);
      } else {
        toast.error("Failed to change status");
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const draggedTask = tasks[source.droppableId][source.index];
    const newStatus = destination.droppableId;

    if (!projectDetails?.active) {
      toast.error(
        "You cannot change the status of this task because the project is not active."
      );
      return;
    }

    const updatedTasks = { ...tasks };
    updatedTasks[source.droppableId].splice(source.index, 1);
    updatedTasks[destination.droppableId].splice(
      destination.index,
      0,
      draggedTask
    );

    try {
      await updateTaskStatus(draggedTask, newStatus);
      toast.success("Task status updated successfully.");
      setTasks(updatedTasks);
    } catch (error) {
      toast.error("Failed to update task status.");
      setTasks((prev) => ({ ...prev }));
    }
  };

  const renderColumn = (columnName: string) => (
    <Droppable droppableId={columnName}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="flex flex-col rounded-md max-h-[500px] h-[500px] min-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
          onScroll={(e) => handleScroll(columnName, e)}
        >
          <h2 className="bg-gray-100 px-4 h-[40px] leading-10 rounded-xl font-semibold text-[14px] sticky top-0 z-10">
            {
              taskStatusConstants.find((item: any) => item.value == columnName)
                ?.label
            }
          </h2>

          {tasks[columnName].map((task: any, index: number) => (
            <Draggable
              key={task.task_id}
              draggableId={String(task.task_id)}
              index={index}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="bg-[#EFF5FF] p-4 my-2 rounded-xl cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() =>
                    router.navigate({ to: `/tasks/view/${task.task_id}` })
                  }
                >
                  <p
                    className="text-ellipsis overflow-hidden font-medium text-md capitalize text-[#000000]"
                    title={task.task_title}
                  >
                    {task.task_title || "--"}
                  </p>
                  <p
                    className="font-medium text-sm text-gray-600 max-h-15 max-w-[250px] overflow-hidden overflow-ellipsis whitespace-nowrap"
                    title={task?.task_description}
                  >
                    {task?.task_description || "--"}
                  </p>
                  <div className="flex justify-start mt-3 -space-x-3">
                    {task?.assignees?.slice(0, 5).map((assignee: any) => {
                      const initials =
                        assignee.user_first_name[0]?.toUpperCase() +
                        assignee.user_last_name[0]?.toUpperCase();
                      const backgroundColor = getColorFromInitials(initials);

                      return (
                        <Avatar
                          key={assignee.user_id}
                          title={`${assignee.user_first_name} ${assignee.user_last_name}`}
                          className={`w-8 h-8  capitalize ${backgroundColor}`}
                        >
                          <AvatarImage
                            src={assignee.user_profile_pic}
                            alt={assignee.user_first_name}
                          />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                      );
                    })}
                    {task?.assignees?.length > 5 && (
                      <div className="flex items-center justify-center w-8 h-8 border-2 border-white rounded-full bg-gray-200 text-xs font-semibold">
                        +{task.assignees.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
          <Button
            disabled={!projectDetails?.active}
            title="Add Task"
            className="bg-transparent border-dashed border rounded-xl bg-white !border-[#5A5A5A] text-black text-md mt-2 hover:bg-transparent sticky bottom-0 z-10"
            onClick={() => {
              router.navigate({
                to: "/tasks/add",
                search: { project_id: projectId, status: columnName },
              });
            }}
          >
            <span className="relative right-[5px]">+</span> Add New Task
          </Button>
        </div>
      )}
    </Droppable>
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex space-x-4 relative">
        {["TODO", "IN_PROGRESS", "OVER_DUE", "COMPLETED"].map((column) => (
          <div key={column} className="flex-1">
            {renderColumn(column)}
          </div>
        ))}
      </div>
      <LoadingComponent
        loading={
          isFetching.TODO ||
          isFetching.IN_PROGRESS ||
          isFetching.OVER_DUE ||
          isFetching.COMPLETED
        }
      />
    </DragDropContext>
  );
};

export default KanbanBoard;
