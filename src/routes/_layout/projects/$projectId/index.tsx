import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/projects/$projectId/")({
  component: () => <div>Hello /_layout/projects/$projectId/!</div>,
});
