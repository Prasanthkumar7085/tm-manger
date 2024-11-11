import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import React, { useState } from "react";
import listingDelete from "@/assets/delete-listing.svg";
import DeleteDialog from "@/components/core/deleteDialog";
import { deleteAssignesAPI } from "@/lib/services/tasks";
import { useParams } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
const DeleteAssignes = ({
  assigneeId,
  onSuccess,
}: {
  assigneeId: any;
  onSuccess: () => void;
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const profileData: any = useSelector(
    (state: any) => state.auth.user.user_details
  );
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response: any = await deleteAssignesAPI(assigneeId);
      if (response.status === 200 || response.status === 201) {
        toast.success(
          response?.message || "Task assignee details removed successfully"
        );
        setDeleteDialogOpen(false);
        onSuccess();
      } else {
        throw new Error("Failed to delete assignee");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete assignee.");
    },
  });

  const handleDeleteClick = () => {
    mutate();
  };

  return (
    <>
      <button
        disabled={profileData?.user_type === "admin" ? false : true}
        onClick={() => setDeleteDialogOpen(true)}
        title="Delete Assignee"
        aria-label="Delete Assignee"
        className="flex items-center text-red-600 absolute bg-red-200 w-5 h-full top-0 right-0 bottom-0 hover:bg-red-600 hover:text-white pl-[1px] pr-[1px]"
      >
        <X />
      </button>

      <DeleteDialog
        openOrNot={deleteDialogOpen}
        onCancelClick={() => setDeleteDialogOpen(false)}
        label="Are you sure you want to delete this Task Assignee?"
        onOKClick={handleDeleteClick}
        deleteLoading={isPending}
      />
    </>
  );
};

export default DeleteAssignes;
