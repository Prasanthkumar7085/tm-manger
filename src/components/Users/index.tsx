import { addSerial } from "@/lib/helpers/addSerial";
import {
  addAdminUserAPI,
  addUsersAPI,
  deleteUsersAPI,
  getAllPaginatedUsers,
  getSingleUserAPI,
  resetPasswordUsersAPI,
  updateUsersAPI,
} from "@/lib/services/users";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import TanStackTable from "../core/TanstackTable";
import { userColumns } from "./UserColumns";
import { Button } from "../ui/button";
import SearchFilter from "../core/CommonComponents/SearchFilter";
import { toast } from "sonner";
import { userTypes } from "@/utils/conistance/users";
import { errPopper } from "@/lib/helpers/errPopper";
import LoadingComponent from "../core/LoadingComponent";
import { StatusFilter } from "../core/StatusFilter";

import { SheetRover } from "../core/SheetRover";
import DeleteDialog from "../core/deleteDialog";
import { AddSheetRover } from "../core/AddSheetRovar";
import ForgotComponent, { ForgotDetails } from "../auth/Forgot";
import { forgotAPI } from "@/lib/services/auth";
import loginBackground from "@/assets/login-bg-image.png";
import LogoPath from "@/assets/logo.svg";
import { Loader2, Mail } from "lucide-react";
import { Input } from "../ui/input";

