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
    <div className="max-w-screen-xl mx-auto px-6 sm:px-6 lg:px-10 shadow-lg py-4">
      <div className="text-3xl font-bold mt-12 mb-4">Edit Gig</div>
      <div className="text-lg text-gray-600 mb-4">
        Update your Gig details, Pricing, and Portfolio images.
      </div>
      {gigId && typeof gigId === "string" && (
        <GigForm isNewGig={false} gigId={gigId} />
      )}
    </div>
  );
}