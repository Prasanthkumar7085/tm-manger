import { errPopper } from "@/lib/helpers/errPopper";
import { getSingleViewUserAPI, uploadProfileAPI } from "@/lib/services/viewprofile";
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
    password: "",
    phone_number: "",
    profile_pic: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
      fileUploadMutation.mutate(file);
    } else {
      setPreviewUrl(null);
    }
  };

 

  const fileUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const { data } = await fileUploadAPI({
        file_name: file.name,
        file_type: file.type,
      });
      const { target_url, file_key } = data?.data;

      await uploadToS3(target_url, file);

      return file_key;
    },
    onSuccess: (file_key:string) => {
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
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Details about the user</CardDescription>
      </CardHeader>
      <CardContent>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
           {previewUrl ? (
            <img src={previewUrl} alt="Preview" height={300} width={300} />
          ) : (
            <img
              src={"/abstract-user-flat-4.svg"}
              alt="User Profile"
              height={300}
              width={300}
            />
          )}
        </label>
        <div>
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
      <CardFooter></CardFooter>
    </Card>
  );
}
export default ViewProfile;
