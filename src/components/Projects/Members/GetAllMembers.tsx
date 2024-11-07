import Loading from "@/components/core/Loading";
import { addSerial } from "@/lib/helpers/addSerial";
import { getAllMembers } from "@/lib/services/projects/members";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const ProjectMembers = () => {
  const { projectId } = useParams({ strict: false });
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pageIndexParam = Number(searchParams.get("page")) || 1;
  const pageSizeParam = Number(searchParams.get("page_size")) || 10;
  const orderBY = searchParams.get("order_by") || "";
  const initialSearch = searchParams.get("search") || "";

  const [searchString, setSearchString] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(searchString);
  const [selectedProject, setSelectedProject] = useState("");

  const [pagination, setPagination] = useState({
    pageIndex: pageIndexParam,
    pageSize: pageSizeParam,
    order_by: orderBY,
  });

  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["projects", pagination, selectedProject],
    queryFn: async () => {
      const response = await getAllMembers();
      return response;
    },
  });

  const usersData =
    addSerial(
      data?.data?.data?.records,
      data?.data?.pagination?.page,
      data?.data?.pagination?.limit
    ) || [];

  const handleNavigation = () => {
    navigate({
      to: "/projects/add",
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
    setPagination({ ...pagination, pageIndex: 1 });
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: page,
    }));
  };

  const handlePageSizeChange = (limit: number) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: limit,
      pageIndex: 1,
    }));
  };
  //   useEffect(() => {
  //     getAllMembers;
  //   }, []);

  return (
    <div className="p-4 ">
      <div className="flex w-6/12">
        <div className="flex"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-auto h-[70vh]">
        {usersData?.length === 0 ? (
          <div className="col-span-full text-center">No Projects Found</div>
        ) : (
          usersData?.map((project: any) => "")
        )}
      </div>

      <div className="mt-4"></div>
      <Loading loading={isLoading || isFetching} />
    </div>
  );
};

export default ProjectMembers;
