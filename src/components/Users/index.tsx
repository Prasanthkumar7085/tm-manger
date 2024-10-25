import { addSerial } from "@/lib/helpers/addSerial";
import {
  addUsersAPI,
  deleteUsersAPI,
  getAllPaginatedUsers,
  getSingleUserAPI,
  resetPasswordUsersAPI,
  updateUserSelectStatueAPI,
} from "@/lib/services/users";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  useLocation,
  useNavigate,
  useParams,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import TanStackTable from "../core/TanstackTable";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { userColumns } from "./UserColumns";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import SearchFilter from "../core/CommonComponents/SearchFilter";
import { Check, ChevronDown, ChevronUp, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { userTypes } from "@/utils/conistance/users";
import Loading from "../core/Loading";
import DeleteDialog from "../core/deleteDialog";
import SheetRover from "../core/SheetRover";
import SelectStatusFilter from "../core/CommonComponents/SelectStatusFilter";
import { errPopper } from "@/lib/helpers/errPopper";
import LoadingComponent from "../core/LoadingComponent";

interface ReportPayload {
  full_name: string;
  email: string;
  phone_number: string;
}

function UsersTable() {
  const navigate = useNavigate();
  const location = useLocation();
  const router = useRouter();
  const searchParams = new URLSearchParams(location.search);
  const pageIndexParam = Number(searchParams.get("current_page")) || 1;
  const pageSizeParam = Number(searchParams.get("page_size")) || 10;
  const orderBY = searchParams.get("order_by")
    ? searchParams.get("order_by")
    : "";
  const initialSearch = searchParams.get("search") || "";
  const [searchString, setSearchString] = useState(initialSearch);
  const [loading, setLoading] = useState(false);
  const [userTypeOpen, setUserTypeOpen] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(searchString);
  const [userType, setUserType] = useState<any>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isClose, setIsClose] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteuserId, setDeleteUserId] = useState<any>();
  const [isEditing, setIsEditing] = useState(false);
  const [del, setDel] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isPasswordSheetOpen, setIsPasswordSheetOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<any>();
  const [newPassword, setNewPassword] = useState("");
  const [selectedId, setSelectedId] = useState<any>();
  const [pagination, setPagination] = useState({
    pageIndex: pageIndexParam,
    pageSize: pageSizeParam,
    order_by: orderBY,
  });
  const [adduser, setAddUser] = useState<any>();
  const [userData, setUserData] = useState<any>({
    id: null, // add id to track the current user in edit mode
    fname: "",
    lname: "",
    email: "",
    password: "",
  });
  const [userPasswordData, setUsePasswordData] = useState<any>({
    new_password: "",
  });

  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["users", pagination, debouncedSearch, del],
    queryFn: async () => {
      const response = await getAllPaginatedUsers({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        order_by: pagination.order_by,
        search: debouncedSearch || undefined,
      });

      const queryParams = {
        current_page: +pagination.pageIndex,
        page_size: +pagination.pageSize,
        order_by: pagination.order_by ? pagination.order_by : undefined,
        search: debouncedSearch || undefined,
      };
      router.navigate({
        to: "/users",
        search: queryParams,
      });

      return response;
    },
  });
  const getAllUsers = async ({ pageIndex, pageSize, order_by }: any) => {
    setPagination({ pageIndex, pageSize, order_by });
  };

  const addUser = async () => {
    try {
      setLoading(true);
      const payload = {
        fname: userData?.fname,
        lname: userData?.lname,
        email: userData?.email,
        password: userData?.password,
        user_type: userType,
      };
      const response = await addUsersAPI(payload);
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message || "User Added successfully");
        handleDrawerClose();
        setDel((prev) => prev + 1);
      } else if (response?.status === 422) {
        const errData = response?.data?.errData;
        setErrors(errData);
        throw response;
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const { mutate, data: singledata } = useMutation({
    mutationFn: async () => {
      setLoading(true);
      try {
        const response = await getSingleUserAPI(selectedId);
        if (response.success) {
          const data = response?.data?.data;
          setUserData({
            fname: data?.fname,
            lname: data?.lname,
            email: data?.email,
            password: data?.password,
          });
          setUserType(data?.user_type);
        } else {
          throw response;
        }
      } catch (errData) {
        console.error(errData);
        errPopper(errData);
      } finally {
        setLoading(false);
      }
    },
  });

  const deleteUser = async () => {
    try {
      setDeleteLoading(true);
      const response = await deleteUsersAPI(deleteuserId);
      if (response?.status === 200 || response?.status === 201) {
        onClickClose();
        toast.success(response?.data?.message || "User Deleted Successfully");
        setDel((prev) => prev + 1);
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const resetUserPassword = async () => {
    setLoading(true);
    try {
      const payload = {
        new_password: userPasswordData?.new_password,
      };
      const response = await resetPasswordUsersAPI(selectedUserId, payload);
      if (response?.status === 200 || response?.status === 201) {
        toast.success(
          response?.data?.message || "Update Password successfully"
        );
        setIsPasswordSheetOpen(false);
        setUsePasswordData({
          new_password: "",
        });
      } else if (response?.status === 422) {
        const errData = response?.data?.errData;
        setErrors(errData);
        throw response;
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchString);
      if (searchString) {
        getAllUsers({
          pageIndex: 1,
          pageSize: pageSizeParam,
          order_by: orderBY,
        });
      } else {
        getAllUsers({
          pageIndex: pageIndexParam,
          pageSize: pageSizeParam,
          order_by: orderBY,
        });
      }
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchString]);

  const usersData =
    addSerial(
      data?.data?.data?.records,
      data?.data?.data?.pagination_info?.current_page,
      data?.data?.data?.pagination_info?.page_size
    ) || [];

  const handleFormSubmit = async () => {
    if (isEditing) {
      // await updateUser();
    } else {
      await addUser();
    }
  };
  const onChangeStatus = (value: string) => {
    setUserType(value);
  };

  const handleDrawerOpen = (user?: any) => {
    if (user) {
      setUserData({
        id: userData.id || null,
        fname: userData.fname || "",
        lname: userData.lname || "",
        email: userData.email || "",
        password: userData.password || "",
      });
      setUserType(userType.user_type || "");
      setIsEditing(true);
      setSelectedId(user);
    } else {
      setUserData({
        id: null,
        fname: "",
        lname: "",
        email: "",
        password: "",
      });
      setUserType("");
      setIsEditing(false);
      setSelectedId(null);
    }
    setIsOpen(true);
  };
  const handleDrawerClose = () => {
    setUserData({
      id: null,
      fname: "",
      lname: "",
      email: "",
      password: "",
    });
    setUserType("");
    setIsEditing(false);
    setErrors("");
    setIsOpen(false);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const handlePasswordUpdateOpen = (id: any) => {
    setSelectedUserId(id);
    setIsPasswordSheetOpen(true);
  };

  const handleUpdateChangePassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedValue = value
      .replace(/[^a-zA-Z\s]/g, "")
      .replace(/^\s+/g, "")
      .replace(/\s{2,}/g, " ");
    setUsePasswordData((prevData: any) => ({
      ...prevData,
      [name]: updatedValue,
    }));
  };

  const handlePasswordUpdateCancel = () => {
    setIsPasswordSheetOpen(false);
    setSelectedUserId(null);
    setUsePasswordData({
      new_password: "",
    });
    setErrors({});
  };

  const handleInputChange = (e: any) => {
    let { name, value } = e.target;
    const updatedValue = value
      .replace(/[^a-zA-Z\s]/g, "")
      .replace(/^\s+/g, "")
      .replace(/\s{2,}/g, " ");
    setUserData({
      ...userData,
      [name]: updatedValue,
    });
  };

  const handleChangeEmail = (e: any) => {
    let { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleChangePassword = (e: any) => {
    let { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const onClickOpen = (id: any) => {
    setOpen(true);
    setDeleteUserId(id);
  };

  const onClickClose = () => {
    setOpen(false);
  };

  const handleUpdate = (id: number) => {
    handleDrawerOpen(id);
    mutate();
  };
  const userActions = [
    {
      accessorFn: (row: any) => row.actions,
      id: "actions",
      cell: (info: any) => {
        return (
          <div className="flex ">
            <Button
              title="delete"
              onClick={() => onClickOpen(info.row.original.id)}
              size={"sm"}
              variant={"ghost"}
            >
              <img
                src={"/table/delete.svg"}
                alt="view"
                height={16}
                width={16}
              />
            </Button>
            <Button
              title="reset password"
              onClick={() => handlePasswordUpdateOpen(info.row.original.id)}
              size={"sm"}
              variant={"ghost"}
            >
              <img
                src={"/table/change-password-icon.svg"}
                alt="view"
                height={16}
                width={16}
              />
            </Button>
            <Button
              title="edit"
              onClick={() => handleUpdate(info.row.original.id)}
              size={"sm"}
              variant={"ghost"}
            >
              <img src={"/table/edit.svg"} alt="view" height={16} width={16} />
            </Button>
          </div>
        );
      },
      header: () => <span>Actions</span>,
      footer: (props: any) => props.column.id,
      width: "90px",
      minWidth: "90px",
      maxWidth: "90px",
    },
  ];

  return (
    <div className="relative">
      <div className="flex justify-end mb-4 gap-3">
        <SelectStatusFilter />

        <SearchFilter
          searchString={searchString}
          setSearchString={setSearchString}
          title="Search User"
        />
        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleDrawerOpen()}
        >
          +Add Users
        </Button>

        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          import
        </Button>
      </div>
      <div>
        <TanStackTable
          data={usersData}
          columns={[...userColumns, ...userActions]}
          paginationDetails={data?.data?.data?.pagination_info}
          getData={getAllUsers}
          removeSortingForColumnIds={["serial", "actions"]}
        />
      </div>
      <DeleteDialog
        openOrNot={open}
        label="Are you sure you want to Delete this user?"
        onCancelClick={onClickClose}
        onOKClick={deleteUser}
        deleteLoading={deleteLoading}
      />
      <SheetRover
        isOpen={isPasswordSheetOpen}
        handleCancel={handlePasswordUpdateCancel}
        userPasswordData={userPasswordData}
        handleUpdateChangePassword={handleUpdateChangePassword}
        resetUserPassword={resetUserPassword}
        errors={errors}
        loading={loading}
      />
      <div>
        <Sheet open={isOpen}>
          <SheetContent className="bg-gray-100">
            <SheetHeader>
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
                  htmlFor="email"
                >
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
              <div>
                <label
                  htmlFor="panNumber"
                  className="block text-sm font-medium"
                >
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
                        ? userTypes.find((type) => type.value === userType)
                            ?.label
                        : "Select Status"}
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
                      {userTypes?.map((type) => (
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
                              userType === type.value
                                ? "opacity-100"
                                : "opacity-0"
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
      </div>
      <LoadingComponent loading={isLoading || isFetching || loading} />
    </div>
  );
}
export default UsersTable;
