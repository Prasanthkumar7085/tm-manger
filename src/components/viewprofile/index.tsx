import { errPopper } from "@/lib/helpers/errPopper";
import {
  getSingleViewUserAPI,
  uploadProfileAPI,
} from "@/lib/services/viewprofile";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useSelector } from "react-redux";
import { fileUploadAPI, uploadToS3API } from "@/lib/services/projects";
import { toast } from "sonner";
import { CirclePlus, Pencil, Plus, UserRoundPlus, X } from "lucide-react";

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
  const [isUploading, setIsUploading] = useState(false); // State for upload loading

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
    setPreviewUrl(null);
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
      setIsUploading(false); // Reset uploading state after mutation completes
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
    <Card className="flex flex-col md:flex-row items-center p-4 shadow-lg rounded-lg bg-white">
      <CardHeader className="flex-none mb-4 md:mb-0 md:mr-4 relative">
        <CardTitle className="text-xl font-semibold">
          Profile Information
        </CardTitle>
        <CardDescription className="text-gray-600">
          Details about the user
        </CardDescription>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="relative w-32 h-32 flex items-center justify-center bg-gray-300 rounded-full">
            {previewUrl || userData.profile_pic ? (
              <div className="relative">
                <img
                  src={previewUrl || userData.profile_pic}
                  alt="Profile"
                  className="w-32 h-32 object-cover rounded-full"
                />
                <button
                  onClick={handleRemoveFile}
                  className="absolute top-0 right-0 bg-red-500 p-1 rounded-full border"
                >
                  <X className="text-white w-4 h-4" />
                </button>
                <span className="absolute bottom-2 right-2 bg-blue-800 text-white text-xs rounded-full p-2">
                  <Pencil className="w-4 h-4" />
                </span>
              </div>
            ) : (
              <span className="text-gray-700 text-7xl relative">
                👤
                <CirclePlus className="absolute -bottom-0.29 right-0.5 text-gray-500 w-11 h-11"/>
              </span>
            )}
          </div>
        </label>
      </CardHeader>
      <CardContent className="flex flex-row items-center space-x-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
          <p>
            <strong>First Name:</strong> {userData.fname}
          </p>
          <p>
            <strong>Last Name:</strong> {userData.lname}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Phone Number:</strong> {userData.phone_number}
          </p>
          <p>
            <strong>User Type:</strong> {userType.user_type}
          </p>
        </div>
      </CardContent>
      <CardFooter className="mt-4 md:mt-0"></CardFooter>
    </Card>
  );
}

export default ViewProfile;
