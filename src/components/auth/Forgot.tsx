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
    <section
      id="authentication"
      className="forgot-page relative h-screen flex items-center"
    >
      <div className="company-logo absolute top-7 left-7">
        <img src={LogoPath} alt="logo" className="w-[200px] mx-auto" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
        <div className="left-part">
          <img src={loginBackground} alt="logo" className="w-[75%] mx-auto" />
        </div>
        <div className="right-part m-auto">
          <div className="login-card w-[420px] shadow-2xl border p-6 rounded-xl">
            <div className="top mb-7">
              <h1 className="text-xl font-semibold mb-2">Forgot Password</h1>
              <p className="leading-tight text-md">
                Enter your email address and we’ll send you a <br /> recovery
                link.
              </p>
            </div>

            <form className="w-full" onSubmit={handleSubmit}>
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 mt-[1px] top-1/2 transform -translate-y-1/2 text-slate-800 w-4" />
                  <Input
                    className="bg-[#E7E7E7] appearance-none block py-1 h-12 text-lg pl-9 focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none placeholder:text-sm placeholder:text-slate-600 border rounded-md text-md"
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

              <div className="mt-10">
                <Button
                  type="submit"
                  className="text-center bg-custom-gradient text-white w-full font-semibold text-md"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    "Send recovery email"
                  )}
                </Button>
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={handleBack}
                  className="font-medium  text-sm text-black bg-transparent hover:bg-transparent hover:text-black"
                >
                  Back to Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
export default ForgotComponent;
