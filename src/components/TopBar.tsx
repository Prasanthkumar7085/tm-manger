import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { BellDot } from "lucide-react";
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

  return (
    <div className="my-4 mr-4 p-5 flex justify-between items-center rounded-xl bg-white">
      <div></div>
      <div className="flex items-center ">
        <Link className=" mr-2" to="/">
          <BellDot strokeWidth={1.5} className="text-yellow-600" />
        </Link>
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
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
export default TopBar;
