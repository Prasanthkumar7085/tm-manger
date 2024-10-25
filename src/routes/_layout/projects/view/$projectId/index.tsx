import ProjectView from "@/components/Projects/View";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/projects/view/$projectId/")({
  component: () => (
    <div>
      <ProjectView />
    </div>
  ),
});
