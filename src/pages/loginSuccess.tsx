import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { RootState } from "@/redux/rootReducer";
import {
  setIsAuthenticated,
  setUser,
  setLoggedInAt,
  addBookmarkedGig,
  removeBookmarkedGig,
} from "@/redux/authSlice";
import customAxios from "@/lib/customAxios";
import axios from "axios";
import { Loader } from "lucide-react";
import { setTryingToBookmarkId } from "../redux/authFlowSlice";
import { toast } from "sonner";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export default function LoginSuccess() {
  const loggingInFromRoute = useSelector(
    (state: RootState) => state.authFlow.loggingInFromRoute
  );
  const router = useRouter();
  const dispatch = useDispatch();

  const tryingToBookmarkId = useSelector(
    (state: RootState) => state.authFlow.tryingToBookmarkId
  );

  console.log("trying to bookmark sincce thne", tryingToBookmarkId);

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const response = await axios.get("/auth/setAuthenticated", {
          baseURL: `${baseURL}`,
          withCredentials: true,
        });
        const { isAuthenticated, userData } = response.data;

        dispatch(setIsAuthenticated(isAuthenticated));
        dispatch(setUser(userData));
        dispatch(setLoggedInAt(Date.now()));

        if (tryingToBookmarkId !== "") {
          let bookmarkId
          bookmarkId = tryingToBookmarkId.replace(/"/g, ''); //removes strings orelse url is not encoded properly
          const encodedId = encodeURIComponent(bookmarkId);
          const response = await axios.post(
            `${baseURL}/gigs/bookmarkGig/${encodedId}`,
            null,
            {
              baseURL: baseURL, // Set your API base URL, cookies does not work without it
              withCredentials: true, // To let axios send cookies in header
            }
          );
          const data = response.data;
          if (data.message === "Gig Added") {
            dispatch(addBookmarkedGig(data.id));
            console.log("GIG added successfully");
            toast.success('Gig bookmarked successfully')
          } else {
            dispatch(removeBookmarkedGig(data.gigId));
            console.log("GIG removed successfully");
            toast.success('Gig removed successfully')

          }
          dispatch(setTryingToBookmarkId(""));
        }

        // if (loggingInFromRoute) {
        //   router.replace(`${loggingInFromRoute}`);
        // }
      } catch (error) {
        console.error("Failed to fetch authentication data:", error);

        // router.replace("/error");
      } finally {
         router.replace(`${loggingInFromRoute}`);
      }
    };

    fetchAuthData();
  }, []);

  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <Loader />
    </div>
  );
}
