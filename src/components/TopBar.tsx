import { navBarConstants } from "@/lib/helpers/navBarConstants";
import {
  useLocation,
  useNavigate,
  useParams,
  useRouter,
} from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import downArrowIcon from "@/assets/down-arrow.svg";
import { useSelector } from "react-redux";
import { getSingleTaskAPI } from "@/lib/services/tasks";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getSingleUserApi } from "@/lib/services/viewprofile";
import { Button } from "./ui/button";
import Cookies from "js-cookie";

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

  const intialisArchived = searchParams.get("isArchived") || "";

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
            {/* <Button
              className="font-normal text-sm"
              variant="add"
              size="DefaultButton"
              onClick={() => {
                setArchiveTasks(!archiveTasks);
                let queryParams = {
                  ...location.search,
                  isArchived: archiveTasks,
                };
                router.navigate({
                  to: "/tasks",
                  search: queryParams,
                });
              }}
            >
              Archive Tasks
            </Button> */}
          </div>
        )}
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
