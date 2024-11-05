import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import dashboardBlackIcon from "@/assets/dashboard-icon-black.svg";
import dashboardWhiteIcon from "@/assets/dash-board-icon.svg";
import tasksBlackIcon from "@/assets/tasks-icon.svg";
import tasksWhiteIcon from "@/assets/task-white.svg";
import usersBlackIcon from "@/assets/users-icon.svg";
import usersWhiteIcon from "@/assets/users-white-icon.svg";
import projectsBlackIcon from "@/assets/projects-icon.svg";
import projectsWhiteIcon from "@/assets/projects-white-icon.svg";
import { useSelector } from "react-redux";
function SideMenu() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const profileData: any = useSelector(
    (state: any) => state.auth.user.user_details
  );
  console.log(profileData, "profile");

  const isActive = (href: string) => {
    return pathname.includes(href);
  };

  return (
    <div className="py-12">
      <div className="flex flex-col justify-between h-full">
        <div>
          <ul className="space-y-3 text-gray-600">
            <li>
              <Link to="/dashboard">
                <div
                  className={`flex items-center gap-3 px-4 py-2 text-gray-600 rounded-md ${
                    isActive("/dashboard")
                      ? "bg-blue-900 text-white"
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
                  <span>Dashboard</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/tasks">
                <div
                  className={`flex items-center gap-3 px-4 py-2 text-gray-600 rounded-md ${
                    isActive("/tasks")
                      ? "bg-blue-900 text-white"
                      : "hover:bg-blue-100"
                  }`}
                >
                  <img
                    src={isActive("/tasks") ? tasksWhiteIcon : tasksBlackIcon}
                    alt="dashboard"
                    className="h-[23px] w-[23px]"
                  />
                  <span>Tasks</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/projects">
                <div
                  className={`flex items-center gap-3 px-4 py-2 text-gray-600 rounded-md ${
                    isActive("/projects")
                      ? "bg-blue-900 text-white"
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
                  <span>Projects</span>
                </div>
              </Link>
            </li>
            <li>
              {profileData?.user_type === "admin" && (
                <Link to="/users">
                  <div
                    className={`flex items-center gap-3 px-4 py-2 text-gray-600 rounded-md ${
                      isActive("/users")
                        ? "bg-blue-900 text-white"
                        : "hover:bg-blue-100"
                    }`}
                  >
                    <img
                      src={isActive("/users") ? usersWhiteIcon : usersBlackIcon}
                      alt="dashboard"
                      className="h-[23px] w-[23px]"
                    />
                    <span>Users</span>
                  </div>
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
