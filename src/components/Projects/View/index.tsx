import { useQuery } from "@tanstack/react-query";
import ProjectTasksCounts from "./ProjectTasksCounts";
import { useParams } from "@tanstack/react-router";
import { viewProjectAPI } from "@/lib/services/projects";
import { useState } from "react";
import dayjs from "dayjs";
import LoadingComponent from "@/components/core/LoadingComponent";
import ProjectMembersManagment from "./ProjectMembersManagment";
import { Button } from "@/components/ui/button";
import Loading from "@/components/core/Loading";

const ProjectView = () => {
  const { projectId } = useParams({ strict: false });

  const [projectDetails, setProjectDetails] = useState<any>({});
  const [openMembers, setOpenMembers] = useState<boolean>(true);

  const { isFetching, isLoading } = useQuery({
    queryKey: ["getSingleProject", projectId],
    queryFn: async () => {
      if (!projectId) return;
      try {
        const response = await viewProjectAPI(projectId);
        if (response.success) {
          const data = response.data?.data;
          setProjectDetails(data);
        } else {
          throw response;
        }
      } catch (errData) {
        console.error(errData);
      }
    },
    enabled: Boolean(projectId),
  });

  return (
    <div className="flex flex-col justify-between h-full w-full overflow-auto ">
      <div>
        <ProjectTasksCounts />
      </div>
      <div className="flex items-center mt-4 space-x-2 w-full justify-between relative">
        <div>
          <h2 className="text-xl font-semibold capitalize flex-1">
            {projectDetails?.title}
          </h2>
          <p className="text-sm text-gray-500 capitalize flex-1">
            {projectDetails?.description}
          </p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <Button
            onClick={() => setOpenMembers(!openMembers)}
            className="bg-[#f3d1d7]"
          >
            {openMembers ? "Close Members" : "View Members"}
          </Button>
          <div>
            <h2 className="text-sm font-semibold">Created at</h2>
            <p className="text-sm text-gray-500">
              {dayjs(projectDetails?.created_at).format("MM-DD-YYYY")}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold">Created by</h2>
            <p className="text-sm text-gray-500">{"Member"}</p>
          </div>
        </div>
        {/* <LoadingComponent loading={isLoading || isFetching} /> */}
      </div>
      {openMembers ? (
        <div className="mt-2">
          <ProjectMembersManagment />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ProjectView;
