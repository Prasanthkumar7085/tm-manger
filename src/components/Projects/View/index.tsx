import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams, useRouter } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useState } from "react";
import { toast } from "sonner";

import LoadingComponent from "@/components/core/LoadingComponent";
import { Button } from "@/components/ui/button";
import {
  fileUploadAPI,
  uploadLogoAPI,
  uploadToS3API,
  viewProjectAPI,
} from "@/lib/services/projects";
import { CameraIcon, X } from "lucide-react";
import KanbanBoard from "../KanBanView";
import ProjectMembersManagment from "./ProjectMembersManagment";
import ProjectTasksCounts from "./ProjectTasksCounts";

const ProjectView = () => {
  const { projectId } = useParams({ strict: false });
  const router = useRouter();
  const queryClient = useQueryClient();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [projectDetails, setProjectDetails] = useState<any>({});
  const [projectStatsUpdate, setProjetStatsUpdate] = useState<number>(0);
  const [uploadingStatus, setUploadingStatus] = useState({
    startUploading: false,
    uploadSuccess: false,
    loading: false,
  });
  const [openMembers, setOpenMembers] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { isFetching, isLoading } = useQuery({
    queryKey: ["getSingleProject", projectId],
    queryFn: async () => {
      try {
        const response = await viewProjectAPI(projectId);
        if (response.success) {
          setProjectDetails(response.data?.data);
          setPreviewUrl(response.data?.data?.logo);
        } else {
          throw new Error("Failed to fetch project details");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load project details.");
      }
    },
    enabled: Boolean(projectId),
  });

  const fileUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      setUploadingStatus({
        startUploading: true,
        loading: true,
        uploadSuccess: false,
      });
      const { data } = await fileUploadAPI({
        file_name: file.name,
        file_type: file.type,
      });
      const { target_url, file_key } = data?.data;

      await uploadToS3(target_url, file);

      return file_key;
    },

    onSuccess: async (file_key) => {
      uploadLogoMutation.mutate({ logo: file_key });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to upload file.");
      setUploadingStatus({
        startUploading: false,
        loading: false,
        uploadSuccess: false,
      });
    },
    onSettled: () => {
      setUploadingStatus({
        startUploading: false,
        loading: false,
        uploadSuccess: true,
      });
    },
  });

  const uploadToS3 = async (url: string, file: File) => {
    try {
      const response = await uploadToS3API(url, file);
      if (response.status === 200 || response.status === 201) {
        toast.success("File Uploaded Successfully");
      } else {
        throw response;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const uploadLogoMutation = useMutation({
    mutationFn: async (payload: { logo: string }) => {
      try {
        const response = await uploadLogoAPI(projectId, payload);
        if (response.data.status === 200 || response.data.status === 201) {
          toast.success("Logo uploaded successfully!");

          return response;
        } else {
          throw new Error("Failed to upload logo");
        }
      } catch (err) {
        toast.error("Failed to upload logo.");
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      fileUploadMutation.mutate(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="flex flex-col justify-between h-full w-full overflow-auto relative">
      <div className="w-full flex  items-center ">
        <div className="mt-4 flex flex-col w-[10%] ">
          {previewUrl ? (
            <div className="relative w-20 h-20 rounded-full border-2 shadow-md">
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-20 h-20 object-cover rounded-full border  bg-black"
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/150?text=No preview";
                }}
              />
              <button
                onClick={handleRemoveFile}
                className="absolute top-0 right-0 bg-red-500 p-1 rounded-full border"
              >
                <X className="text-white w-2 h-2" />
              </button>
            </div>
          ) : (
            <div className="relative w-20 h-20 rounded-full border-2 shadow-md">
              <img
                src="https://via.placeholder.com/150?text=No+Image"
                alt="company logo"
                className="w-20 h-20 object-cover rounded-full border  bg-black"
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/150?text=No preview";
                }}
              />
              <label
                htmlFor="file-upload"
                className="absolute bottom-1 left-1/2 transform -translate-x-1/2 cursor-pointer"
              >
                <CameraIcon className="w-8 h-8 text-blue-500" />{" "}
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}
          {uploadingStatus.startUploading && <p>Uploading...</p>}
        </div>
        <div className="w-[90%]">
          <ProjectTasksCounts projectStatsUpdate={projectStatsUpdate} />
        </div>
      </div>
      <div className="flex items-center mt-4 space-x-2 w-full justify-between relative">
        <div>
          <h2 className="text-xl font-semibold capitalize flex-1">
            <span
              title={projectDetails?.active ? "Active" : "Inactive"}
              className={`inline-block w-2 h-2 rounded-full mr-2 ${projectDetails?.active ? "bg-green-500" : "bg-red-500"}`}
            ></span>
            {projectDetails?.title}
          </h2>
          <p className="text-sm text-gray-500 capitalize flex-1">
            {projectDetails?.description}
          </p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <Button
            onClick={() => {
              if (openMembers || searchParams.get("tab") == "project_members") {
                router.navigate({
                  to: `/projects/view//${projectId}`,
                  search: { tab: "kanban" },
                });
                setOpenMembers(!openMembers);
              } else {
                router.navigate({
                  to: `/projects/view/${projectId}`,
                  search: { tab: "project_members" },
                });
                setOpenMembers(!openMembers);
              }
            }}
            className="bg-[#f3d1d7]"
          >
            {openMembers || searchParams.get("tab") == "project_members"
              ? "Close Members"
              : "View Members"}
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
      </div>

      <div className="mt-4">
        {openMembers || searchParams.get("tab") == "project_members" ? (
          <ProjectMembersManagment projectDetails={projectDetails} />
        ) : (
          <KanbanBoard
            projectDetails={projectDetails}
            setProjetStatsUpdate={setProjetStatsUpdate}
          />
        )}
      </div>
      <LoadingComponent loading={isLoading || isFetching} />
    </div>
  );
};

export default ProjectView;
