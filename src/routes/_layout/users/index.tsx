import UsersTable from "@/components/Users";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/users/")({
  component: () => (
    <div>
      <UsersTable />
    </div>
  ),
});
