import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Loader2, LockKeyhole } from "lucide-react";
const SheetRover = ({
  isOpen,
  userPasswordData,
  errors,
  loading,
  handleUpdateChangePassword,
  handleCancel,
  resetUserPassword,
}: {
  userPasswordData: any;
  errors: any;
  loading: boolean;
  isOpen: boolean;
  handleCancel: () => void;
  handleUpdateChangePassword: any;
  resetUserPassword: () => void;
}) => {
  return (
    <Sheet open={isOpen}>
      <SheetContent className="bg-gray-100">
        <SheetHeader>
          <SheetTitle>Reset Password</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="relative flex flex-col space-y-1">
          <Label className="font-normal capitalize text-lg" htmlFor="password">
            New Password
          </Label>
          <div className="relative">
            <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Input
              className="appearance-none block py-1 h-12 text-lg rounded-none pl-10 focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none"
              id="password"
              placeholder="Enter New Password"
              value={userPasswordData.new_password}
              name="new_password"
              onChange={handleUpdateChangePassword}
            />
             {errors?.new_password && (
            <p style={{ color: "red" }}>{errors?.new_password[0]}</p>
          )}
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <SheetClose asChild>
            <Button type="submit" onClick={resetUserPassword}>
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                "Update"
              )}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SheetRover;
