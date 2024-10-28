import { SheetDemo } from "@/components/core/CommonComponents/Sheet";
import { MemberPayload } from "@/lib/interfaces";
import { addMembersAPI } from "@/lib/services/projects/members";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

interface AddMemberProps {
  addNewMember: (newMember: { value: number; label: string }) => any; // Change type to match
}
const AddMember = ({ addNewMember }: AddMemberProps) => {
  const { projectId } = useParams({ strict: false });
  const [memberData, setMemberData] = useState<MemberPayload>({
    user_id: 0, // user_id is a number
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
          value: memberData.user_id, // user_id is passed as a number
          label: memberData.role,
        });
        setMemberData({ user_id: 0, role: "" }); // Reset state
      }
      if (response?.status === 422) {
        toast.error(response?.data?.message);
      }
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Convert user_id to number
    if (name === "user_id") {
      setMemberData({
        ...memberData,
        [name]: Number(value), // Ensure the input is converted to a number
      });
    } else {
      setMemberData({
        ...memberData,
        [name]: value,
      });
    }
  };

  const addMember = () => {
    if (memberData.user_id <= 0) {
      toast.error("User ID must be a valid number.");
      return;
    }
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
