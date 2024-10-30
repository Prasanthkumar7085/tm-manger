import DeleteProjects from "@/components/Projects/DeleteProject";
import { Button } from "@/components/ui/button";
import { fileUploadAPI, uploadToS3API } from "@/lib/services/projects";
import { getAttachmentsAPI, uploadAttachmentAPI } from "@/lib/services/tasks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { Loader2, UploadCloud, X } from "lucide-react";
import { useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { toast } from "sonner";
import DeleteAttachments from "./DelteteAttachments";
import LoadingComponent from "@/components/core/LoadingComponent";

const UploadAttachments = () => {
  const { taskId } = useParams({ strict: false });
  const [attachmentsData, setAttachments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [refreshCount, setRefreshCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState<any>();
  const [uploadingStatus, setUploadingStatus] = useState({
    startUploading: false,
    uploadSuccess: false,
    loading: false,
  });

  // Fetch attachments for the task
  const { isLoading, isFetching, error } = useQuery({
    queryKey: ["getAttachments", taskId, refreshCount],
    queryFn: async () => {
      const response = await getAttachmentsAPI(taskId);
      try {
        setLoading(true);
        if (response?.status === 200 || response?.status === 201) {
          const info = response?.data?.data;
          setAttachments(info);

          return info;
        }
      } catch (err: any) {
        toast.error(err?.message || "Something went Wrong");
      } finally {
        setLoading(false);
      }
    },
    enabled: !!taskId,
  });

  // Handle file drop
  const onDrop = (acceptedFiles: File[]) => {
    setSelectedFiles(acceptedFiles);
    setRejectionMessage(null);
    handleFileUpload(acceptedFiles[0]);
  };

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const message = rejectedFiles
      .map(({ file, errors }) =>
        errors.map((error) => {
          if (error.code === "file-invalid-type") {
            return `File "${file.name}" has an unsupported type.`;
          }
          return `File "${file.name}" was rejected. Reason: ${error.message}`;
        })
      )
      .flat()
      .join(", ");

    setRejectionMessage(message);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".pdf"],
    },
    multiple: false,
    noClick: true,
  });

  // Handle file upload
  const handleFileUpload = (file: File) => {
    fileUploadMutation.mutate(file);
  };

  // Mutation to upload file
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

      return { file_key, file_name: file.name };
    },
    onSuccess: async ({ file_key, file_name }) => {
      const payload = {
        task_id: Number(taskId),
        file_name: file_name,
        key: file_key,
      };
      uploadAttachementMutation.mutate(payload);
      setSelectedFiles([]);
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

  // Upload file to S3
  const uploadToS3 = async (url: string, file: File) => {
    try {
      setLoading(true);
      const response = await uploadToS3API(url, file);
      if (response.status === 200 || response.status === 201) {
      } else {
        throw response;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadAttachementMutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        setLoading(true);
        const response = await uploadAttachmentAPI(payload);
        if (response.data.status === 200 || response.data.status === 201) {
          toast.success("Attachment uploaded successfully!");
          setRefreshCount((prev: any) => prev + 1);
          return response;
        } else {
          throw new Error("Failed to upload attachment");
        }
      } catch (err) {
        toast.error("Failed to upload attachment.");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleRemoveFile = () => {
    setSelectedFiles([]);
  };

  return (
    <div className="relative px-2">
      <h2 className="font-semibold">Attachments</h2>
      <div className="mt-2 space-y-2">
        {attachmentsData.length > 0 ? (
          attachmentsData.map((file: any) => (
            <div
              key={file.id}
              className="flex justify-between items-center border rounded-md p-2"
            >
              <div className="flex items-center space-x-2">
                <span className="text-xl">📄</span>
                <p>{file.file_name}</p>
              </div>
              <DeleteAttachments
                attachmentId={file.id}
                onSuccess={() => setRefreshCount((prev) => prev + 1)}
                taskId={taskId}
              />
            </div>
          ))
        ) : (
          <p>No attachments found.</p>
        )}
      </div>

      <div className="mt-4">
        <div {...getRootProps()} className="hidden">
          <input {...getInputProps()} />
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-medium">{file.name}</span>
                <button onClick={handleRemoveFile}>
                  <X className="text-red-500 w-6 h-6" />
                </button>
              </div>
            ))}
          </div>
        )}
        <Button
          onClick={open}
          className="bg-red-500 text-white flex items-center"
        >
          {uploadingStatus.loading && (
            <div className="flex items-center mt-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            </div>
          )}
          <UploadCloud className="h-5 w-5 mr-2" />
          Upload
        </Button>

        {rejectionMessage && (
          <p className="text-red-600 mt-2">{rejectionMessage}</p>
        )}
      </div>
      <LoadingComponent loading={isLoading || loading} />
    </div>
  );
};

export default UploadAttachments;
