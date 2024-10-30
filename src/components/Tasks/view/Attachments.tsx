import { getAttachmentsAPI } from "@/lib/services/tasks";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";

const UploadAttachments = () => {
  const { taskId } = useParams({ strict: false });
  const { isFetching, error, data } = useQuery({
    queryKey: ["getAttachments", taskId],
    queryFn: async () => {
      const response = await getAttachmentsAPI(taskId);
      if (response?.status === 200 || response?.status === 201) {
        return response?.data?.data || [];
      }
      throw new Error("Failed to fetch attachments");
    },
    enabled: !!taskId, // Only run if taskId exists
  });

  // Attachments will be directly from the `data` prop
  const attachments = data || [];

  // Error or loading states
  if (isFetching) return <p>Loading...</p>;
  if (error) return <p>Failed to load attachments.</p>;

  return (
    <div>
      <h2>Attachments</h2>
      {attachments.length > 0 ? (
        <ul>
          {attachments.map((attachment: any) => (
            <li key={attachment.id}>{attachment.file_name}</li>
          ))}
        </ul>
      ) : (
        <p>No attachments found.</p>
      )}
    </div>
  );
};

export default UploadAttachments;
