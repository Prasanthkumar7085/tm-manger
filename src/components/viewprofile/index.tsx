import { errPopper } from "@/lib/helpers/errPopper";
import {
  getSingleViewUserAPI,
  uploadProfileAPI,
} from "@/lib/services/viewprofile";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { fileUploadAPI, uploadToS3API } from "@/lib/services/projects";
import { toast } from "sonner";
import { Pencil, Loader } from "lucide-react"; // Import Loader icon
import { CirclePlus, Plus, UserRoundPlus, X } from "lucide-react";

function ViewProfile() {
  const userID = useSelector(
    (state: any) => state.auth?.user?.user_details?.id
  );

  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<any>("");
  const [userData, setUserData] = useState<any>({
    fname: "",
    lname: "",
    email: "",
    phone_number: "",
    profile_pic: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { isLoading, isError, error, data, isFetching } = useQuery({
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
          setUserType({
            user_type: data?.user_type,
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

  const handleRemoveFile = () => {
    setPreviewUrl("profile-picture.png");
    setUserData((prev: any) => ({
      ...prev,
      profile_pic: "",
    }));
    // uploadProfileMutation.mutate({ profile_pic: "" });
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

  return (
    <div className="w-[70%] m-auto">
      <div className=" rounded-xl bg-white mb-4 shadow-md">
        <h1 className="text-xl border-b-2 px-4 py-2 font-medium text-[#475569]">Profile Information</h1>
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
                  {/* <button
                    onClick={handleRemoveFile}
                    className="absolute top-0 right-0 bg-red-500 p-1 rounded-full border border-white"
                  >
                    <X className="text-white w-4 h-4" />
                  </button> */}
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
              {/* <button
                onClick={handleRemoveFile}
                className="absolute top-0 right-0 bg-red-500 p-1 rounded-full border border-white"
              >
                <X className="text-white w-4 h-4" />
              </button> */}
            </label>
          </div>
          <div>
            <h3 className="text-lg font-semibold">User Title</h3>
            <p className="text-gray-600">Details about the user</p>
          </div>
        </div>
      </div>
      <div className="  rounded-lg bg-white shadow-md">
        <h1 className="text-xl border-b-2 px-4 py-2 font-medium text-[#475569]">Personal Information</h1>
        <div className="grid p-4 grid-cols-1 md:grid-cols-2 gap-y-8 text-lg">
          <div>
            <h3 className="text-sm font-normal text-[#666666]">First Name</h3>
            <p className="text-base font-medium text-[#000000]">
              {userData.fname}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-normal text-[#666666]">Last Name</h3>
            <p className="text-base font-medium text-[#000000]">
              {userData.lname}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-normal text-[#666666]"> Email </h3>

            <p className="text-base font-medium text-[#000000]">
              {userData.email}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-normal text-[#666666]">
              Phone Number
            </h3>

            <p className="text-base font-medium text-[#000000]">
              {userData.phone_number}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-normal text-[#666666]">User Type</h3>
            <p className="text-base font-medium text-[#000000]">
              {userType.user_type}
            </p>
          </div>
        </div>
      </div>
    </div>

    // type-1

    // <div className="w-[90%] m-auto rounded-xl bg-white mb-4 shadow-md ">
    //   <div>
    //     <h1 className="text-xl border-b-2 px-4 py-2 font-medium text-[#475569]">
    //       Profile Information
    //     </h1>
    //     <div className="grid grid-cols-[30%,70%] items-start ">
    //       <div className="flex flex-col  p-4 items-center gap-y-6 relative ">
    //         <div>
    //           <input
    //             id="file-upload"
    //             type="file"
    //             accept="image/*"
    //             onChange={handleFileChange}
    //             className="hidden"
    //           />
    //           <label htmlFor="file-upload" className="cursor-pointer relative">
    //             {previewUrl ? (
    //               <div className="relative">
    //                 <img
    //                   src={previewUrl}
    //                   alt="Preview"
    //                   className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow"
    //                 />
    //                 {isUploading && (
    //                   <div className="absolute w-24 h-24 inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 rounded-full">
    //                     <Loader className="text-white w-6 h-6 animate-spin" />
    //                   </div>
    //                 )}
    //                 {/* <button
    //           onClick={handleRemoveFile}
    //           className="absolute top-0 right-0 bg-red-500 p-1 rounded-full border border-white"
    //         >
    //           <X className="text-white w-4 h-4" />
    //         </button> */}
    //               </div>
    //             ) : (
    //               <img
    //                 src={userData.profile_pic}
    //                 alt="User Profile"
    //                 className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow"
    //               />
    //             )}
    //             <span className="absolute bottom-[-10%] left-[40%] bg-[#1b2459] text-white rounded-full p-1">
    //               <Pencil className="w-4 h-4" />
    //             </span>
    //             {/* <button
    //       onClick={handleRemoveFile}
    //       className="absolute top-0 right-0 bg-red-500 p-1 rounded-full border border-white"
    //     >
    //       <X className="text-white w-4 h-4" />
    //     </button> */}
    //           </label>
    //         </div>
    //         <div className="text-center">
    //           <h3 className="text-lg font-semibold">User Title</h3>
    //           <p className="text-gray-600">Details about the user</p>
    //         </div>
    //       </div>
    //       <div className="grid p-4 grid-cols-1 md:grid-cols-2 gap-y-8 text-lg border-l-2 pl-8">
    //         <div>
    //           <h3 className="text-sm font-normal text-[#666666]">First Name</h3>
    //           <p className="text-base font-medium text-[#000000]">
    //             {userData.fname}
    //           </p>
    //         </div>
    //         <div>
    //           <h3 className="text-sm font-normal text-[#666666]">Last Name</h3>
    //           <p className="text-base font-medium text-[#000000]">
    //             {userData.lname}
    //           </p>
    //         </div>
    //         <div>
    //           <h3 className="text-sm font-normal text-[#666666]"> Email </h3>

    //           <p className="text-base font-medium text-[#000000]">
    //             {userData.email}
    //           </p>
    //         </div>
    //         <div>
    //           <h3 className="text-sm font-normal text-[#666666]">
    //             Phone Number
    //           </h3>

    //           <p className="text-base font-medium text-[#000000]">
    //             {userData.phone_number}
    //           </p>
    //         </div>
    //         <div>
    //           <h3 className="text-sm font-normal text-[#666666]">User Type</h3>
    //           <p className="text-base font-medium text-[#000000]">
    //             {userType.user_type}
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>

  );
}

export default ViewProfile;
