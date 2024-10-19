import LogoPath from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAPI } from "@/lib/services/auth";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import Cookies from "js-cookie";
import { Eye, EyeOff, Loader2, LockKeyhole, LogIn } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import loginBackground from "@/assets/login-bg-image.png";
import { setUserDetails } from "@/redux/Modules/userlogin";
import { errPopper } from "@/lib/helpers/errPopper";
import Loading from "../core/Loading";
interface loginProps {
  email: string;
  password: string;
}

const LoginComponent = () => {
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate({ from: "/" });

  const { mutate, isError, error } = useMutation({
    mutationFn: async (loginDetails: loginProps) => {
      setLoading(true);
      try {
        const response = await loginAPI(loginDetails);
        if (response?.status === 200 || response?.status === 201) {
          toast.success(response?.data?.message);
          const { data } = response?.data;
          const { access_token } = data;
          const expirationDate = new Date();
          expirationDate.setTime(expirationDate.getTime() + 300 * 10000);
          Cookies.set("token", access_token, {
            priority: "High",
            expires: expirationDate,
          });
          dispatch(setUserDetails(data));
          navigate({
            to: "/dashboard",
          });
        } else if (response?.status === 422) {
          console.log(response);
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
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    mutate(loginDetails);
  };
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
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
        <h1 className="text-3xl font-light">Login</h1>
        <form
          action=""
          className="flex flex-col w-full px-5 space-y-8"
          onSubmit={handleLogin}
        >
          <div className="flex flex-col space-y-1">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                className="appearance-none block py-1 h-12 text-lg pl-10 rounded-none focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none"
                id="email"
                placeholder="Email"
                onChange={(e) =>
                  setLoginDetails({ ...loginDetails, email: e.target.value })
                }
              />
            </div>
            {errors?.email && (
              <p style={{ color: "red" }}>{errors?.email[0]}</p>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                className="appearance-none block py-1 h-12 text-lg pl-10 rounded-none focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none"
                id="password"
                placeholder="Password"
                type={passwordVisible ? "text" : "password"}
                onChange={(e) =>
                  setLoginDetails({ ...loginDetails, password: e.target.value })
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
            {errors?.password && (
              <p style={{ color: "red" }}>{errors?.password[0]}</p>
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
                  className="text-blue-500 hover:text-blue-700"
                  style={{ fontSize: "1.2rem" }}
                >
                  <sub>Forgot Password?</sub>
                </span>
              </div>
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full flex justify-center items-center bg-blue-500 text-white hover:bg-blue-600"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Log In"
            )}
          </Button>
        </form>
        {/* <p className="font-light self-center md:text-xl lg:text-3xl xl:text-base">Don't have an account? <span className="text-yellow-500 cursor-pointer">Register</span></p> */}
      </div>
      {/* <Loading loading={loading} /> */}
    </div>
  );
};
export default LoginComponent;
