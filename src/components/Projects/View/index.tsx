import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import dayjs from "dayjs";
import { toast } from "sonner";

import {
  fileUploadAPI,
  uploadLogoAPI,
  viewProjectAPI,
} from "@/lib/services/projects";
import ProjectTasksCounts from "./ProjectTasksCounts";
import ProjectMembersManagment from "./ProjectMembersManagment";
import LoadingComponent from "@/components/core/LoadingComponent";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const ProjectView = () => {
  const { projectId } = useParams({ strict: false });

  const [projectDetails, setProjectDetails] = useState<any>({});
  const [uploadingStatus, setUploadingStatus] = useState({
    startUploading: false,
    uploadSuccess: false,
    loading: false,
  });
  const [openMembers, setOpenMembers] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { isFetching, isLoading } = useQuery({
    queryKey: ["getSingleProject", projectId],
    queryFn: async () => {
      try {
        const response = await viewProjectAPI(projectId);
        if (response.success) {
          setProjectDetails(response.data?.data);
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

  const uploadFile = async (file: File) => {
    setUploadingStatus((prev) => ({
      ...prev,
      startUploading: true,
      loading: true,
    }));

    try {
      const { data } = await fileUploadAPI({
        file_name: file.name,
        file_type: file.type,
      });
      console.log(data, "fjdsjdfkdjs");
      await uploadLogo({ logo: data?.data?.file_key });
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload file.");
    } finally {
      setUploadingStatus((prev) => ({
        ...prev,
        startUploading: false,
        loading: false,
      }));
    }
  };

  const uploadLogo = async (payload: { logo: string }) => {
    console.log(payload, "payload");
    try {
      const response = await uploadLogoAPI(projectId, payload);
      if (response.success) {
        toast.success("Logo uploaded successfully!");
      } else {
        throw new Error("Failed to upload logo");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error uploading logo");
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      await uploadFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="flex flex-col justify-between h-full w-full overflow-auto">
      <div className="mt-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border border-gray-300 p-2 rounded"
        />
        {uploadingStatus.startUploading && <p>Uploading...</p>}
        {selectedFile && (
          <button
            onClick={handleRemoveFile}
            className="bg-none border-none cursor-pointer ml-2"
          >
            <X className="text-red-500 w-4 h-4" />
          </button>
        )}

        {previewUrl && (
          <div className="mt-2">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
            />
          </div>
        )}
      </div>

      <ProjectTasksCounts />
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
        <LoadingComponent loading={isLoading || isFetching} />
      </div>

      {openMembers && (
        <div className="mt-2">
          <ProjectMembersManagment />
        </div>
      )}
    </div>
  );
};

export default ProjectView;
