import DeleteProjects from "@/components/Projects/DeleteProject";
import { Button } from "@/components/ui/button";
import { fileUploadAPI, uploadToS3API } from "@/lib/services/projects";
import {
  downloadAttachmentAPI,
  getAttachmentsAPI,
  uploadAttachmentAPI,
} from "@/lib/services/tasks";
import { useMutation, useQuery } from "@tanstack/react-query";
import pdfIcon from "@/assets/pdf-icon.svg";
import { useParams } from "@tanstack/react-router";
import { CloudDownload, Loader2, UploadCloud, X } from "lucide-react";
import { useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { toast } from "sonner";
import DeleteAttachments from "./DelteteAttachments";
import LoadingComponent from "@/components/core/LoadingComponent";
import { downloadFileFromS3 } from "@/lib/helpers/apiHelpers";

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
        } else if (response?.status === 404) {
          setAttachments([]);
          return [];
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

  const downloadFileMutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        let body = {
          file_key: payload.key,
        };
        setLoading(true);
        const response = await downloadAttachmentAPI(body);
        if (response.data.status === 200 || response.data.status === 201) {
          downloadFileFromS3(
            response?.data?.data?.download_url,
            payload?.file_name
          );
        } else {
          throw new Error("Failed to download attachment");
        }
      } catch (err) {
        toast.error("Failed to download attachment.");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleRemoveFile = () => {
    setSelectedFiles([]);
  };

  return (
    <div id="upload-attachments" className="mt-5">
      <div className="flex justify-between items-center">
        <h2 className="text-lg text-[#0D0D0D] font-medium">Attachments</h2>
        <Button type="button" onClick={open} variant="add" size="DefaultButton">
          {uploadingStatus.loading && (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            </div>
          )}
          <img src="/upload.svg" alt="icon" className="mr-2 w-4" />
          Upload
        </Button>
      </div>
      <div className="attachments-list mt-5 space-y-4">
        {attachmentsData.length > 0 ? (
          attachmentsData.map((file: any) => (
            <div
              key={file.id}
              className="each-attachment flex justify-between items-center"
            >
              <div className="attachment-name flex space-x-4">
                <span className="text-xl">
                  {" "}
                  {/* <img src={pdfIcon} alt="pdf" height={20} width={20} /> */}
                  📄
                </span>
                <div>
                  <p className="name text-[#242634] font-medium text-sm leading-tight">
                    {file.file_name}
                  </p>
                  {/* <p className="time mt-0">2m ago</p> */}
                </div>
              </div>
              <div className="attachment-actions flex justify-center space-x-4">
                {/* <p className="file-size border text-black font-semibold text-[10px] px-2 flex items-center rounded-sm border-slate-300"> */}
                {/* {file?.file_size} */}
                {/* </p> */}
                <button
                  onClick={() => {
                    downloadFileMutation.mutate(file);
                  }}
                  title="download"
                >
                  <CloudDownload className="text-green-500 w-6 h-6" />
                </button>
                <DeleteAttachments
                  attachmentId={file.id}
                  onSuccess={() => setRefreshCount((prev) => prev + 1)}
                  taskId={taskId}
                />
              </div>
            </div>
          ))
        ) : (
          <p>No attachments found.</p>
        )}
      </div>
      <div className="mt-2 space-y-2"></div>
      <div className="mt-4">
        <div {...getRootProps()} className="hidden">
          <input {...getInputProps()} />
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-medium">{file.name}</span>
                <div>
                  <button onClick={handleRemoveFile} title="Remove">
                    <X className="text-red-500 w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {rejectionMessage && (
          <p className="text-red-600 mt-2">{rejectionMessage}</p>
        )}
      </div>
      <LoadingComponent loading={loading} />
    </div>
  );
};

export default UploadAttachments;
