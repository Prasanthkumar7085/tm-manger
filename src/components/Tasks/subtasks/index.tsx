import SearchFilter from "@/components/core/CommonComponents/SearchFilter";
import TanStackTable from "@/components/core/TanstackTable";
import { addSerial } from "@/lib/helpers/addSerial";
import { errPopper } from "@/lib/helpers/errPopper";
import { getAllSubTasks } from "@/lib/services/tasks";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "@tanstack/react-router";
import { sub } from "date-fns";
import { useEffect, useState } from "react";

import { get } from "http";
import LoadingComponent from "@/components/core/LoadingComponent";
import { toast } from "sonner";
import { SubTaskColumns } from "./SubTasksColumns";
import { Button } from "@/components/ui/button";

export const SubTasks = ({ viewData }: { viewData: any }) => {
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get("search");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [del, setDel] = useState<any>(1);
  const [searchString, setSearchString] = useState<any>(initialSearch || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchString);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const { taskId } = useParams({ strict: false });

  const { isFetching, isLoading } = useQuery({
    queryKey: ["subtasks", taskId, del],
    queryFn: async () => {
      try {
        const response = await getAllSubTasks(taskId);
        if (response.status === 200 || response?.status === 201) {
          const data = response.data?.data;
          setFilteredData(data);
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error?.message || "Something went wrong");
      }
    },
    enabled: Boolean(taskId),
  });

  return (
    <div className="relative">
      <div className="mt-5">
        <div className="flex justify-end">
          <Button
            type="button"
            className="h-[25px] px-3 bg-blue-400"
            onClick={() =>
              router.navigate({
                to: `/tasks/${taskId}/subtasks/add-subtask?project_id=${viewData?.project_id}`,
              })
            }
          >
            Add SubTask
          </Button>
        </div>
        <SubTaskColumns data={filteredData} setDel={setDel} />
      </div>
      <LoadingComponent
        loading={isLoading || isFetching || loading}
        message="Loading.."
      />
    </div>
  );

  return <div></div>;
};
