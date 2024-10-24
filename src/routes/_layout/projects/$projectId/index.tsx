import AddProject from "@/components/Projects/Add";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/projects/$projectId/")({
  component: () => (
    <div>
      <AddProject />
    </div>
  ),
});
