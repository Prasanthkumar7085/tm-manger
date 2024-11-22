import { errPopper } from "@/lib/helpers/errPopper";
import {
  getSingleViewUserAPI,
  updateUserDetailsAPI,
  uploadProfileAPI,
} from "@/lib/services/viewprofile";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "../ui/button";
import LoadingComponent from "../core/LoadingComponent";
import { fileUploadAPI, uploadToS3API } from "@/lib/services/projects";
import { Loader, Pencil } from "lucide-react";

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { isLoading } = useQuery({
    queryKey: ["users", userID, isEditMode],
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setIsUploading(true);
      fileUploadMutation.mutate(file);
    }
  };

  const fileUploadMutation = useMutation({
    mutationFn: async (file: any) => {
      const { data } = await fileUploadAPI({
        file_name: file.name,
        file_type: file.type,
      });
      const { target_url, file_key } = data?.data;

      await uploadToS3(target_url, file);

      return file_key;
    },
    onSuccess: (file_key: string) => {
      setUserData((prev: any) => ({
        ...prev,
        profile_pic: file_key,
      }));
      toast.success("File uploaded successfully.");
      uploadProfileMutation.mutate({ profile_pic: file_key });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to upload file.");
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const uploadToS3 = async (url: string, file: File) => {
    try {
      const response = await uploadToS3API(url, file);
      if (response.status === 200 || response.status === 201) {
        toast.success("File Uploaded Successfully");
      } else {
        throw response;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const uploadProfileMutation = useMutation({
    mutationFn: async (payload: { profile_pic: string }) => {
      try {
        const response = await uploadProfileAPI(userID, payload);
        if (response.data.status === 200 || response.data.status === 201) {
          toast.success("UserProfile updated successfully!");
        } else {
          throw new Error("Failed to upload profile picture.");
        }
      } catch (err) {
        toast.error("Failed to upload profile picture.");
      }
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name == "phone_number") {
      const numericValue = e.target.value.replace(/\D/g, "").slice(0, 10);
      setEditedData((prev: any) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setEditedData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await updateUserDetailsAPI(userID, {
        fname: editedData.fname,
        lname: editedData.lname,
        email: editedData.email,
        phone_number: editedData.phone_number,
        user_type: userType.user_type,
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
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditMode(false);
  };

  return (
    <div className="w-[70%] m-auto relative">
      <div className="rounded-xl bg-white mb-4 shadow-md">
        <h1 className="flex justify-between items-center text-xl border-b-2 px-4 py-2 font-medium text-[#475569]">
          <span>Profile Information</span>
          {isEditMode ? (
            <div>
             <Button variant="secondary" onClick={handleCancel}
                  className="bg-white border-transparent text-[#FF6000] text-sm mr-2 px-8 font-medium hover:bg-transparent hover:text-[#FF6000]">
                Cancel
              </Button>
               <Button  onClick={handleSave}
                   className="bg-[#1B2459] text-white font-medium text-sm hover:bg-[#1B2459] hover:text-white px-8">
                Save
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
          <div>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer relative">
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow"
                  />
                  {isUploading && (
                    <div className="absolute w-24 h-24 inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 rounded-full">
                      <Loader className="text-white w-6 h-6 animate-spin" />
                    </div>
                  )}
                </div>
              ) : (
                <img
                  src={userData.profile_pic}
                  alt="User Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow"
                />
              )}
              <span className="absolute bottom-[-10%] left-[40%] bg-[#1b2459] text-white rounded-full p-1">
                <Pencil className="w-4 h-4" />
              </span>
            </label>
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {userData.fname}
              {userData.lname}
            </h3>
          </div>
        </div>
      </div>
      <div className="rounded-lg bg-white shadow-md">
        <h1 className="text-xl border-b-2 px-4 py-2 font-medium text-[#475569]">
          Personal Information
        </h1>
        <div className="grid p-4 grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-8 text-lg">
          {["fname", "lname", "email", "phone_number"].map((field) => (
            <div key={field}>
              <h3 className="text-sm font-normal text-[#666666]">
                {field == "fname"
                  ? "First Name"
                  : field == "lname"
                    ? "Last Name"
                    : field == "email"
                      ? "Email"
                      : "Phone Number"}
              </h3>
              {isEditMode ? (
                <input
                  type="text"
                  name={field}
                  value={editedData[field]}
                  onChange={handleInputChange}
                  className="border rounded-md p-2 w-full h-[34px] text-sm"
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
      <LoadingComponent loading={isLoading || loading} />
    </div>
  );
}
export default ViewProfile;
