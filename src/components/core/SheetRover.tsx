import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
const SheetRover = ({
    isOpen,
    userPasswordData,
    errors,
    handleUpdateChangePassword ,
    handleCancel,
    updateUserPassword,
  }: {
    userPasswordData:any;
    errors:any;
    isOpen: boolean;
    handleCancel: () => void;
    handleUpdateChangePassword:any;
    updateUserPassword: () => void;
  }) => {
    return (
        <Sheet open={isOpen}>
          <SheetContent className="bg-gray-100"> 
            <SheetHeader>
              <SheetTitle>Update Password</SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>
            <div className="flex flex-col space-y-1">
                <Label
                  className="font-normal capitalize text-lg"
                  htmlFor="password"
                >
                  Old Password
                </Label>
                <Input
                  className="appearance-none block py-1 h-12 text-lg rounded-none focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none"
                  id="password"
                  placeholder="Enter Old Password"
                  value={userPasswordData.current_password}
                  name="current_password"
                  onChange={handleUpdateChangePassword}
                />
                {/* {errors?.password && (
                  <p style={{ color: "red" }}>{errors?.password[0]}</p>
                )} */}
              </div>
              <div className="flex flex-col space-y-1">
                <Label
                  className="font-normal capitalize text-lg"
                  htmlFor="password"
                >
                  New Password
                </Label>
                <Input
                  className="appearance-none block py-1 h-12 text-lg rounded-none focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none"
                  id="password"
                  placeholder="Enter New Password"
                  name="new_password"
                  value={userPasswordData.new_password}
                  onChange={handleUpdateChangePassword}
                />
                 {errors?.new_password && (
                  <p style={{ color: "red" }}>{errors?.new_password[0]}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1">
                <Label
                  className="font-normal capitalize text-lg"
                  htmlFor="password"
                >
                  Confirm New Password
                </Label>
                <Input
                  className="appearance-none block py-1 h-12 text-lg rounded-none focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none"
                  id="password"
                  placeholder="Enter Confirm Password"
                  name="confirm_new_password"
                  value={userPasswordData.confirm_new_password}
                  onChange={handleUpdateChangePassword}
                />
                {/* {errors?.password && (
                  <p style={{ color: "red" }}>{errors?.password[0]}</p>
                )} */}
              </div>
           
            <SheetFooter>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <SheetClose asChild>
                <Button type="submit" onClick={updateUserPassword}>
                  Update
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
    );
  };
  
  export default SheetRover;