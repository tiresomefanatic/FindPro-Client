import { useRouter } from "next/router";
import GigForm from '../components/GigForm';

export default function EditGigPage() {
  const router = useRouter();
  const { gigId } = router.query;

  return (
    <div>
      <h1 className="text-6xl mx-8 mt-12">Edit Gig</h1>
      {gigId && typeof gigId === "string" && (
        <GigForm isNewGig={false} gigId={gigId} />
      )}
    </div>
  );
}