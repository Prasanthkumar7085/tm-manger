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
import { useEffect, useState } from "react";
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
import {
  getAllNotificationsAPI,
  getAllNotificationsCountsAPI,
  markAsReadAllAPI,
  markAsReadAPI,
} from "@/lib/services/notifications";
import { toast } from "sonner";

interface titleProps {
  title: string;
  path: string;
}

function TopBar() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pageIndexParam = Number(searchParams.get("current_page")) || 1;
  const pageSizeParam = Number(searchParams.get("page_size")) || 10;
  const router = useRouter();
  const [viewData, setViewData] = useState<any>();
  const [isNotificationsLoading, setIsNotificationLoading] = useState(false);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [notificationsData, setNotificationsData] = useState<any[]>([]);
  const [notificationCounts, setNotificationCounts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState<any>({
    total_records: 0,
    total_pages: 1,
    page_size: pageSizeParam,
    current_page: pageIndexParam,
  });

  const { taskId } = useParams({ strict: false });
  const pathname = location.pathname;
  const currentNavItem = navBarConstants.find((item: titleProps) =>
    pathname.includes(item.path)
  );
  
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

  const getAllNotifications = async (page = paginationInfo.current_page) => {
    try {
      const response = await getAllNotificationsAPI({
        current_page: page,
        page_size: paginationInfo.page_size,
      });
      if (response?.status === 200 || response?.status === 201) {
        const { records, pagination_info } = response.data.data;
        setNotificationsData((prev: any) => [...(prev || []), ...records]);
        setPaginationInfo(pagination_info);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const getAllNotificationsCount = async () => {
    try {
      const response = await getAllNotificationsCountsAPI();
      if (response?.status === 200 || response?.status === 201) {
        setNotificationCounts(response?.data?.data?.count[0].count);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markAsReadAll = async () => {
    try {
      const response = await markAsReadAllAPI();
      if (response?.status === 200 || response?.status === 201) {
        setNotificationsData((prev = []) =>
          prev.map((notification) => ({
            ...notification,
            is_marked: true,
          }))
        );
        setIsNotificationsOpen(false);
        getAllNotificationsCount();
        toast.success(response?.data?.message);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markAsRead = async (markID: any) => {
    try {
      const response = await markAsReadAPI(markID);
      if (response?.status === 200 || response?.status === 201) {
        // toast.success(response?.data?.message);
        setNotificationsData((prev = []) =>
          prev.map((notification) =>
            notification.id === markID
              ? { ...notification, is_marked: true }
              : notification
          )
        );
        setIsNotificationsOpen(false);
        getAllNotificationsCount();
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleNotificationsScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      event.currentTarget.scrollHeight <=
      event.currentTarget.scrollTop + event.currentTarget.clientHeight + 50;

    if (
      bottom &&
      !isPaginationLoading &&
      paginationInfo.current_page < paginationInfo.total_pages
    ) {
      setIsPaginationLoading(true);
      getAllNotifications(paginationInfo.current_page + 1).finally(() =>
        setIsPaginationLoading(false)
      );
    }
  };

  useEffect(() => {
    getAllNotifications();
    getAllNotificationsCount();
  }, []);

  const handleNavigation = () => {
    navigate({
      to: "/tasks/add",
    });
  };

  const handlePopoverToggle = () => {
    setIsNotificationsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user_type");
    navigate({
      to: `/`,
    });
  };

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
        <Popover
          open={isNotificationsOpen}
          onOpenChange={setIsNotificationsOpen}
        >
          <PopoverTrigger asChild>
            <div
              className="relative cursor-pointer"
              onClick={handlePopoverToggle}
            >
              <Bell className="h-6 w-6" />
              {notificationCounts > 0 && (
                <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center">
                  {notificationCounts || 0}
                </span>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-100 bg-white p-3 shadow-md rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-sm">
                Notifications ({notificationCounts || 0})
              </h3>
              {notificationsData?.length > 0 && notificationCounts > 0 && (
                <button
                  className="text-blue-500 text-xs font-semibold hover:underline"
                  onClick={() => {
                    markAsReadAll();
                  }}
                >
                  Mark All as Read
                </button>
              )}
            </div>
            {isNotificationsLoading ? (
              <p className="text-center">Loading...</p>
            ) : notificationsData?.length > 0 ? (
              <div
                className="flex flex-col rounded-md max-h-[500px] h-[500px] min-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
                onScroll={handleNotificationsScroll}
              >
                <ul>
                  {notificationsData.map((notification: any) => (
                    <li
                      key={notification.id}
                      className="py-2 border-b last:border-none cursor-pointer hover:bg-gray-100 rounded-md"
                      onClick={() => {
                        if (notification.is_marked == false) {
                          markAsRead(notification.id);
                          navigate({
                            to: `/tasks/view/${notification.task_id}`,
                          });
                          setIsNotificationsOpen(false);
                        } else {
                          navigate({
                            to: `/tasks/view/${notification.task_id}`,
                          });
                          setIsNotificationsOpen(false);
                        }
                      }}
                    >
                      <p
                        className={`${notification.is_marked == false ? "font-bold" : "font-normal"}`}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(
                          new Date(notification.created_at),
                          "MMMM dd, yyyy - hh:mm a"
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
                {paginationInfo.current_page < paginationInfo.total_pages && (
                  <div className="text-center text-xs text-gray-500 mt-2">
                    Loading more notifications...
                  </div>
                )}
              </div>
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
