import AddTask from "@/components/Tasks/Add";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/tasks/add/")({
  component: () => (
    <div>
      <AddTask />
    </div>
  ),
});
