import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { RootState } from "@/redux/rootReducer";
import { setIsAuthenticated, setUser, setLoggedInAt, setAccessToken } from "@/redux/authSlice";
import customAxios from "@/lib/customAxios";
import { Loader } from "lucide-react";
import { toast } from "sonner";

export default function LoginSuccess() {
  const loggingInFromRoute = useSelector((state: RootState) => state.authFlow.loggingInFromRoute);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        console.log("Router query:", router.query);
        console.log("Full URL:", window.location.href);

        // Get the access token from the URL
        const { accessToken } = router.query;

        console.log("Access token from query:", accessToken);

        if (!accessToken || typeof accessToken !== 'string') {
          throw new Error('No access token provided from loginsuccess page');
        }

        // Store the access token in Redux
        dispatch(setAccessToken(accessToken));

        // Use the access token to fetch user data
        const response = await customAxios.get("/auth/setAuthenticated");
        const { isAuthenticated, userData } = response.data;

        dispatch(setIsAuthenticated(isAuthenticated));
        dispatch(setUser(userData));
        dispatch(setLoggedInAt(Date.now()));

        router.replace(loggingInFromRoute || '/');
      } catch (error) {
        console.error("Failed to fetch authentication data:", error);
        if (error instanceof Error) {
          if (error.message === 'No access token provided') {
            toast.error("Authentication failed: No access token provided.");
          } else {
            toast.error(`An unexpected error occurred: ${error.message}`);
          }
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
        router.replace("/login");
      }
    };

    if (router.isReady) {
      fetchAuthData();
    }
  }, [dispatch, router, loggingInFromRoute]);

  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <Loader />
    </div>
  );
}