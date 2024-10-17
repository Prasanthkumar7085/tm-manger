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
              <h6 className="text-sm text-blue-800">MAIN</h6>
              <Link
                to="/users"
                activeProps={{
                  className: "bg-blue-900 text-white  ",
                }}
                activeOptions={{ exact: true }}
              >
                <div
                  className={`relative flex items-center gap-3 px-2 py-1  text-gray-600 ${
                    isActive("/users")
                      ? "bg-blue-100 rounded "
                      : "hover:bg-blue-100 rounded"
                  }`}
                >
                  <div className="flex flex-col">
                    <span>
                      <sub>Users</sub>
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          </ul>

          <Link
            to="/"
            activeProps={{
              className: "font-bold",
            }}
            className="flex justify-start items-center gap-1 font-normal text-lg text-red-500  "
          >
            <Layers strokeWidth={1.1} />
            Logout
          </Link>
        </div>
      </div>
    </ScrollArea>
  );
}
export default SideMenu;
