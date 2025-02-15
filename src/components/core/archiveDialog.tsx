import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  import { Loader2 } from "lucide-react";
  
  const ArchiveDialog = ({
    openOrNot,
    label,
    onCancelClick,
    onOKClick,
    deleteLoading,
  }: {
    openOrNot: boolean;
    label: string;
    onCancelClick: () => void;
    onOKClick: () => void;
    deleteLoading: boolean;
  }) => {
    return (
      <AlertDialog open={openOrNot}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>{label}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancelClick}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white"
              onClick={onOKClick}
            >
              {deleteLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Yes! Archive"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  
  export default ArchiveDialog;
  