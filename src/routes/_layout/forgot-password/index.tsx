import ForgotComponent from "@/components/auth/Forgot";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/forgot-password/")({
  component: () => (
    <div>
      <ForgotComponent />
    </div>
  ),
});
