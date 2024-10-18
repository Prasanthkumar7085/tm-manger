import Tasks from "@/components/Tasks";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/tasks/")({
  component: () => (
    <div>
      <Tasks />
    </div>
  ),
});
