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
import { Bookmark, MapPin, User } from "lucide-react";
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
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;



const fetchGigsByOwner = async (ownerId: string) => {
  const response = await axios.get(`${baseURL}/gigs/userGigs/${ownerId}`);
  return response.data.gigs.filter((gig: any) => gig.status === "isLive");
};

const fetchUserById = async (userId: string) => {
  const response = await axios.get(`${baseURL}/user/${userId}`);
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

  console.log("userdata", user)

  if (isGigsLoading || isUserLoading) {
    return <div>Loading...</div>;
  }

  if (isGigsError || isUserError) {
    return <div>Error fetching data.</div>;
  }

 

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left column */}
        <div className="col-span-1">
          <div className="flex flex-col items-center">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarImage src={user.profilePic} alt={user.name} />
              <AvatarFallback><User className="w-24 h-24" /></AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
            <p className="flex items-center text-gray-600 mb-4">
              <MapPin className="w-4 h-4 mr-1" /> lives in {user.location}
            </p>
            <div className="flex flex-col items-center mb-4">
              <p className="font-semibold mb-2">Expertise in</p>
              <div className="flex flex-wrap justify-center gap-2">
                {user.skills?.map((skill: string, index: number) => (
                  <span key={index} className="bg-gray-200 px-2 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-yellow-500 font-semibold mb-4">Price range {user.priceRange}</p>
            <p className="text-gray-600 mb-4 text-center">
              <span className="font-semibold">Portfolio link</span><br />
              <a href={user.portfolioLink} className="text-blue-500 break-all">{user.portfolioLink}</a>
            </p>
            <Button className="w-full bg-blue-500 text-white">Get in touch</Button>
          </div>
        </div>

        {/* Right column */}
        <div className="col-span-1 md:col-span-3">
          <div className="mb-8">
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
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">About me</h2>
            <p>{user.bio}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Expert in</h2>
            <div className="flex flex-wrap gap-2">
              {user.skills?.map((skill: string, index: number) => (
                <span key={index} className="bg-gray-200 px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

