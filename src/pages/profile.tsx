import { useRouter } from "next/router";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import customAxios from "@/lib/customAxios";
import { Bookmark, User } from "lucide-react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Button } from "@/components/ui/button";
import useAuth from "@/lib/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { addBookmarkedGig, removeBookmarkedGig } from "@/redux/authSlice";
import {
  setLoggingInFromRoute,
  setTryingToBookmarkId,
} from "@/redux/authFlowSlice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ProfileGigCard from "@/components/profileGigCard";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;



const fetchGigsByOwner = async (ownerId: string) => {
  const response = await customAxios.get(`/gigs/userGigs/${ownerId}`);
  return response.data.gigs.filter((gig: any) => gig.status === "isLive");
};

const fetchUserById = async (userId: string) => {
  const response = await customAxios.get(`/user/${userId}`);
  return response.data;
};

const Profile: React.FC = () => {
  const router = useRouter();
  //const { id } = router.query;
  const id = "66574ed781466aa2ea03c021";



  const {
    data: gigs,
    isLoading: isGigsLoading,
    isError: isGigsError,
  } = useQuery({
    queryKey: ["gigsByOwner", id],
    queryFn: () => fetchGigsByOwner(id as string),
  });

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(id as string),
  });

  if (isGigsLoading || isUserLoading) {
    return <div>Loading...</div>;
  }

  if (isGigsError || isUserError) {
    return <div>Error fetching data.</div>;
  }

 

  return (
    <div className="container mx-auto grid grid-cols-4 gap-8">
      <div className="col-span-1 bg-green-900 p-8">
        <div className="flex items-center mt-8 bg-orange-900">
          <Avatar className="h-32 w-32 rounded-full border-4 border-white shadow-md">
            <AvatarImage src={user?.profilePic} alt="Profile Picture" />
            <AvatarFallback>
              <User className="w-24 h-24 rounded-full bg-gray-100" />
            </AvatarFallback>
          </Avatar>
        </div>
        <h1 className="text-3xl font-bold mt-4">{user?.name}</h1>
      </div>
      <div className="col-span-3">
        <h2 className="text-xl font-semibold mb-4">My Gigs</h2>
        <Carousel className="bg-red-900 relative">
          <CarouselContent className="">
            {gigs.map((gig: any) => (
              <CarouselItem
                key={gig._id}
                className="md:basis-1/2 lg:basis-1/3 mx-4"
              >
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          
            <ProfileGigCard key={gig._id} gig={gig} id={id} />
          
        </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10 flex items-center justify-center" />
          <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 flex items-center justify-center" />
        </Carousel>
        <div className="mt-8">
          <h2 className="text-xl font-semibold">About me</h2>
          <p className="mt-2">{user?.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;

