import { useQuery } from "@tanstack/react-query";
import ProjectTasksCounts from "./ProjectTasksCounts";
import { useParams } from "@tanstack/react-router";
import { viewProjectAPI } from "@/lib/services/projects";
import { useState } from "react";
import dayjs from "dayjs";
import LoadingComponent from "@/components/core/LoadingComponent";

const ProjectView = () => {
  const { projectId } = useParams({ strict: false });

  const [projectDetails, setProjectDetails] = useState<any>({});

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
    <div className="flex flex-col justify-between py-4 w-full">
      <div>
        <ProjectTasksCounts />
      </div>

      <div className="flex items-center space-x-2 w-full justify-between">
        <div>
          <h2 className="text-xl font-semibold">{projectDetails?.title}</h2>
          <p className="text-sm text-gray-500">{projectDetails?.description}</p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <div>
            <h2 className="text-sm font-semibold">Created at</h2>
            <p className="text-sm text-gray-500">
              {dayjs(projectDetails?.created_at).format("MM-DD-YYYY")}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold">Created by</h2>
            <p className="text-sm text-gray-500">
              {projectDetails?.created_by}
            </p>
          </div>
        </div>
      </div>
      <LoadingComponent loading={isLoading || isFetching} />
    </div>
  );
};

export default ProjectView;
