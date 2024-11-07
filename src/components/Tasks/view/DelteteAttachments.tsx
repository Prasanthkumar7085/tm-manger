import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import DeleteDialog from "@/components/core/deleteDialog";
import { deleteAttachmentsAPI } from "@/lib/services/tasks";
import { useParams } from "@tanstack/react-router";

const DeleteAttachments = ({ attachmentId, onSuccess }: any) => {
  const { taskId } = useParams({ strict: false });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState<any>();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      taskId,
      attachmentId,
    }: {
      taskId: any;
      attachmentId: any;
    }) => {
      try {
        setLoading(true);
        const response = await deleteAttachmentsAPI(taskId, attachmentId);
        if (response.status === 200 || response.status === 201) {
          toast.success("Attachment deleted successfully!");
          setDeleteDialogOpen(false);
          onSuccess();
        } else {
          throw new Error("Failed to delete attachment");
          setDeleteDialogOpen(false);
        }
      } catch (err: any) {
        toast.error(err?.message || "Something went wrong");
        setDeleteDialogOpen(false);
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      toast.error("Failed to delete attachment.");
    },
  });

  const handleDeleteClick = () => {
    mutate({ taskId, attachmentId });
  };

  return (
    <>
      <button onClick={() => setDeleteDialogOpen(true)} title="delete" className="flex items-center text-red-600">
        <X className="text-red-500 w-4 h-4 mr-1" />
        Delete
      </button>

      <DeleteDialog
        openOrNot={deleteDialogOpen}
        onCancelClick={() => setDeleteDialogOpen(false)}
        label="Are you sure you want to delete attachment?"
        onOKClick={handleDeleteClick}
        deleteLoading={isPending}
      />
    </>
  );
};

export default DeleteAttachments;
