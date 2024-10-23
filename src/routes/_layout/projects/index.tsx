import Projects from "@/components/Projects";
import ProjectMembers from "@/components/Projects/Members/GetAllMembers";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/projects/")({
  component: () => (
    <div>
      <Projects />
      {/* <ProjectMembers /> */}
    </div>
  ),
});
