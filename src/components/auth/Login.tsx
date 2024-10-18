import LogoPath from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAPI } from "@/lib/services/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import Cookies from "js-cookie";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import loginBackground from "@/assets/login-bg-image.png";
interface loginProps {
  email: string;
  password: string;
}

const LoginComponent = () => {
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate({ from: "/" });

  const { mutate, isPending, isError, error, data, isSuccess } = useMutation({
    mutationFn: async (loginDetails: loginProps) => {
      return await loginAPI(loginDetails);
    },
    onSuccess: (response: any) => {
      console.log(response, "res");
      const { data } = response?.data;
      const { access_token } = data;
      // const details: any = jwt.decode(access_token);
      const exp = new Date().getTime() + 10000;

      // Store the token in cookies
      Cookies.set("token", access_token, {
        priority: "High",
        expires: exp,
      });

      // dispatch(setUserDetails(data));
      toast.success("Logged in Successfully!");
      navigate({
        to: `/dashboard`,
      });
    },
    onError: (error: any) => {
      if (error?.response?.status === 422) {
        setErrors(
          error?.response?.data?.errors || ["Invalid login credentials."]
        );
      } else {
      }
    },
  });

  const handleLogin = async (e: any) => {
    // e.preventDefault();
    navigate({
      to: "/dashboard",
    });

    // setErrors([]);
    // mutate(loginDetails);
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
            <Label className="font-normal uppercase text-lg" htmlFor="email">
              Email
            </Label>
            <Input
              className="appearance-none block py-1 h-12 text-lg rounded-none focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none"
              id="email"
              placeholder="Email"
              onChange={(e) =>
                // setLoginDetails({ ...loginDetails, email: e.target.value })
                ""
              }
            />
          </div>
          <div className="flex flex-col space-y-1">
            <Label className="font-normal uppercase text-lg" htmlFor="password">
              Password
            </Label>
            <Input
              className="appearance-none block py-1 h-12 text-lg rounded-none focus:outline-none focus:border-gray-500 focus-visible:ring-0 focus-visible:shadow-none"
              id="password"
              placeholder="Password"
              type="password"
              onChange={(e) =>
                // setLoginDetails({ ...loginDetails, password: e.target.value })
                ""
              }
            />
          </div>
          <div className="self-end font-light text-md text-red-500 underline cursor-pointer">
            Forgot Password?
          </div>
          <Button type="submit" className="btn-primary w-full text-xl">
            Login <LogIn strokeWidth={1} className="ml-2" />
          </Button>
        </form>
        {/* <p className="font-light self-center md:text-xl lg:text-3xl xl:text-base">Don't have an account? <span className="text-yellow-500 cursor-pointer">Register</span></p> */}
      </div>
      {/* <Loading loading={loading} /> */}
    </div>
  );
};
export default LoginComponent;
