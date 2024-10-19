import { SheetDemo } from "@/components/core/CommonComponents/Sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { addProjectAPI } from "@/lib/services/projects";
import { addMembersAPI } from "@/lib/services/projects/members";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Sheet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
interface MemberPayload {
  user_id: any;
  role: string;
}

const AddMember = () => {
  const navigate = useNavigate();
  const { projectId } = useParams({ strict: false });
  const [memberData, setMemberData] = useState<any>({});
  const [errorMessages, setErrorMessages] = useState<any>({});
  const { mutate, isPending, isError, error, data, isSuccess } = useMutation({
    mutationFn: async (payload: MemberPayload) => {
      return await addMembersAPI(projectId, payload);
    },
    onSuccess: (response: any) => {
      if (response?.status == 200 || response?.status == 201) {
        toast.success(response?.data?.message);
      }
      if (response?.status == 422) {
        setErrorMessages(response?.data?.errData || [""]);
        toast.error(response?.data?.message);
      }
    },
  });
  const addMember = () => {
    const payload: MemberPayload = {
      user_id: memberData?.user_id,
      role: memberData?.role,
    };
    mutate(payload);
  };

  const handleInputChange = (e: any) => {
    let { name, value } = e.target;
    const updatedValue = value
      .replace(/[^a-zA-Z\s]/g, "")
      .replace(/^\s+/g, "")
      .replace(/\s{2,}/g, " ");
    setMemberData({
      ...memberData,
      [name]: updatedValue,
    });
  };
  return (
    <div>
      <SheetDemo
        // drawerOpen={true}
        label="Add Member"
        sheetTitle="Add Member"
        onOKClick={addMember}
        extraField={"password"}
        onSubmit={"Add"}
      />
    </div>
  );
};
export default AddMember;
