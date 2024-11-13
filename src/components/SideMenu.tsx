import {
  Link,
  useLocation,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import dashboardBlackIcon from "@/assets/dashboard-icon-black.svg";
import dashboardWhiteIcon from "@/assets/dash-board-icon.svg";
import tasksBlackIcon from "@/assets/tasks-icon.svg";
import tasksWhiteIcon from "@/assets/task-white.svg";
import usersBlackIcon from "@/assets/users-icon.svg";
import usersWhiteIcon from "@/assets/users-white-icon.svg";
import projectsBlackIcon from "@/assets/projects-icon.svg";
import projectsWhiteIcon from "@/assets/projects-white-icon.svg";
import { useSelector } from "react-redux";
import { useState } from "react";

function SideMenu() {
  const navigate = useNavigate();
  const router = useRouter();
  const { pathname } = useLocation();
  const profileData: any = useSelector(
    (state: any) => state.auth.user.user_details
  );

  const [isNavigating, setIsNavigating] = useState(false);

  const isActive = (href: string) => {
    return pathname.includes(href);
  };

  const handleNavigation = (to: string) => {
    if (isNavigating) return;
    setIsNavigating(true);

    router.navigate({ to });

    setTimeout(() => {
      setIsNavigating(false);
    }, 300);
  };

  return (
    <div className="py-12">
      <div className="flex flex-col justify-between h-full">
        <div>
          <ul className="space-y-3 text-gray-600">
            <li>
              <Link
                onClick={() => handleNavigation("/dashboard")}
                className="no-underline hover:no-underline active:no-underline"
              >
                <div
                  className={`flex items-center gap-3 px-4 py-3 text-gray-600 rounded-2xl ${
                    isActive("/dashboard")
                      ? "bg-[#1B2459] text-white"
                      : "hover:bg-blue-100"
                  }`}
                >
                  <img
                    src={
                      isActive("/dashboard")
                        ? dashboardWhiteIcon
                        : dashboardBlackIcon
                    }
                    alt="dashboard"
                    className="h-[23px] w-[23px]"
                  />
                  <span className="no-underline">Dashboard</span>
                </div>
              </Link>
            </li>
            <li>
              <Link
                onClick={() => handleNavigation("/tasks")}
                className="no-underline hover:no-underline active:no-underline"
              >
                <div
                  className={`flex items-center gap-3 px-4 py-3 text-gray-600 rounded-2xl ${
                    isActive("/tasks")
                      ? "bg-[#1B2459] text-white"
                      : "hover:bg-blue-100"
                  }`}
                >
                  <img
                    src={isActive("/tasks") ? tasksWhiteIcon : tasksBlackIcon}
                    alt="tasks"
                    className="h-[23px] w-[23px]"
                  />
                  <span className="no-underline">Tasks</span>
                </div>
              </Link>
            </li>
            <li>
              <Link
                onClick={() => handleNavigation("/projects")}
                className="no-underline hover:no-underline active:no-underline"
              >
                <div
                  className={`flex items-center gap-3 px-4 py-3 text-gray-600 rounded-2xl ${
                    isActive("/projects")
                      ? "bg-[#1B2459] text-white"
                      : "hover:bg-blue-100"
                  }`}
                >
                  <img
                    src={
                      isActive("/projects")
                        ? projectsWhiteIcon
                        : projectsBlackIcon
                    }
                    alt="projects"
                    className="h-[23px] w-[23px]"
                  />
                  <span className="no-underline">Projects</span>
                </div>
              </Link>
            </li>
            {profileData?.user_type !== "user" && (
              <li>
                <Link
                  onClick={() => handleNavigation("/users")}
                  className="no-underline hover:no-underline active:no-underline"
                >
                  <div
                    className={`flex items-center gap-3 px-4 py-3 text-gray-600 rounded-2xl ${
                      isActive("/users")
                        ? "bg-[#1B2459] text-white"
                        : "hover:bg-blue-100"
                    }`}
                  >
                    <img
                      src={isActive("/users") ? usersWhiteIcon : usersBlackIcon}
                      alt="users"
                      className="h-[23px] w-[23px]"
                    />
                    <span className="no-underline">Users</span>
                  </div>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
