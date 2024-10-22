import { SheetDemo } from "@/components/core/CommonComponents/Sheet";
import { addMembersAPI } from "@/lib/services/projects/members";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

interface MemberPayload {
  user_id: string;
  role: string;
}

interface AddMemberProps {
  addNewMember: (newMember: { value: string; label: string }) => void;
}

const AddMember = ({ addNewMember }: AddMemberProps) => {
  const { projectId } = useParams({ strict: false });
  const [memberData, setMemberData] = useState<MemberPayload>({
    user_id: "",
    role: "",
  });

  const { mutate } = useMutation({
    mutationFn: async (payload: MemberPayload) => {
      return await addMembersAPI(projectId, payload);
    },
    onSuccess: (response: any) => {
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        addNewMember({
          value: memberData.user_id,
          label: memberData.role,
        });
      }
      if (response?.status === 422) {
        toast.error(response?.data?.message);
      }
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMemberData({
      ...memberData,
      [name]: value,
    });
  };

  const addMember = () => {
    mutate(memberData);
  };

  return (
    <SheetDemo
      label="Add Member"
      sheetTitle="Add Member"
      onOKClick={addMember}
      extraField="Password"
      memberData={memberData}
      handleInputChange={handleInputChange}
    />
  );
};

export default AddMember;
