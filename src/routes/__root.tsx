import * as React from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Providers } from "@/redux/Provider";
import { Toaster } from "sonner";
import { authMiddleware } from "@/lib/helpers/middleware";

export const Route = createRootRoute({
  component: RootComponent,
  beforeLoad: authMiddleware,
});

function RootComponent() {
  return (
    <>
      <Providers>
        <React.Suspense>
          <Outlet />

          {/* <TanStackRouterDevtools position="bottom-right" /> */}
        </React.Suspense>
      </Providers>
      <Toaster richColors closeButton position="top-right" />
    </>
  );
}
