import { useRouter } from "next/router";
import GigForm from '../components/GigForm';
import useAuth from "@/lib/useAuth";
import { useEffect } from "react";
import ProfileForm from "../components/ProfileForm";

export default function EditProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, checkAuth } = useAuth();

  console.log('id', id)

  useEffect(() => {
    checkAuth();
  }, []);

  if (!isAuthenticated) {
    return null; // Render nothing if not authenticated
  }



  return (
    <div>
      {/* <h1 className="text-6xl mx-8 mt-12">Edit Gig</h1> */}
      {id && typeof id === "string" && (
        <ProfileForm userId={id} />
      )}
    </div>
  );
}