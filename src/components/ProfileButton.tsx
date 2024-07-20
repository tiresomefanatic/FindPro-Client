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
import ProfilePic from "./ProfilePic";
import { Button } from "./ui/button";
import { setLoggingInFromRoute } from "@/redux/authFlowSlice";
import customAxios from "@/lib/customAxios";
import { clearAuthState } from "@/redux/authSlice";
import { User, UserCog, File, Bookmark, LogOut } from 'lucide-react';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

interface ProfileButtonProps {
  isAuthenticated: boolean;
}

const ProfileButton = ({ isAuthenticated }: ProfileButtonProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleEditProfileClick = () => {
    if (user) {
      router.push(`/editProfile?id=${user._id}`);
    }
  };

  const handleProfileClick = () => {
    if (user) {
      router.push(`/profile?id=${user._id}`);
    }
  };

  const handleMyGigsClick = () => {
    if (user) {
      router.push(`/myGigs`);
    }
  };

  const handleSavedGigsClick = () => {
    if (user) {
      router.push(`/savedGigs`);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await customAxios.post(`${baseURL}/auth/logout`, null, {
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
    router.push(`/editProfile?id=${user._id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ProfilePic />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={handleProfileClick}
        >
          <User className="mr-2 h-4 w-4" />
          My Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={handleEditProfileClick}
        >
          <UserCog className="mr-2 h-4 w-4" />
          Edit Profile
        </DropdownMenuItem>
        {user?.isSeller && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleMyGigsClick}
          >
            <File className="mr-2 h-4 w-4" />
            My Gigs
          </DropdownMenuItem>
        )}
        {!user?.isSeller && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleBecomeSellerClick}
          >
            <UserCog className="mr-2 h-4 w-4" />
            Become a Seller
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={handleSavedGigsClick}
        >
          <Bookmark className="mr-2 h-4 w-4" />
          Saved Gigs
        </DropdownMenuItem>
        {isAuthenticated && (
          <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileButton;