import * as React from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Toaster } from "sonner";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <React.Suspense>
        <Outlet />
      </React.Suspense>
      <Toaster richColors closeButton position="top-center" />
    </>
  );
}
