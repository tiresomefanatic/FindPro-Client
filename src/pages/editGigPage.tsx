import { useRouter } from "next/router";
import GigForm from '../components/GigForm';
import useAuth from "@/lib/useAuth";
import { useEffect } from "react";

export default function EditGigPage() {
  const router = useRouter();
  const { gigId } = router.query;
  const { isAuthenticated, checkAuth } = useAuth();


  useEffect(() => {
    checkAuth();
  }, []);

  if (!isAuthenticated) {
    return null; // Render nothing if not authenticated
  }



  return (
    <div>
      <h1 className="text-6xl mx-8 mt-12">Edit Gig</h1>
      {gigId && typeof gigId === "string" && (
        <GigForm isNewGig={false} gigId={gigId} />
      )}
    </div>
  );
}