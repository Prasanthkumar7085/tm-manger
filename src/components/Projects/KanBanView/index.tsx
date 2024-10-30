// src/components/KanbanBoard.tsx
import LoadingComponent from "@/components/core/LoadingComponent";
import { Button } from "@/components/ui/button";
import {
  getTasksBasedOnProjectAPI,
  updateProjectTaskStatusAPI,
} from "@/lib/services/projects";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useRouter } from "@tanstack/react-router";
import { set } from "date-fns";
import React, { useState } from "react";
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
  task_description: string;
  task_id: string;
  task_status: string;
  task_title: string;
  title: string;
};

type TaskColumn = {
  [key: string]: Task[];
};

const KanbanBoard: React.FC = () => {
  const { projectId } = useParams({ strict: false });
  const navigate = useNavigate();
  const router = useRouter();

  const [tasks, setTasks] = useState<TaskColumn>({
    TODO: [],
    IN_PROGRESS: [],
    OVER_DUE: [],
    COMPLETED: [],
  });
  const [loading, setLoading] = useState(false);
  const [callProjectTasks, setCallProjectTasks] = useState(0);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;

    const sourceTasks = Array.from(tasks[sourceColumn]);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (sourceColumn === destColumn) {
      sourceTasks.splice(destination.index, 0, movedTask);
      setTasks((prev) => ({
        ...prev,
        [sourceColumn]: sourceTasks,
      }));
    } else {
      const destTasks = Array.from(tasks[destColumn]);
      destTasks.splice(destination.index, 0, movedTask);
      setTasks((prev) => ({
        ...prev,
        [sourceColumn]: sourceTasks,
        [destColumn]: destTasks,
      }));
      updateTaskStatus(destColumn, movedTask);
    }
  };

  const renderColumn = (columnName: string) => (
    <Droppable droppableId={columnName}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="flex flex-col p-4 bg-gray-100 rounded-md"
        >
          <h2 className="text-lg font-bold">{columnName}</h2>
          {tasks[columnName].map((task, index) => (
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
                  className="bg-white border p-2 my-2 rounded shadow w-[250px]"
                  onClick={() => {
                    router.navigate({
                      to: `/tasks/view/${task.task_id}`,
                    });
                  }}
                >
                  <p
                    className="text-ellipsis overflow-hidden"
                    title={task.task_title}
                  >
                    {task.task_title || "--"}
                  </p>
                  <p
                    className="text-gray-500 text-ellipsis overflow-hidden"
                    title={task.task_description}
                  >
                    {task.task_description || "--"}
                  </p>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
          <Button
            onClick={() => {
              router.navigate({
                to: "/tasks/add",
                search: { project_id: projectId, status: columnName },
              });
            }}
          >
            Add Task
          </Button>
        </div>
      )}
    </Droppable>
  );

  const { isFetching, isLoading } = useQuery({
    queryKey: ["getSingleProjectTasks", projectId, callProjectTasks],
    queryFn: async () => {
      try {
        const response = await getTasksBasedOnProjectAPI(projectId);
        if (response.success) {
          const { data } = response.data;
          let categorizedTasks: TaskColumn = {
            TODO: [],
            IN_PROGRESS: [],
            OVER_DUE: [],
            COMPLETED: [],
          };
          data.forEach((task: Task) => {
            if (task.task_status in categorizedTasks) {
              categorizedTasks[task.task_status].push(task);
            }
          });
          setTasks(categorizedTasks);
        } else {
          throw new Error("Failed to fetch project task details");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load project task details.");
      }
    },
    enabled: Boolean(projectId),
  });

  const updateTaskStatus = async (status: string, task: Task) => {
    setLoading(true);
    try {
      const body = {
        status: status,
      };
      const response = await updateProjectTaskStatusAPI(task.task_id, body);
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        setCallProjectTasks((prev) => prev + 1);
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4 relative">
        {["TODO", "IN_PROGRESS", "OVER_DUE", "COMPLETED"].map((column) => (
          <div key={column} className="flex-1">
            {renderColumn(column)}
          </div>
        ))}
      </div>
      <LoadingComponent loading={isFetching || isLoading || loading} />
    </DragDropContext>
  );
};

export default KanbanBoard;
