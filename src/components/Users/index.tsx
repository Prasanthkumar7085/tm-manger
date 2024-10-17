import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const dummyUsers = Array(10)
  .fill(0)
  .map((_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    createdOn: `15-Sep-2024`,
    email: `user${i + 1}@example.com`,
    mobileNumber: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
    status: i % 2 === 0 ? "Active" : "Inactive",
    progress: 20,
    completed: 30,
    pending: 40,
    overdue: 1,
    avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
  }));

const fetchUsers = async (page: any, search: any) => {
  return dummyUsers.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );
};

export const UsersTable = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers("", ""),
  });

  return (
    <div className="overflow-x-auto w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Created On</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Mobile Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Completed</TableHead>
            <TableHead>Pending</TableHead>
            <TableHead>Overdue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full mr-2"
                  />
                  {user.name}
                </div>
              </TableCell>
              <TableCell>{user.createdOn}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.mobileNumber}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.status}
                </span>
              </TableCell>
              <TableCell>{user.progress}</TableCell>
              <TableCell>{user.completed}</TableCell>
              <TableCell>{user.pending}</TableCell>
              <TableCell>{user.overdue}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
