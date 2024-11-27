import {
  AnyContext,
  BeforeLoadContextOptions,
  redirect,
} from "@tanstack/react-router";
import Cookies from "js-cookie";
const getIsAuthenticated = () => {
  return Cookies.get("token");
};
const getUserType = () => {
  return Cookies.get("user_type");
};
const authRoutes = ["/","/forgot-password", "/auth/reset-password"];

export const authMiddleware = ({
  location,
}: BeforeLoadContextOptions<any, undefined, {}, {}, AnyContext>) => {
  if (!getIsAuthenticated() && !authRoutes.includes(location.pathname)) {
    throw redirect({
      to: "/",
    });
  }
  if (getIsAuthenticated() && authRoutes.includes(location.pathname)) {
    if (getUserType() == "admin") {
      throw redirect({
        // to: "/dashboard",
      });
    }
    throw redirect({
      // to: "/dashboard",
    });
  }
};
