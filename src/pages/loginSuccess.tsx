import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { RootState } from "@/redux/rootReducer";
import { setIsAuthenticated, setUser, setLoggedInAt } from "@/redux/authSlice";
import customAxios from "@/lib/customAxios";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export default function LoginSuccess() {
  const loggingInFromRoute = useSelector((state: RootState) => state.authFlow.loggingInFromRoute);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const response = await customAxios.get("/auth/setAuthenticated");
        const { isAuthenticated, userData } = response.data;

        dispatch(setIsAuthenticated(isAuthenticated));
        dispatch(setUser(userData));
        dispatch(setLoggedInAt(Date.now()));

        router.replace(loggingInFromRoute || '/');
      } catch (error) {
        console.error("Failed to fetch authentication data:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            toast.error("Authentication failed. Please log in again.");
          } else if (error.response?.status === 403) {
            toast.error("You don't have permission to access this resource.");
          } else {
            toast.error("An error occurred while logging in. Please try again.");
          }
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
        router.replace("/");
      }
    };

    fetchAuthData();
  }, [dispatch, router, loggingInFromRoute]);

  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <Loader />
    </div>
  );
}