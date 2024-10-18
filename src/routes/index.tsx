import LoginComponent from "@/components/auth/Login";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => (
    <div>
      <LoginComponent />
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </div>
  ),
});
