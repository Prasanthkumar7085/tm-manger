import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import React, { useState } from "react";
import listingDelete from "@/assets/delete-listing.svg";
import DeleteDialog from "@/components/core/deleteDialog";
import { deleteAssignesAPI } from "@/lib/services/tasks";
import { useParams } from "@tanstack/react-router";

const DeleteAssignes = ({
  assigneeId,
  onSuccess,
}: {
  assigneeId: any;
  onSuccess: () => void;
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
      className="flex items-center"
        onClick={() => setDeleteDialogOpen(true)}
        title="Delete Assignee"
        aria-label="Delete Assignee"
      >
        <img
        src={listingDelete}
          alt="Delete"
          className="cursor-pointer"
          height={24}
          width={24}
        />
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
