// import { useQuery } from "@tanstack/react-query";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// const dummyUsers = Array(10)
//   .fill(0)
//   .map((_, i) => ({
//     id: i + 1,
//     name: `User ${i + 1}`,
//     createdOn: `15-Sep-2024`,
//     email: `user${i + 1}@example.com`,
//     mobileNumber: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
//     status: i % 2 === 0 ? "Active" : "Inactive",
//     progress: 20,
//     completed: 30,
//     pending: 40,
//     overdue: 1,
//     avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
//   }));

// const fetchUsers = async (page: any, search: any) => {
//   return dummyUsers.filter((user) =>
//     user.name.toLowerCase().includes(search.toLowerCase())
//   );
// };

// export const UsersTable = () => {
//   const { data, isLoading } = useQuery({
//     queryKey: ["users"],
//     queryFn: () => fetchUsers("", ""),
//   });

//   return (
//     <div className="overflow-x-auto w-full">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>S No</TableHead>
//             <TableHead>Name</TableHead>
//             <TableHead>Created On</TableHead>
//             <TableHead>Email</TableHead>
//             <TableHead>Mobile Number</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Progress</TableHead>
//             <TableHead>Completed</TableHead>
//             <TableHead>Pending</TableHead>
//             <TableHead>Overdue</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {data?.map((user, index) => (
//             <TableRow key={user.id}>
//               <TableCell>{index + 1}</TableCell>
//               <TableCell>
//                 <div className="flex items-center">
//                   <img
//                     src={user.avatar}
//                     alt={user.name}
//                     className="h-8 w-8 rounded-full mr-2"
//                   />
//                   {user.name}
//                 </div>
//               </TableCell>
//               <TableCell>{user.createdOn}</TableCell>
//               <TableCell>{user.email}</TableCell>
//               <TableCell>{user.mobileNumber}</TableCell>
//               <TableCell>
//                 <span
//                   className={`px-2 py-1 rounded-full ${
//                     user.status === "Active"
//                       ? "bg-green-100 text-green-800"
//                       : "bg-red-100 text-red-800"
//                   }`}
//                 >
//                   {user.status}
//                 </span>
//               </TableCell>
//               <TableCell>{user.progress}</TableCell>
//               <TableCell>{user.completed}</TableCell>
//               <TableCell>{user.pending}</TableCell>
//               <TableCell>{user.overdue}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// export default UsersTable;
import { addSerial } from "@/lib/helpers/addSerial";
import { addUsersAPI, getAllPaginatedUsers } from "@/lib/services/users";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import TanStackTable from "../core/TanstackTable";
import { userColumns } from "./UserColumns";
import { Button } from "../ui/button";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
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
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"

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
  const pageIndexParam = Number(searchParams.get("page")) || 1;
  const pageSizeParam = Number(searchParams.get("page_size")) || 5;
  const orderBY = searchParams.get("order_by")
    ? searchParams.get("order_by")
    : "";
  const initialSearch = searchParams.get("search") || "";
  const [searchString, setSearchString] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(searchString);
  // const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: pageIndexParam,
    pageSize: pageSizeParam,
    order_by: orderBY,
  });
  const [userData, setUserData] = useState<any>({
    full_name: "",
    email: "",
    phone_number: "",
  });

  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["users", pagination],
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

  // const { mutate, isPending, isError, error, data, isSuccess } = useMutation({
  //   mutationFn: async (payload: ReportPayload) => {
  //     if () {
  //       //   return await updateUserAPI(payload);
  //     } else {
  //       return await addUsersAPI(payload);
  //     }
  //   },
  //   onSuccess: (response: any) => {
  //     if (response?.status === 200 || response?.status === 201) {
  //       toast.success(response?.data?.message);
  //       navigate({
  //         to: "/users",
  //       });
  //     }
  //     if (response?.status === 422) {
  //       // setErrorMessages(response?.data?.errData || [""]);
  //       toast.error(response?.data?.message);
  //     }
  //   },
  // });

  const addUser = () => {
    const payload = {
      full_name: userData?.full_name,
      email: userData?.email,
      phone_number: userData?.phone_number,
    };
    (payload);
  };

  const usersData =
    addSerial(
      data?.data?.Users,
      data?.data?.pagination?.page,
      data?.data?.pagination?.limit
    ) || [];

  const handleDrawerOpen = () => {
    setIsOpen(true);
  };

  const handleDrawerClose = () => {
    setIsOpen(false);
  };
  return (
    <div className="relative">
      <div className="flex justify-end mb-4 gap-3">
        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          // onClick={handleNavigation}
          onClick={handleDrawerOpen}
        >
          +Add Users
        </Button>
      </div>
      <div>
        <div>
          <TanStackTable
            data={usersData}
            columns={[...userColumns]}
            paginationDetails={data?.data}
            getData={getAllUsers}
            removeSortingForColumnIds={[
              "serial",
              "full_name",
              "email",
              "phone_number",
              "user_type",
              "created_at",
            ]}
          />
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add User</SheetTitle>
          <SheetDescription>
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Enter name"
              className="col-span-3 border border-gray-300 p-2 rounded"
              type="text"
  />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              placeholder="Enter Email"
              className="col-span-3 border border-gray-300 p-2 rounded"
              type="text"
  />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mobile number" className="text-right">
              Mobile Number
            </Label>
            <Input
              id="phonenumber"
              placeholder="Enter Mobile Number"
              className="col-span-3 border border-gray-300 p-2 rounded"
              type="text"
  />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
      </div>
    </div>
  );
}

export default UsersTable;
