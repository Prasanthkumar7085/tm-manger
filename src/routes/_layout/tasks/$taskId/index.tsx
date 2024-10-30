import AddTask from "@/components/Tasks/Add";
import TaskView from "@/components/Tasks/view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/tasks/$taskId/")({
  component: () => (
    <div className="overflow-auto">
      <AddTask />
    </div>
  ),
});
