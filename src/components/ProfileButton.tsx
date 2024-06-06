import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import ProfilePic from "./ProfilePic";
import { Button } from "./ui/button";
import { setLoggingInFromRoute } from "@/redux/authFlowSlice";
import ShinyButton from "./ui/ShinyButton";
import customAxios from "@/lib/customAxios";
import { clearAuthState } from "@/redux/authSlice";

interface ProfileButtonProps {
  isAuthenticated: boolean;
}

const ProfileButton = ({ isAuthenticated }: ProfileButtonProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleProfileClick = () => {
    if (user) {
      router.push(`/editProfile?id=${user._id}`);
    }
  };

  const handleMyGigsClick = () => {
    if (user) {
      router.push(`/myGigs`);
    }
  };

  const handleGoogleLogin = () => {
    dispatch(setLoggingInFromRoute(router.asPath));
    router.push(`http://localhost:8080/auth/google-login`);
  };

  const handleLogout = async () => {
    try {
      const response = await customAxios.post("http://localhost:8080/auth/logout", null, {
        withCredentials: true,
      });

      if (response.data.message === "Logout successful") {
        dispatch(clearAuthState());
        router.push("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleBecomeSellerClick = () => {
    // Add logic to handle becoming a seller
    // For example, navigate to a page where the user can set up their seller profile
    router.push(`/editProfile?id=${user._id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ProfilePic />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {user?.isSeller ? (
          <>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleProfileClick}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleMyGigsClick}
            >
              My Gigs
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        ) : (
          <>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleBecomeSellerClick}
            >
              <ShinyButton text="Become a Seller" />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem className="cursor-pointer">
          Saved Gigs
        </DropdownMenuItem>
        {isAuthenticated && (
          <DropdownMenuItem className="cursor-pointer"
          onClick={handleLogout}
          >
            Log Out
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileButton;
