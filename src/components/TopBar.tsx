import downArrowIcon from "@/assets/down-arrow.svg";
import { navBarConstants } from "@/lib/helpers/navBarConstants";
import { getSingleUserApi } from "@/lib/services/viewprofile";
import { useQuery } from "@tanstack/react-query";
import {
  useLocation,
  useNavigate,
  useParams,
  useRouter,
} from "@tanstack/react-router";
import Cookies from "js-cookie";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Bell } from "lucide-react";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";

interface titleProps {
  title: string;
  path: string;
}

function TopBar() {
  const location = useLocation();
  const router = useRouter();
  const [viewData, setViewData] = useState<any>();
  const { taskId } = useParams({ strict: false });
  const pathname = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const currentNavItem = navBarConstants.find((item: titleProps) =>
    pathname.includes(item.path)
  );
  const [archiveTasks, setArchiveTasks] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const userID = useSelector(
    (state: any) => state.auth?.user?.user_details?.id
  );
  const refernceId: any = useSelector((state: any) => state.auth.refId);

  const capitalize = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1);
  const getFullName = (user: any) => {
    return `${capitalize(user.fname)} ${capitalize(user.lname)}`;
  };

  const title = currentNavItem ? currentNavItem.title : null;
  const navigate = useNavigate({ from: "/" });

  const { isLoading, isError, error } = useQuery({
    queryKey: ["getSingleTask", userID],
    queryFn: async () => {
      const response = await getSingleUserApi(userID);
      const taskData = response?.data?.data;

      try {
        if (response?.status === 200 || response?.status === 201) {
          setViewData(taskData);
        }
      } catch (err: any) {
        throw err;
      }
    },
    enabled: Boolean(userID),
  });

  const handleNavigation = () => {
    navigate({
      to: "/tasks/add",
    });
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user_type");
    navigate({
      to: `/`,
    });
  };

  const notifications = [
    {
      id: 1,
      message: "Task #123 has been assigned to you.",
      timestamp: new Date("2024-11-22T09:00:00"),
    },
    {
      id: 2,
      message: "Project 'Website Redesign' is due tomorrow.",
      timestamp: new Date("2024-11-21T14:00:00"),
    },
    {
      id: 3,
      message: "Your profile information was updated successfully.",
      timestamp: new Date("2024-11-20T16:30:00"),
    },
    {
      id: 4,
      message: "A new comment was added to Task #456.",
      timestamp: new Date("2024-11-22T08:45:00"),
    },
    {
      id: 5,
      message: "Meeting scheduled for 3:00 PM today.",
      timestamp: new Date("2024-11-22T15:00:00"),
    },
  ];
  const totalNotifications = notifications.length;

  return (
    <div className="py-3 px-5 flex justify-between items-center bg-white border-b">
      <span className="ml-2 text-lg font-semibold flex">
        {pathname.includes("/tasks/view/") && taskId
          ? `${title} - ${refernceId}`
          : title}
      </span>

      <div className="flex items-center gap-2">
        {pathname == "/tasks" && !taskId && (
          <div className="flex gap-2">
            <Button
              className="font-normal text-sm"
              variant="add"
              size="DefaultButton"
              onClick={handleNavigation}
            >
              <span className="text-xl font-normal pr-2 text-md">+</span>
              Add Task
            </Button>
          </div>
        )}
        {/* <Popover>
          <PopoverTrigger
            asChild
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <div className="relative cursor-pointer">
              <Bell className="h-6 w-6" />
              {totalNotifications > 0 && (
                <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center">
                  {totalNotifications}
                </span>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-64 bg-white p-3 shadow-md rounded-md">
            <h3 className="font-semibold text-sm mb-2">
              Notifications ({totalNotifications})
            </h3>
            {notifications.length > 0 ? (
              <>
                <ul className="text-sm max-h-48 overflow-y-auto">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className="py-2 border-b last:border-none cursor-pointer hover:bg-gray-100 rounded-md"
                    >
                      {notification.message}
                    </li>
                  ))}
                </ul>
                <div className="mt-2 text-center">
                  <button
                    className="text-blue-500 text-sm font-semibold hover:underline"
                    // onClick={() => navigate("/notifications")}
                  >
                    View All Notifications
                  </button>
                </div>
              </>
            ) : (
              <p>No notifications available</p>
            )}
          </PopoverContent>
        </Popover> */}
        <Popover>
          <PopoverTrigger
            asChild
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <div className="relative cursor-pointer">
              <Bell className="h-6 w-6" />
              {totalNotifications > 0 && (
                <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center">
                  {totalNotifications}
                </span>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-100 bg-white p-3 shadow-md rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-sm">
                Notifications ({totalNotifications})
              </h3>
              <button
                className="text-blue-500 text-xs font-semibold hover:underline"
                onClick={() => {
                  // Function to mark all as read
                }}
              >
                Mark All as Read
              </button>
            </div>
            {notifications.length > 0 ? (
              <>
                <ul className="text-sm max-h-48 overflow-y-auto">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className="py-2 border-b last:border-none cursor-pointer hover:bg-gray-100 rounded-md"
                    >
                      <p>{notification.message}</p>
                      <p className="text-xs text-gray-500">
                        {format(
                          notification.timestamp,
                          "MMMM dd, yyyy - hh:mm a"
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 text-center">
                  <button
                    className="text-blue-500 text-sm font-semibold hover:underline"
                    // onClick={() => navigate("/notifications")}
                  >
                    View All Notifications
                  </button>
                </div>
              </>
            ) : (
              <p>No notifications available</p>
            )}
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex gap-2 items-center hover:cursor-pointer">
            <Avatar>
              <AvatarImage
                src={viewData?.profile_pic || "/profile-picture.png"}
                alt="User avatar"
              />
              <AvatarFallback>
                {viewData?.fname?.charAt(0) || ""}
                {viewData?.lname?.charAt(0) || ""}
              </AvatarFallback>
            </Avatar>
            <span>{viewData ? getFullName(viewData) : "Loading..."}</span>
            <img
              src={downArrowIcon}
              alt="dashboard"
              className="h-[13px] w-[13px]"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                navigate({
                  to: `/view-profile`,
                });
              }}
            >
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default TopBar;
