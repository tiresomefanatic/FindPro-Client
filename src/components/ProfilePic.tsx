// ProfilePicture.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { User } from "lucide-react";

export default function ProfilePicture() {
  const userProfilePic = useSelector(
    (state: RootState) => state.auth.user?.profilePic
  );

  return (
    <Avatar className="h-12 w-12 rounded-full bg-gray-300">
      <AvatarImage src={userProfilePic} alt="Profile Picture" />
      <AvatarFallback>
        <User className="w-9 h-9 border rounded-full bg-gray-100" />
      </AvatarFallback>
    </Avatar>
  );
}