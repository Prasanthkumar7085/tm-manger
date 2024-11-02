import ProjectMembersManagment from "@/components/Projects/View/ProjectMembersManagment";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_layout/projects/$projectId/project_members"
)({
  component: () => (
    <div>
      <ProjectMembersManagment />
    </div>
  ),
});
