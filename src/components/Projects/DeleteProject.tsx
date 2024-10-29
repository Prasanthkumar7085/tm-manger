import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import React, { Dispatch, SetStateAction, useState } from "react";
import { deleteProjectAPI } from "@/lib/services/users";
import DeleteDialog from "../core/deleteDialog";
import { useLocation } from "@tanstack/react-router";
import { deleteProps } from "@/lib/interfaces";

const DeleteProjects = ({
  del,
  setDel,
  project,
  getAllProjects,
}: deleteProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const { mutate, isPending } = useMutation({
    mutationFn: async (id: number) => {
      try {
        const response = await deleteProjectAPI(id);
        if (response?.status === 200 || response?.status === 201) {
          toast.success(response?.data?.message);
          setDel((prev) => prev + 1);
          setDeleteDialogOpen(false);
          getAllProjects({
            pageIndex: 1,
            pageSize: Number(searchParams.get("page_size")) || 10,
          });
        } else {
          toast.error(response?.data?.message);
        }
      } catch {
        toast.error("An error occurred while deleting the project.");
      }
    },
  });

  const handleDeleteClick = () => {
    mutate(project.id);
  };

  return (
    <>
      <button onClick={() => setDeleteDialogOpen(true)} title="delete">
        <img
          src={"/table/delete.svg"}
          alt="delete"
          className="cursor-pointer"
          height={16}
          width={16}
        />
      </button>

      <DeleteDialog
        openOrNot={deleteDialogOpen}
        onCancelClick={() => setDeleteDialogOpen(false)}
        label="Are you sure you want to delete this project?"
        onOKClick={handleDeleteClick}
        deleteLoading={isPending}
      />
    </>
  );
};

export default DeleteProjects;
