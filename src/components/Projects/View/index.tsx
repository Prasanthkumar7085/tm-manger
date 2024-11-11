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
import { CameraIcon, Loader, X } from "lucide-react";
import KanbanBoard from "../KanBanView";
import ProjectMembersManagment from "./ProjectMembersManagment";
import ProjectTasksCounts from "./ProjectTasksCounts";
import { useSelector } from "react-redux";

const ProjectView = () => {
  const { projectId } = useParams({ strict: false });
  const router = useRouter();
  const queryClient = useQueryClient();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const profileData: any = useSelector(
    (state: any) => state.auth.user.user_details
  );
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
    <div className="card-container shadow-md border p-5 rounded-lg bg-white">
      <div className="w-full flex  items-center ">
        <div className="mt-4 flex flex-col w-[10%] ">
          {previewUrl ? (
            <div className="relative w-20 h-20 rounded-full border-2 shadow-md">
              <img
                src={previewUrl || "/favicon.png"}
                alt="Profile Preview"
                className="w-20 h-20 object-cover rounded-full border  bg-black"
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/150?text=No preview";
                }}
              />
              {uploadingStatus.loading && (
                <div className="absolute w-20 h-20 inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 rounded-full">
                  <Loader className="text-white w-6 h-6 animate-spin" />
                </div>
              )}
              <button
                disabled={profileData?.user_type === "user"}
                onClick={handleRemoveFile}
                className="absolute top-0 right-0 bg-red-500 p-1 rounded-full border"
              >
                <X className="text-white w-2 h-2" />
              </button>
            </div>
          ) : (
            <div className="relative w-20 h-20 rounded-full border-2 shadow-md">
              <img
                src="/favicon.png"
                alt="company logo"
                className="w-20 h-20 object-contain	 rounded-full border  bg-white"
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
                disabled={profileData?.user_type === "user"}
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
          <h2 className="text-xl font-semibold capitalize flex-1 text-[#1B2459]">
            <span
              title={projectDetails?.active ? "Active" : "Inactive"}
              className={`inline-block w-2 h-2 rounded-full mr-2 relative bottom-[3px] ${projectDetails?.active ? "bg-green-500" : "bg-red-500"}`}
            ></span>
            {projectDetails?.title}
          </h2>
          <p className="text-md text-gray-500 mt-[6px] capitalize flex-1">
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
            className="bg-[#f3d1d7] rounded-lg text-[#BF1B39] leading-none hover:text-[#ffffff]"
          >
            {openMembers || searchParams.get("tab") == "project_members"
              ? "Close Members"
              : "View Members"}
          </Button>
          <div>
            <h2 className="text-sm text-[#666666]">Created At</h2>
            <p className="text-sm text-[#038847] font-[600]">
              {dayjs(projectDetails?.created_at).format("MM-DD-YYYY")}
            </p>
          </div>
          <div>
            <h2 className="text-sm text-[#666666]">Created By</h2>
            <div className="created-person flex items-center space-x-3">
              <img
                src={
                  projectDetails?.created_profile_pic_url ||
                  "/profile-picture.png"
                }
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = "/profile-picture.png";
                }}
                alt="User"
                className="object-contain w-6 h-6 rounded-full border"
              />
              <p className="text-sm text-[#000000]">
                {projectDetails?.created_name}
              </p>
            </div>
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
