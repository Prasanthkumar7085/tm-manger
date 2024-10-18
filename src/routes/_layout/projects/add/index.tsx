import AddProject from "@/components/Projects/Add";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/projects/add/")({
  component: () => <AddProject />,
});
