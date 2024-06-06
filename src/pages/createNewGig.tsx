import { useRouter } from "next/router";
import GigForm from '../components/GigForm';
import { useEffect } from "react";
import useAuth from "@/lib/useAuth";

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
      <h1 className="text-6xl mx-8 mt-12">Create a new Gig</h1>
      {gigId && typeof gigId === "string" && (
        <GigForm isNewGig={true} gigId={gigId} />
      )}
    </div>
  );
}