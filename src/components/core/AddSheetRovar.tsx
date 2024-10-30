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
    <Sheet open={isOpen}>
      <SheetContent className="bg-white overflow-auto">
        <SheetHeader className="sticky top-0">
          <div className="custom-header flex items-center justify-between">
            <SheetTitle>{isEditing ? "Edit User" : "Add User"}</SheetTitle>
            <Button
              variant="outline"
              onClick={handleDrawerClose}
              className="text-center font-semibold  text-lg  text-slate-500 border-none"
            >
              <X></X>
            </Button>
          </div>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col space-y-1">
            <Label
              className="text-md text-slate-600 font-semibold"
              htmlFor="firstname"
            >
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              className="bg-[#F5F6FA] appearance-none block py-1 h-10 text-lg  focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none placeholder:text-sm placeholder:text-slate-600 border rounded-md text-md"
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
              className="text-md text-slate-600 font-semibold"
              htmlFor="lastname"
            >
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              className="bg-[#F5F6FA] appearance-none block py-1 h-10 text-lg  focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none placeholder:text-sm placeholder:text-slate-600 border rounded-md text-md"
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
              className="text-md text-slate-600 font-semibold"
              htmlFor="phonenumber"
            >
              Mobile Number
            </Label>
            <Input
              type="tel"
              className="bg-[#F5F6FA] appearance-none block py-1 h-10 text-lg focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none placeholder:text-sm placeholder:text-slate-600 border rounded-md text-md"
              id="phone_number"
              placeholder="Enter Phone Number"
              value={userData.phone_number}
              name="phone_number"
              onChange={(e) => {
                const numericValue = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 10);
                handleInputChange({
                  target: { name: "phone_number", value: numericValue },
                });
              }}
            />
            {errors?.phone_number && (
              <p style={{ color: "red" }}>{errors?.phone_number[0]}</p>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <Label
              className="text-md text-slate-600 font-semibold"
              htmlFor="email"
            >
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              className="bg-[#F5F6FA] appearance-none block py-1 h-10 text-lg  focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none placeholder:text-sm placeholder:text-slate-600 border rounded-md text-md"
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
                className="text-md text-slate-600 font-semibold"
                htmlFor="password"
              >
                Password<span className="text-red-500">*</span>
              </Label>
              <Input
                className="bg-[#F5F6FA] appearance-none block py-1 h-10 text-lg  focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none placeholder:text-sm placeholder:text-slate-600 border rounded-md text-md"
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
          <div className="flex flex-col space-y-1">
            <Label
              className="text-md text-slate-600 font-semibold"
              htmlFor="designation"
            >
              Designation <span className="text-red-500">*</span>
            </Label>
            <Input
              className="bg-[#F5F6FA] appearance-none block py-1 h-10 text-lg  focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none placeholder:text-sm placeholder:text-slate-600 border rounded-md text-md"
              id="designation"
              placeholder="Enter Designation"
              name="designation"
              value={userData.designation}
              onChange={handleInputChange}
            />
            {errors?.designation && (
              <p style={{ color: "red" }}>{errors?.designation[0]}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="panNumber"
              className="text-md text-slate-600 font-semibold block text-left"
            >
              User Type<span className="text-red-500">*</span>
            </label>
            <Popover open={userTypeOpen} onOpenChange={setUserTypeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={userTypeOpen}
                  className="w-full text-left flex justify-between bg-[#F5F6FA]"
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
              <PopoverContent className="w-full left-0 p-0 right-0">
                <div className="max-h-[300px] overflow-y-auto">
                  {userTypes?.map((type: any) => (
                    <Button
                      key={type.value}
                      onClick={() => {
                        onChangeStatus(type.value);
                        setUserTypeOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left cursor-pointer font-normal text-violet-600 capitalize border-b last:border-b-0 border-white hover:bg-violet-600 hover:text-white"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 inline-block",
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
        <SheetFooter className="mt-16">
          <Button
            variant="outline"
            onClick={handleDrawerClose}
            className="text-center font-semibold  text-sm  px-7 h-[30px] text-[#BF1B39] border-none"
          >
            Cancel
          </Button>
          <SheetClose asChild>
            <Button
              type="submit"
              onClick={handleFormSubmit}
              className="text-center font-semibold m-auto flex justify-center text-sm text-white px-10 h-[30px]  bg-[#BF1B39]"
            >
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
