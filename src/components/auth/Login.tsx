import loginBackground from "@/assets/login-bg-image.png";
import LogoPath from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { errPopper } from "@/lib/helpers/errPopper";
import { loginProps } from "@/lib/interfaces";
import { loginAPI } from "@/lib/services/auth";
import { setUserDetails } from "@/redux/Modules/userlogin";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import Cookies from "js-cookie";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface LoginDetails {
  email: string;
  password: string;
}

interface Errors {
  email?: string[];
  password?: string[];
}

const LoginComponent: React.FC = () => {
  const [loginDetails, setLoginDetails] = useState<LoginDetails>({
    email: "",
    password: "",
  });

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [invalidMessages, setInvalidMessages] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate({ from: "/" });

  const { mutate, isError, error } = useMutation({
    mutationFn: async (loginDetails: loginProps) => {
      setLoading(true);
      try {
        const response = await loginAPI(loginDetails);
        if (response?.status === 200 || response?.status === 201) {
          toast.success(response?.data?.message);
          const { data } = response?.data;
          const { access_token, user_details } = data;

          Cookies.set("token", access_token, {
            priority: "High",
          });
          dispatch(setUserDetails(data));
          navigate({
            to: "/dashboard",
          });
        } else if (response?.status === 422) {
          const errData = response?.data?.errData;
          setErrors(errData);
        } else if (response?.status === 401) {
          const inValid = response?.data?.message;
          setInvalidMessages(inValid);
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

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    mutate(loginDetails);
  };

  const togglePasswordVisibility = (): void => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <section
      id="authentication"
      className="login-page relative h-screen flex items-center"
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
              <h1 className="text-xl font-semibold mb-2">Login</h1>
              <p className="leading-tight text-md">
                Your account awaits. Enter your details to get <br /> started!
              </p>
            </div>

            <form action="" onSubmit={handleLogin}>
              <div className="mb-3">
                <div className="relative">
                  <Mail className="absolute left-3 mt-[1px] top-1/2 transform -translate-y-1/2 text-slate-800 w-4" />
                  <Input
                    className="bg-[#E7E7E7] appearance-none block py-1 h-12 text-lg pl-9 focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none placeholder:text-sm placeholder:text-slate-600 border rounded-md text-md"
                    id="email"
                    placeholder="Email"
                    onChange={(e) =>
                      setLoginDetails({
                        ...loginDetails,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                {errors?.email && (
                  <p className="text-xs pt-1 text-red-600">
                    {errors?.email[0]}
                  </p>
                )}
              </div>
              <div>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 mt-[1px] top-1/2 transform -translate-y-1/2 text-slate-800 w-4" />
                  <Input
                    className="bg-[#E7E7E7] appearance-none block py-1 h-12 text-lg pl-9 focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none placeholder:text-sm placeholder:text-slate-600 border rounded-md text-md"
                    id="password"
                    placeholder="Password"
                    type={passwordVisible ? "text" : "password"}
                    onChange={(e) =>
                      setLoginDetails({
                        ...loginDetails,
                        password: e.target.value,
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
                {errors?.password && (
                  <p className="text-xs pt-1 text-red-600">
                    {errors?.password[0]}
                  </p>
                )}
                {invalidMessages && (
                  <p className="text-xs pt-1 text-red-600">{invalidMessages}</p>
                )}
              </div>
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  activeProps={{
                    className: "bg-blue-900 text-white",
                  }}
                  activeOptions={{ exact: true }}
                >
                  <div className="flex flex-col">
                    <span
                      className="text-slate-700 font-medium"
                      style={{ fontSize: "1.2rem" }}
                    >
                      <sub>Forgot Password?</sub>
                    </span>
                  </div>
                </Link>
              </div>

              <Button
                type="submit"
                className="mt-10 text-center bg-custom-gradient text-white w-full font-semibold text-md"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginComponent;
