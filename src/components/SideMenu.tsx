import { cn } from "@/lib/utils";
import { useLocation } from "@tanstack/react-router";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronRight,
  CircleArrowRight,
  Layers,
  LayoutDashboard,
  Scale,
} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
function SideMenu() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (href: string) => {
    return pathname.includes(href);
  };
  return (
    <ScrollArea className="h-[calc(100vh-5rem)]">
      <div className="mx-4 my-8 text-black text-md flex ">
        <div>
          <ul className="space-y-1 text-gray-600 mt-3">
            <li>
              <Link
                to="/dashboard"
                activeProps={{
                  className: "bg-blue-900 text-white  ",
                }}
                activeOptions={{ exact: true }}
              >
                <div
                  className={`relative flex items-center gap-3 px-2 py-1  text-gray-600 ${
                    isActive("/dashboard")
                      ? "bg-blue-100 rounded "
                      : "hover:bg-blue-100 rounded"
                  }`}
                >
                  <div className="flex flex-col">
                    <span>DashBoard</span>
                  </div>
                </div>
              </Link>
              <Link
                to="/tasks"
                activeProps={{
                  className: "bg-blue-900 text-white  ",
                }}
                activeOptions={{ exact: true }}
              >
                <div
                  className={`relative flex items-center gap-3 px-2 py-1  text-pink-600 ${
                    isActive("/tasks")
                      ? "bg-blue-100 rounded "
                      : "hover:bg-blue-100 rounded"
                  }`}
                >
                  <div className="flex flex-col">
                    <span>Tasks</span>
                  </div>
                </div>
              </Link>
              <Link
                to="/projects"
                activeProps={{
                  className: "bg-blue-900 text-white  ",
                }}
                activeOptions={{ exact: true }}
              >
                <div
                  className={`relative flex items-center gap-3 px-2 py-1  text-pink-600 ${
                    isActive("/projects")
                      ? "bg-blue-100 rounded "
                      : "hover:bg-blue-100 rounded"
                  }`}
                >
                  <div className="flex flex-col">
                    <span>Projects</span>
                  </div>
                </div>
              </Link>
              <Link
                to="/users"
                activeProps={{
                  className: "bg-blue-900 text-white  ",
                }}
                activeOptions={{ exact: true }}
              >
                <div
                  className={`relative flex items-center gap-3 px-2 py-1  text-pink-600 ${
                    isActive("/users")
                      ? "bg-blue-100 rounded "
                      : "hover:bg-blue-100 rounded"
                  }`}
                >
                  <div className="flex flex-col">
                    <span>Users</span>
                  </div>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </ScrollArea>
  );
}
export default SideMenu;
