import ProjectView from "@/components/Projects/View";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_layout/projects/$projectId/project_members"
)({
  component: () => (
    <div>
      <ProjectView />
    </div>
  ),
});
