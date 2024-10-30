import { errPopper } from "@/lib/helpers/errPopper";
import { getSingleViewUserAPI } from "@/lib/services/viewprofile";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

function ViewProfile() {
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<any>("");
  const [selectedId, setSelectedId] = useState();
  const [userData, setUserData] = useState<any>({
    fname: "",
    lname: "",
    email: "",
    password: "",
    phone_number: "",
    profile_pic: "",
  });

  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["users",],
    queryFn: async () => {
      setLoading(true);
      try {
        const response = await getSingleViewUserAPI();
        if (response.success) {
          const data = response?.data?.data;
          setUserData({
            fname: data?.fname,
            lname: data?.lname,
            email: data?.email,
            phone_number: data?.phone_number,
            profile_pic: data?.profile_pic,
          });
          setUserType(data?.user_type);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Details about the user</CardDescription>
      </CardHeader>
      <CardContent>
      {userData.profile_pic ? (
      <img
        src={userData.profile_pic}
        alt="User Profile"
        height={500}
        width={500}
      />
    ) : (
      <img
        src="/abstract-user-flat-4.svg"
        alt="User Profile"
        height={300}
        width={300}
      />
    )}
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
            <strong>User Type:</strong> {userType}
          </p>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
export default ViewProfile;
