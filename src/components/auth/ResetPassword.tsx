import LogoPath from "@/assets/logo.svg";
import { errPopper } from "@/lib/helpers/errPopper";
import { resetPasswordAPI } from "@/lib/services/auth";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import loginBackground from "@/assets/login-bg-image.png";
import { resetProps } from "@/lib/interfaces";

function ResetPassword() {
  const [resetDetails, setResetDetails] = useState({
    new_password: "",
    confirm_new_password: "",
    reset_password_token: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [resetpasswordVisible, setResetPasswordVisible] = useState(false);
  const navigate = useNavigate({ from: "/" });
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");
  const { mutate, isError, error } = useMutation({
    mutationFn: async (resetDetails: resetProps) => {
      setLoading(true);
      try {
        const payload = {
          ...resetDetails,
          reset_password_token: code ? code : "",
        };
        const response = await resetPasswordAPI(payload);
        if (response?.status === 200 || response?.status === 201) {
          toast.success(response?.data?.message);
          navigate({
            to: "/",
          });
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
    mutate(resetDetails);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleResetPasswordVisibility = () => {
    setResetPasswordVisible(!resetpasswordVisible);
  };

  return (
    <section
      id="authentication"
      className="reset-password=page relative h-screen flex items-center"
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
              <h1 className="text-xl font-semibold mb-2">Reset Password</h1>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <div className="relative">
                  <LockKeyhole className="absolute left-3 mt-[1px] top-1/2 transform -translate-y-1/2 text-slate-800 w-4" />
                  <Input
                    className="bg-[#E7E7E7] appearance-none block py-1 h-12 text-lg pl-9 focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none placeholder:text-sm placeholder:text-slate-600 border rounded-md text-md"
                    id="password"
                    placeholder="New Password"
                    style={{
                      fontFamily: "inherit",
                      paddingRight: "2.5rem",
                    }}
                    type={passwordVisible ? "text" : "password"}
                    onChange={(e) =>
                      setResetDetails({
                        ...resetDetails,
                        new_password: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-800"
                  >
                    {passwordVisible ? <Eye /> : <EyeOff />}
                  </button>
                </div>
                {errors?.new_password && (
                  <p className="text-xs pt-1 text-red-600">
                    {errors?.new_password[0]}
                  </p>
                )}
              </div>
              <div>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 mt-[1px] top-1/2 transform -translate-y-1/2 text-slate-800 w-4" />
                  <Input
                    className="bg-[#E7E7E7] appearance-none block py-1 h-12 text-lg pl-9 focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none placeholder:text-sm placeholder:text-slate-600 border rounded-md text-md"
                    id="password"
                    placeholder="Re-Enter Password"
                    style={{
                      fontFamily: "inherit",
                      paddingRight: "2.5rem",
                    }}
                    type={resetpasswordVisible ? "text" : "password"}
                    onChange={(e) =>
                      setResetDetails({
                        ...resetDetails,
                        confirm_new_password: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={toggleResetPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-800"
                  >
                    {resetpasswordVisible ? <Eye /> : <EyeOff />}
                  </button>
                </div>
                {errors?.confirm_new_password && (
                  <p className="text-xs pt-1 text-red-600">
                    {errors?.confirm_new_password[0]}
                  </p>
                )}
              </div>
              <div>
                <p className="my-8" style={{ lineHeight: "1.2" }}>
                  • New password must be at least 6 characters long
                </p>
              </div>
              <Button
                type="submit"
                className="text-center bg-custom-gradient text-white w-full font-semibold text-md"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  "Recover Account"
                )}
              </Button>
            </form>
          </div>
        </div>
        {/* <Loading loading={loading} /> */}
      </div>
    </section>
  );
}

export default ResetPassword;
