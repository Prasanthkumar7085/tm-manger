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
import {
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  LockKeyhole,
  X,
} from "lucide-react";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
const AddSheetRover = ({
  isOpen,
  userData,
  isEditing,
  userTypeOpen,
  userType,
  userTypes,
  errors,
  loading,
  handleInputChange,
  handleChangeEmail,
  handleChangePassword,
  setUserTypeOpen,
  onChangeStatus,
  handleDrawerClose,
  handleFormSubmit,
}: {
  userData: any;
  isEditing: any;
  errors: any;
  userType: any;
  userTypes: any;
  userTypeOpen: any;
  loading: boolean;
  isOpen: boolean;
  handleChangeEmail: any;
  setUserTypeOpen: any;
  handleChangePassword: any;
  handleDrawerClose: () => void;
  handleFormSubmit: () => void;
  onChangeStatus: any;
  handleInputChange: any;
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={handleDrawerClose}>
      <SheetContent className="bg-gray-100 overflow-auto">
        <SheetHeader className="sticky top-0 bg-white">
          <SheetTitle>{isEditing ? "Edit User" : "Add User"}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col space-y-1">
            <Label
              className="font-normal capitalize text-lg"
              htmlFor="firstname"
            >
              First Name
            </Label>
            <Input
              className="appearance-none block py-1 h-12 text-lg rounded-none focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none"
              id="fname"
              placeholder="Enter First Name"
              value={userData.fname}
              name="fname"
              onChange={handleInputChange}
            />
            {errors?.fname && (
              <p style={{ color: "red" }}>{errors?.fname[0]}</p>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <Label
              className="font-normal capitalize text-lg"
              htmlFor="lastname"
            >
              Last Name
            </Label>
            <Input
              className="appearance-none block py-1 h-12 text-lg rounded-none focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none"
              id="lname"
              placeholder="Enter Last Name"
              value={userData.lname}
              name="lname"
              onChange={handleInputChange}
            />
            {errors?.lname && (
              <p style={{ color: "red" }}>{errors?.lname[0]}</p>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <Label
              className="font-normal capitalize text-lg"
              htmlFor="phonenumber"
            >
              Mobile Number
            </Label>
            <Input
              className="appearance-none block py-1 h-12 text-lg rounded-none focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none"
              id="phone_number"
              placeholder="Enter Phone Number"
              value={userData.phone_number}
              name="phone_number"
              onChange={handleInputChange}
            />
            {errors?.phone_number && (
              <p style={{ color: "red" }}>{errors?.phone_number[0]}</p>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <Label className="font-normal capitalize text-lg" htmlFor="email">
              Email
            </Label>
            <Input
              className="appearance-none block py-1 h-12 text-lg rounded-none focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none"
              id="email"
              placeholder="Enter Email"
              name="email"
              value={userData.email}
              onChange={handleChangeEmail}
            />
            {errors?.email && (
              <p style={{ color: "red" }}>{errors?.email[0]}</p>
            )}
          </div>
          {!isEditing && (
            <div className="flex flex-col space-y-1">
              <Label
                className="font-normal capitalize text-lg"
                htmlFor="password"
              >
                Password
              </Label>
              <Input
                className="appearance-none block py-1 h-12 text-lg rounded-none focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none"
                id="password"
                placeholder="Enter Password"
                value={userData.password}
                name="password"
                onChange={handleChangePassword}
              />
              {errors?.password && (
                <p style={{ color: "red" }}>{errors?.password[0]}</p>
              )}
            </div>
          )}
          <div>
            <label htmlFor="panNumber" className="block text-sm font-medium">
              User Type<span className="text-red-500">*</span>
            </label>
            <Popover open={userTypeOpen} onOpenChange={setUserTypeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={userTypeOpen}
                  className="w-[200px] justify-between bg-white-700"
                >
                  {userType
                    ? userTypes.find((type: any) => type.value === userType)
                        ?.label
                    : "Select User Type"}
                  <div className="flex">
                    {userType && (
                      <X
                        className="mr-2 h-4 w-4 shrink-0 opacity-50"
                        onClick={(e: any) => {
                          e.stopPropagation();
                          onChangeStatus("");
                          setUserTypeOpen(false);
                        }}
                      />
                    )}
                    {userTypeOpen ? (
                      <ChevronUp className="h-4 w-4 shrink-0 opacity-50" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                    )}
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <div className="max-h-[300px] overflow-y-auto">
                  {userTypes?.map((type: any) => (
                    <Button
                      key={type.value}
                      onClick={() => {
                        onChangeStatus(type.value);
                        setUserTypeOpen(false);
                      }}
                      className="w-full justify-start font-normal bg-white text-violet-600 border border-indigo-600 capitalize mb-2 hover:bg-violet-600  hover:text-white "
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          userType === type.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {type.label}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            {errors?.user_type && (
              <p style={{ color: "red" }}>{errors.user_type[0]}</p>
            )}
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={handleDrawerClose}>
            Cancel
          </Button>
          <SheetClose asChild>
            <Button type="submit" onClick={handleFormSubmit}>
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : isEditing ? (
                "Update"
              ) : (
                "Add"
              )}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AddSheetRover;
