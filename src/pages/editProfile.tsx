import { useRouter } from "next/router";
import ProfileForm from "../components/ProfileForm";
import useAuth from "@/lib/useAuth";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function EditProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, checkAuth } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    checkAuth();
  }, []);

  if (!isAuthenticated) {
    return null; // Render nothing if not authenticated
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <section className="bg-white dark:bg-background py-8 lg:py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-3xl font-bold mb-4">
            {user?.isSeller ? "Edit Seller Profile" : "Edit Profile"}
          </div>
          <div className="text-lg text-gray-600 mb-8">
            Update your profile information.
          </div>
          {id && typeof id === "string" && (
            <ProfileForm userId={id} isBecomingSeller={!user?.isSeller} />
          )}
        </div>
      </section>
    </div>
  );
}