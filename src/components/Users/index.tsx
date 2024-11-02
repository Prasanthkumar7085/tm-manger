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
import { useEffect, useState } from "react";
import TanStackTable from "../core/TanstackTable";
import { userColumns } from "./UserColumns";
import { Button } from "../ui/button";
import SearchFilter from "../core/CommonComponents/SearchFilter";
import { toast } from "sonner";
import { userTypes } from "@/utils/conistance/users";
import DeleteDialog from "../core/deleteDialog";
import SheetRover from "../core/SheetRover";
import { errPopper } from "@/lib/helpers/errPopper";
import LoadingComponent from "../core/LoadingComponent";
import { StatusFilter } from "../core/StatusFilter";
import AddSheetRover from "../core/AddSheetRovar";

function UsersTable() {
  const navigate = useNavigate();
  const location = useLocation();
  const router = useRouter();
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
  const [errors, setErrors] = useState<any>({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(searchString);
  const [userType, setUserType] = useState<any>("");
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteuserId, setDeleteUserId] = useState<any>();
  const [isEditing, setIsEditing] = useState(false);
  const [del, setDel] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isPasswordSheetOpen, setIsPasswordSheetOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [selectedUserId, setSelectedUserId] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<any>();
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
        search: debouncedSearch || undefined,
        active: selectedStatus,
      });

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
        designation: userData?.designation || null,
        password: userData?.password,
        user_type: userType,
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
        user_type: userType,
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

  const usersData =
    addSerial(
      data?.data?.data?.records,
      data?.data?.data?.pagination_info?.current_page,
      data?.data?.data?.pagination_info?.page_size
    ) || [];

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
        userType === "admin" ? await addAdminUser() : await addUser();
      }
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
        designation: userData.designation || "",
        password: userData.password || "",
        phone_number: userData.phone_number || "",
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
      .replace(/[^\w\s]/g, "")
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
      .replace(/[^\w\s]/g, "")
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
    <section id="users" className="relative">
      <div className="card-container shadow-all border p-3 rounded-xl">
        <div className="tasks-navbar">
          <div className="flex justify-between items-center">
            <div className="heading"></div>
            <div className="filters">
              <ul className="flex justify-end space-x-4">
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
                    title="Search User"
                  />
                </li>
                <li>
                  <Button
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm  ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 py-2 bg-red-700 text-white h-[35px] px-6 font-semibold"
                    onClick={() => handleDrawerOpen()}
                  >
                    + Add Users
                  </Button>
                </li>
                {/* <li>
                  <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    import
                  </Button>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <TanStackTable
            data={usersData}
            columns={[...userColumns, ...userActions]}
            loading={isLoading || isFetching || loading}
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

        <AddSheetRover
          isOpen={isOpen}
          isEditing={isEditing}
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
      <LoadingComponent loading={isLoading || isFetching || loading} />
    </section>
  );
}
export default UsersTable;
