import Projects from "@/components/Projects";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/projects/")({
  component: () => (
    <div>
      <Projects />
    </div>
  ),
});
