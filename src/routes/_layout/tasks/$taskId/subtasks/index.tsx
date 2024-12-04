import { SubTasks } from "@/components/Tasks/subtasks";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/tasks/$taskId/subtasks/")({
  component: () => (
    <div>
      <SubTasks />
    </div>
  ),
});
