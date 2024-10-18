import { navBarConstants } from "@/lib/helpers/navBarConstants";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface titleProps {
  title: string;
  path: string;
}

function TopBar() {
  const location = useLocation();
  const pathname = location.pathname;
  const currentNavItem = navBarConstants.find((item: titleProps) =>
    pathname.includes(item.path)
  );
  const title = currentNavItem ? currentNavItem.title : null;
  const navigate = useNavigate({ from: "/" });

  return (
    <div className="p-3 flex justify-between items-center bg-white border-b-2">
      <span className="ml-2 text-lg font-semibold">{title}</span>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex gap-2 items-center hover:cursor-pointer">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>SB</AvatarFallback>
            </Avatar>
            My Account
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Update Password</DropdownMenuItem>
            <DropdownMenuItem
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
          src={"src/assets/down-arrow.svg"}
          alt="dashboard"
          className="h-[13px] w-[13px]"
        />
      </div>
    </div>
  );
}
export default TopBar;
