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
import { Loader2, LockKeyhole, X } from "lucide-react";
import { SheetRoverProps } from "@/lib/interfaces";
 export const SheetRover = ({
  isOpen,
  userPasswordData,
  errors,
  loading,
  handleUpdateChangePassword,
  handleCancel,
  resetUserPassword, 
}: SheetRoverProps) => {
  return (
    <Sheet open={isOpen}>
      <SheetContent className="bg-white">
        <SheetHeader>
          <div className="custom-header flex items-center justify-between">
            <SheetTitle>Reset Password</SheetTitle>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="text-center font-semibold  text-lg  text-slate-500 border-none"
            >
              <X></X>
            </Button>
          </div>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="relative flex flex-col space-y-1">  
          <Label
            className="text-md text-slate-600 font-semibold"
            htmlFor="password"
          >
            New Password
          </Label>
          <div className="relative flex items">
            <LockKeyhole className="absolute left-3 mt-[1px] top-1/2 transform -translate-y-1/2 text-slate-800 w-4" />
            
            <Input
             className="bg-[#E7E7E7] appearance-none block py-1 h-12 text-lg pl-9 focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none placeholder:text-sm placeholder:text-slate-600 border rounded-md text-md"
              id="password"
              placeholder="Enter New Password"
              value={userPasswordData.new_password}
              name="new_password"
              onChange={handleUpdateChangePassword}
            />
          </div>
          {errors?.new_password && (
              <p className="text-xs pt-1 text-red-600">{errors?.new_password[0]}</p>
            )}
        </div>
        <SheetFooter className="mt-10">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="text-center font-semibold  text-sm  px-7 h-[30px] text-[#BF1B39] border-none"
          >
            Cancel
          </Button>
          <SheetClose asChild>
            <Button
              type="submit"
              onClick={resetUserPassword}
              className="text-center font-semibold m-auto flex justify-center text-sm text-white px-10 h-[30px]  bg-[#BF1B39]"
            >
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

