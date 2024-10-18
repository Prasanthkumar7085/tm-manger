import AddTask from "@/components/Tasks/Add";
import AddUser from "@/components/Tasks/Add";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/tasks/$taskId/update")({
  component: () => (
    <div>
      <AddTask />
    </div>
  ),
});
