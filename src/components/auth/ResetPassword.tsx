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
          <div className="flex flex-col space-y-6">
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                className="appearance-none block py-1 h-12 text-lg pl-10 rounded-none focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none"
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
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {passwordVisible ? <Eye /> : <EyeOff />}
              </button>
            </div>
            {errors?.new_password && (
              <p style={{ color: "red" }}>{errors?.new_password[0]}</p>
            )}

            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                className="appearance-none block py-1 h-12 text-lg pl-10 rounded-none focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none"
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
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {resetpasswordVisible ? <Eye /> : <EyeOff />}
              </button>
            </div>
            {errors?.confirm_new_password && (
              <p style={{ color: "red" }}>{errors?.confirm_new_password[0]}</p>
            )}
          </div>

          <div className="mt-10">
            <ul>
              <li className="mb-4" style={{ lineHeight: "1.2" }}>
                • New password must be at least 6 characters long
              </li>
            </ul>
            <Button
              type="submit"
              className="w-full flex justify-center items-center bg-blue-500 text-white hover:bg-blue-600"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                "Recover Account"
              )}
            </Button>
          </div>
        </form>
      </div>
      {/* <Loading loading={loading} /> */}
    </div>
  );
}

export default ResetPassword;