function UsersTable() {
  const location = useLocation();
  const navigate = useNavigate();
  const router = useRouter();
  const popoverRef = useRef<HTMLDivElement>(null);
  const searchParams = new URLSearchParams(location.search);
  const pageIndexParam = Number(searchParams.get("current_page")) || 1;
  const pageSizeParam = Number(searchParams.get("page_size")) || 25;
  const orderBY = searchParams.get("order_by")
    ? searchParams.get("order_by")
    : "";
  const initialSearch = searchParams.get("search") || "";
  const initialStatus = searchParams.get("active") || "";
  const [searchString, setSearchString] = useState(initialSearch);
  const [loading, setLoading] = useState(false);
  const [userTypeOpen, setUserTypeOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(searchString);
  const [userType, setUserType] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<any>([]);
  console.log(users, "ioio");
  const [open, setOpen] = useState(false);
  const [deleteuserId, setDeleteUserId] = useState<any>();

  const [isEditing, setIsEditing] = useState(false);
  const [isEdit, setIsEdit] = useState("");
  const [del, setDel] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isPasswordSheetOpen, setIsPasswordSheetOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [selectedUserId, setSelectedUserId] = useState<any>(null);

  const [selectedId, setSelectedId] = useState<any>();
  const [forgotDetails, setForgotDetails] = useState<any>({
    email: "",
  });
  const [errorss, setErrorss] = useState<any>({});

  const [pagination, setPagination] = useState({
    pageIndex: pageIndexParam,
    pageSize: pageSizeParam,
    order_by: orderBY,
  });
  const [userData, setUserData] = useState<any>({
    id: null,
    fname: "",
    lname: "",
    email: "",
    designation: "",
    password: "",
    phone_number: "",
  });

  const [userPasswordData, setUsePasswordData] = useState<any>({
    new_password: "",
  });

  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["users", pagination, debouncedSearch, del, selectedStatus],
    queryFn: async () => {
      const response = await getAllPaginatedUsers({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        order_by: pagination.order_by,
        search: debouncedSearch,
        active: selectedStatus,
      });
      setUsers(response?.data?.data?.records);

      const queryParams = {
        current_page: +pagination.pageIndex,
        page_size: +pagination.pageSize,
        order_by: pagination.order_by ? pagination.order_by : undefined,
        search: debouncedSearch || undefined,
        active: selectedStatus || undefined,
      };
      router.navigate({
        to: "/users",
        search: queryParams,
      });
      let responseAfterSerial = addSerial(
        response?.data?.data?.records,
        response?.data?.data?.pagination_info?.current_page,
        response?.data?.data?.pagination_info?.page_size
      );
      return [responseAfterSerial, response?.data?.data?.pagination_info];
    },
  });
  console.log(data, "mani");

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
        designation: userData?.designation || null,
        password: userData?.password,
        user_type: "user",
        phone_number: userData?.phone_number || null,
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
            designation: data?.designation,
            password: data?.password,
            phone_number: data?.phone_number,
          });
          console.log(data, "data");
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

  const addAdminUser = async () => {
    try {
      setLoading(true);
      const payload = {
        fname: userData?.fname,
        lname: userData?.lname,
        email: userData?.email,
        designation: userData?.designation,
        password: userData?.password,
        phone_number: userData?.phone_number,
        user_type: "admin",
      };
      const response = await addAdminUserAPI(payload);
      if (response?.status === 200 || response?.status === 201) {
        toast.success(
          response?.data?.message || "Admin User Added successfully"
        );
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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchString);
      if (searchString || selectedStatus) {
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
  }, [searchString, selectedStatus]);
  const handleUserClick = () => {
    setUserType("user");
    setIsEdit("user");
    handleDrawerOpen();
  };

  const handleAdminClick = () => {
    setUserType("admin");
    setIsEdit("admin");
    handleDrawerOpen();
  };

  const handleFormSubmit = async () => {
    if (isEditing) {
      try {
        setLoading(true);
        const response = await updateUsersAPI(selectedId, {
          fname: userData.fname,
          lname: userData.lname,
          email: userData.email,
          designation: userData.designation,
          password: userData.password,
          phone_number: userData.phone_number,
          user_type: userType,
        });
        if (response?.status === 200 || response?.status === 201) {
          toast.success("User updated successfully");
          handleDrawerClose();
          setDel((prev) => prev + 1);
        } else if (response?.status === 422) {
          const errData = response?.data?.errData;
          setErrors(errData);
          throw response;
        }
      } catch (err: any) {
        console.error(err);
        toast.error(err?.message || "Update failed");
      } finally {
        setLoading(false);
      }
    } else {
      {
        isEdit === "admin" ? await addAdminUser() : await addUser();
      }
    }
  };

  const { mutate: forgotPassword } = useMutation({
    mutationFn: async (forgotDetails: ForgotDetails) => {
      setLoading(true);
      try {
        const response = await forgotAPI(forgotDetails);
        if (response?.status === 200 || response?.status === 201) {
          toast.success(response?.data?.message);
        } else if (response?.status === 422) {
          const errData = response?.data?.errData;
          setErrors(errData);
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
  const onChangeStatus = (value: string) => {
    setUserType(value);
  };

  const handleDrawerOpen = (user?: any) => {
    if (user) {
      setIsEditing(true);
      setSelectedId(user);
    } else {
      setUserData({
        id: null,
        fname: "",
        lname: "",
        email: "",
        designation: "",
        password: "",
        phone_number: "",
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
      designation: "",
      password: "",
      phone_number: "",
    });
    setUserType("");
    setIsEditing(false);
    setIsEdit("");
    setErrors("");
    setIsOpen(false);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    if (
      (name === "fname" || name === "lname") &&
      !/^[a-zA-Z\s]*$/.test(value)
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
      }));
      return;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: [],
    }));
    setUserData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
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

  const handleUpdate = (id: number, type: string) => {
    handleDrawerOpen(id);
    setIsEditing(true);
    setIsEdit(type);

    mutate();
  };

  const handleForgotPassword = (email: string) => {
    const forgotDetails = {
      email: email,
    };

    forgotPassword(forgotDetails);
  };

  const userActions = [
    {
      accessorFn: (row: any) => row.actions,
      id: "actions",
      cell: (info: any) => {
        const isActive = info.row.original.active;
        return (
          <>
            <ul className="table-action-buttons flex space-x-2 items-center">
              <li>
                <Button
                  title="forgot-password"
                  onClick={() => {
                    handleForgotPassword(info.row.original.email);
                  }}
                  size={"sm"}
                  variant={"ghost"}
                  // disabled={!isActive}
                  className="p-0 rounded-md w-[27px] h-[27px] border flex items-center justify-center hover:bg-[#f5f5f5]"
                >
                  <img
                    src={"/table/change-password-icon.svg"}
                    alt="view"
                    height={18}
                    width={18}
                  />
                </Button>
              </li>
              <li>
                <Button
                  title="edit"
                  onClick={() =>
                    handleUpdate(
                      info.row.original.id,
                      info.row.original.user_type
                    )
                  }
                  size={"sm"}
                  variant={"ghost"}
                  disabled={!isActive}
                  className="p-0 rounded-md w-[27px] h-[27px] border flex items-center justify-center hover:bg-[#f5f5f5]"
                >
                  <img
                    src={"/table/edit.svg"}
                    alt="view"
                    height={18}
                    width={18}
                  />
                </Button>
              </li>
              <li>
                <Button
                  title="delete"
                  onClick={() => onClickOpen(info.row.original.id)}
                  size={"sm"}
                  variant={"ghost"}
                  className="p-0 rounded-md w-[27px] h-[27px] border flex items-center justify-center hover:bg-[#f5f5f5]"
                >
                  <img
                    src={"/table/delete.svg"}
                    alt="view"
                    height={18}
                    width={18}
                  />
                </Button>
              </li>
            </ul>
          </>
        );
      },
      header: () => <span>Actions</span>,
      footer: (props: any) => props.column.id,
      width: "120px",
      minWidth: "120px",
      maxWidth: "120px",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    mutate(forgotDetails);
  };

  const handleBack = (): void => {
    navigate({
      to: "/",
    });
  };

  return (
    <>
      <section id="users" className="relative">
        <div className="card-container shadow-all border p-3 rounded-xl bg-white">
          <div className="tasks-navbar">
            <div className="flex justify-between items-center">
              <div className="heading"></div>
              <div className="filters">
                <ul className="flex justify-end space-x-3">
                  <li>
                    <StatusFilter
                      value={selectedStatus}
                      setValue={setSelectedStatus}
                    />
                  </li>
                  <li>
                    <SearchFilter
                      searchString={searchString}
                      setSearchString={setSearchString}
                      title="Search By Name"
                    />
                  </li>

                  <li>
                    <Button
                      type="button"
                      variant="add"
                      size="DefaultButton"
                      className="font-normal"
                      // onClick={() => handleDrawerOpen()}
                      onClick={handleUserClick}
                    >
                      <span className="text-xl pr-2">+</span>
                      Add User
                    </Button>
                  </li>
                  <li>
                    <Button
                      type="button"
                      variant="add"
                      size="DefaultButton"
                      className="font-normal"
                      onClick={handleAdminClick}
                    >
                      <span className="text-xl pr-2">+</span>
                      Add Admin
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <TanStackTable
              data={data?.[0]}
              columns={[...userColumns, ...userActions]}
              loading={isLoading || isFetching || loading}
              paginationDetails={data?.[1]}
              getData={getAllUsers}
              removeSortingForColumnIds={[
                "serial",
                "actions",
                "active",
                "todo_count",
                "in_progress_count",
                "overdue_count",
                "completed_count",
                "1_counts_todo_count",
              ]}
            />
          </div>
          <DeleteDialog
            openOrNot={open}
            label="Are you sure you want to Delete this user?"
            onCancelClick={onClickClose}
            onOKClick={deleteUser}
            deleteLoading={deleteLoading}
          />

          <AddSheetRover
            isOpen={isOpen}
            isEditing={isEditing}
            isEdit={isEdit}
            userData={userData}
            userTypeOpen={userTypeOpen}
            userType={userType}
            userTypes={userTypes}
            errors={errors}
            loading={loading}
            handleInputChange={handleInputChange}
            handleChangeEmail={handleChangeEmail}
            handleChangePassword={handleChangePassword}
            setUserTypeOpen={setUserTypeOpen}
            onChangeStatus={onChangeStatus}
            handleDrawerClose={handleDrawerClose}
            handleFormSubmit={handleFormSubmit}
          />
        </div>
        <LoadingComponent
          loading={isLoading || isFetching || loading}
          message="Loading Users..."
        />
      </section>
    </>
  );
}
export default UsersTable;
