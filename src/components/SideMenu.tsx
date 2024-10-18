import { Link, useLocation, useNavigate } from "@tanstack/react-router";

function SideMenu() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (href: string) => {
    return pathname.includes(href);
  };

  return (
    <div className="h-screen  py-10">
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
                        ? "src/assets/dash-board-icon.svg"
                        : "src/assets/dashboard-icon-black.svg"
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
                    src={
                      isActive("/tasks")
                        ? "src/assets/task-white.svg"
                        : "src/assets/tasks-icon.svg"
                    }
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
                    src={"src/assets/dashboard-icon-black.svg"}
                    alt="dashboard"
                    className="h-[23px] w-[23px]"
                  />
                  <span className="text-[16px] text-[#5f637d]">Projects</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/users">
                <div
                  className={`flex items-center gap-3 px-4 py-2 text-gray-600 rounded-md ${
                    isActive("/users")
                      ? "bg-blue-900 text-white"
                      : "hover:bg-blue-100"
                  }`}
                >
                  <img
                    src={"src/assets/dashboard-icon-black.svg"}
                    alt="dashboard"
                    className="h-[23px] w-[23px]"
                  />
                  <span className="text-[16px] text-[#5f637d]">Users</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
