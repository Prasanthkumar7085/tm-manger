import { errPopper } from "@/lib/helpers/errPopper";
import {
  getSingleViewUserAPI,
  updateUserDetailsAPI,
} from "@/lib/services/viewprofile";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "../ui/button";

function ViewProfile() {
  const userID = useSelector(
    (state: any) => state.auth?.user?.user_details?.id
  );

  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userType, setUserType] = useState<any>("");
  const [userData, setUserData] = useState<any>({
    fname: "",
    lname: "",
    email: "",
    phone_number: "",
    profile_pic: "",
  });
  const [editedData, setEditedData] = useState(userData);

  const { isLoading } = useQuery({
    queryKey: ["users", userID],
    queryFn: async () => {
      setLoading(true);
      try {
        const response = await getSingleViewUserAPI(userID);
        if (response.success) {
          const data = response?.data?.data;
          setUserData({
            fname: data?.fname,
            lname: data?.lname,
            email: data?.email,
            phone_number: data?.phone_number,
            profile_pic: data?.profile_pic,
          });
          setEditedData({
            fname: data?.fname,
            lname: data?.lname,
            email: data?.email,
            phone_number: data?.phone_number,
            profile_pic:data?.profile_pic,
          });
          setUserType({
            user_type:"admin",
          });
        } else {
          throw response;
        }
      } catch (errData) {
        console.error(errData);
        errPopper(errData);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // setIsLoading(true);
    try {
      const response = await updateUserDetailsAPI(userID,{
        fname: userData.fname,
        lname: userData.lname,
        email: userData.email,
        profile_pic:userData.profile_pic,
        phone_number: userData.phone_number,
        user_type:"admin", 
      });
      if (response?.success) {
        toast.success("Profile updated successfully!");
        setUserData(editedData);
        setIsEditMode(false);
      } else {
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile.");
    } finally {
      // setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditMode(false);
  };

  return (
    <div className="w-[70%] m-auto">
      <div className="rounded-xl bg-white mb-4 shadow-md">
        <h1 className="flex justify-between items-center text-xl border-b-2 px-4 py-2 font-medium text-[#475569]">
          <span>Profile Information</span>
          {isEditMode ? (
           <div>
           <Button className="mr-2" onClick={handleSave}>
               Save
               </Button>
           <Button variant="secondary" onClick={handleCancel}>
                Cancel
               </Button>
           </div>
            ) : ( 
          <Button
            className="font-normal text-sm"
            variant="add"
            size="DefaultButton"
             onClick={() => setIsEditMode(true)}
          >
            Edit Profile
          </Button>
           )}
        </h1>
        <div className="flex p-4 items-center gap-x-6 mb-4 pb-6 relative">
          {/* Profile Picture */}
          <div>
            <img
              src={userData.profile_pic || "profile-picture.png"}
              alt="User Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {userData.fname} {userData.lname}
            </h3>
          </div>
        </div>
      </div>
      <div className="rounded-lg bg-white shadow-md">
        <h1 className="text-xl border-b-2 px-4 py-2 font-medium text-[#475569]">
          Personal Information
        </h1>
        <div className="grid p-4 grid-cols-1 md:grid-cols-2 gap-y-8 text-lg">
          {["fname", "lname", "email", "phone_number"].map((field) => (
            <div key={field}>
              <h3 className="text-sm font-normal text-[#666666]">
                {field.replace("_", " ").toUpperCase()}
              </h3>
              {isEditMode ? (
                <input
                  type="text"
                  name={field}
                  value={editedData[field]}
                  onChange={handleInputChange}
                  className="border rounded-md p-2 w-full"
                />
              ) : (
                <p className="text-base font-medium text-[#000000]">
                  {userData[field] || "--"}
                </p>
              )}
            </div>
          ))}
          <div>
            <h3 className="text-sm font-normal text-[#666666]">User Type</h3>
            <p className="text-base font-medium text-[#000000]">
              {userType.user_type}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ViewProfile;
