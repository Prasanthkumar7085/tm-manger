import LogoPath from "@/assets/logo.svg";
import { errPopper } from "@/lib/helpers/errPopper";
import { forgotAPI } from "@/lib/services/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Mail } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import loginBackground from "@/assets/login-bg-image.png";

interface loginProps {
  email: string;
}

function ForgotComponent() {
  const [loading, setLoading] = useState(false);
  const [forgotDetails, setForgotDetails] = useState({ email: "" });
  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate();
  const { mutate, isError, error } = useMutation({
    mutationFn: async (forgotDetails: loginProps) => {
      setLoading(true);
      try {
        const response = await forgotAPI(forgotDetails);
        if (response?.status === 200 || response?.status === 201) {
          toast.success(response?.data?.message);
          const { data } = response?.data;
        } else if (response?.status === 422) {
          const errData = response?.data?.errData;
          setErrors(errData);
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    mutate(forgotDetails);
  };
  const handleBack = async () => {
    navigate({
      to: "/",
    });
  };

  return (
    <div className="flex justify-center items-center h-screen  mx-auto p-20 bg-white">
      <div className="w-[60%] h-full py-10">
        <img
          src={loginBackground}
          alt="logo"
          className="w-[90%] mx-auto mt-2"
        />
      </div>
      <div className="w-[40%] h-full border flex flex-col justify-center items-center space-y-8 relative ml-[-20px] bg-white shadow-xl p-8">
        <div>
          <img
            src={LogoPath}
            alt="logo"
            className="w-[200px] mx-auto animate-in zoom-in-0 duration-1000"
          />
        </div>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-1 w-full">
            <h3 className="mb-2" style={{ lineHeight: "1.2" }}>
              Forgot your account’s password? <br />
              Enter your email address and we’ll send you a recovery link.
            </h3>
            <div className="flex flex-col space-y-1">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  className="appearance-none block py-1 h-12 text-lg pl-10 rounded-none focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none"
                  id="email"
                  placeholder="Email"
                  onChange={(e) =>
                    setForgotDetails({
                      ...forgotDetails,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              {errors?.email && (
                <p style={{ color: "red" }}>{errors?.email[0]}</p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <Button
              type="submit"
              className="w-full flex justify-center items-center bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition duration-150"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                "Send recovery email"
              )}
            </Button>
          </div>
          <div className="mt-4">
            <Button
              type="button"
              onClick={handleBack}
              className="w-full flex justify-center items-center bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition duration-150"
            >
              Back
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ForgotComponent;
