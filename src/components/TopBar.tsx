import { navBarConstants } from "@/lib/helpers/navBarConstants";
import { useLocation, useNavigate, useParams } from "@tanstack/react-router";
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

interface titleProps {
  title: string;
  path: string;
}

function TopBar() {
  const [viewData, setViewData] = useState<any>();
  const location = useLocation();
  const pathname = location.pathname;
  const currentNavItem = navBarConstants.find((item: titleProps) =>
    pathname.includes(item.path)
  );
  const searchParams = new URLSearchParams(location.search);

  const refernceId: any = useSelector((state: any) => state.auth.refId);

  const { taskId } = useParams({ strict: false });
  const title = currentNavItem ? currentNavItem.title : null;
  const navigate = useNavigate({ from: "/" });

  const { isLoading, isError, error } = useQuery({
    queryKey: ["getSingleTask", taskId],
    queryFn: async () => {
      const response = await getSingleTaskAPI(taskId);
      const taskData = response?.data?.data;

      try {
        if (response?.status === 200 || response?.status === 201) {
          setViewData(taskData);
        }
      } catch (err: any) {
        throw err;
      }
    },
    enabled: Boolean(taskId),
  });

  return (
    <div className="py-3 px-5 flex justify-between items-center bg-white border-b">
      <span className="ml-2 text-lg font-semibold flex">
        {pathname.includes("/tasks/view/") && taskId
          ? `${title} - ${refernceId}`
          : title}
      </span>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex gap-2 items-center hover:cursor-pointer">
            <Avatar>
              <AvatarImage
                src={
                  viewData?.created_profile_pic_url || "/profile-picture.png"
                }
                alt="@shadcn"
              />
            </Avatar>
            My Account
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
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                navigate({
                  to: `/`,
                });
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <img
          src={downArrowIcon}
          alt="dashboard"
          className="h-[13px] w-[13px]"
        />
      </div>
    </div>
  );
}
export default TopBar;
