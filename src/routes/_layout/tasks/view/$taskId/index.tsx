import TaskView from "@/components/Tasks/view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/tasks/view/$taskId/")({
  component: () => (
    <div>
      <TaskView />
    </div>
  ),
});
