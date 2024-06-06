import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
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
import { Bookmark } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import {
  setLoggingInFromRoute,
  setTryingToBookmarkId,
} from "@/redux/authFlowSlice";
import axios from "axios";
import {
  useBookmarkGig,
  useBookmarkedGigs,
} from "@/pages/api/gigs/useBookmarksGigs";
import { useEffect, useState } from "react";
import { addBookmarkedGig, removeBookmarkedGig } from "@/redux/authSlice";
import { useRenderInfo } from "@uidotdev/usehooks";
import { toast } from "sonner";
import { AspectRatio } from "./ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useAuth from "@/lib/useAuth";
import customAxios from "@/lib/customAxios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

interface GigCardProps {
  id: string;
  name: string;
  profilePic: string;
  price: string;
  title: string;
  skills: string[];
  portfolioMedia: { src: string; uid: string }[];
  category: string;
  subCategory: string;
}

const mockskills = [
  "Color Collection",
  "Instagram Videos",
  "Wedding Video Editors",
  "Music Videos",
  "Youtube Videos",
  "Commercials",
];

export default function GigCard({
  id,
  name,
  profilePic,
  price,
  title,
  skills,
  portfolioMedia,
  category,
  subCategory,
}: GigCardProps) {
  // const info = useRenderInfo("GigCard");

  //  console.log('fefrmnce?', info)

  const displayedSkills = mockskills.slice(0, 3);
  const remainingSkills = mockskills.length - displayedSkills.length;
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, checkAuth } = useAuth();

  const BookmarkedGigs = useSelector(
    (state: RootState) => state.auth.user?.bookmarkedGigs
  );

  //console.log('bookmarked gigs', bookmarkedGigs)

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const [isBookmarked, setIsBookmarked] = useState(false);

  // console.log('isBookmarked?', isBookmarked)

  useEffect(() => {
    setIsBookmarked(BookmarkedGigs?.includes(id));
  }, [BookmarkedGigs, id]);

  console.log('bookmarkedgigs', isBookmarked)

  const handleBookmarkClick = async (gigId: string) => {
    if (!isAuthenticated) {
      setIsAlertOpen(true);
    } else {
      try {
        const toastPromise = toast.promise(
          customAxios.post(`http://localhost:8080/gigs/bookmarkGig/${gigId}`, null, {
            baseURL: baseURL,
            withCredentials: true,
          }),
          {
            duration: 1500,
            loading: "",
            success: (response) => {
              const data = response.data;
              const toastTitle =
                data.message === "Gig Added" ? "Gig Bookmarked" : "Gig Removed";

              if (data.message === "Gig Added") {
                dispatch(addBookmarkedGig(data.id));
                return "Gig bookmarked successfully";
              } else {
                dispatch(removeBookmarkedGig(data.id));
                return "Gig removed successfully";
              }
            },
            error: "Failed to bookmark gig",
          }
        );

        await toastPromise;
      } catch (error) {
        console.error("Failed to bookmark gig:", error);
      }
    }
  };

  return (
    <Card className="w-80 max-w-sm relative mx-auto rounded-2xl cursor-pointer overflow-hidden shadow-md transition-shadow duration-200 hover:shadow-2xl">
      <Link href={`/gigPage/${id}`}>
        <CardContent className="pl-4 pb-3">
          <div className="flex items-center ">
            <div className="flex items-center mb-4">
              <Avatar className="h-12 w-12 mt-8 mr-2 rounded-full bg-gray-300">
                <AvatarImage
                  src={profilePic}
                  alt="CN"
                />
                <AvatarFallback>{name}</AvatarFallback>
              </Avatar>
            </div>
            <div className="mt-3">
              <p className="text-md font-semibold">{name}</p>
              <div className="w-24 h-6 mt-0 px-2 text-green-300 bg-gray-100 rounded-lg flex items-center shadow-sm">
                <p className="text-sm text-slate-900">₹</p>
                <p className="m-1 text-sm text-slate-900">{price}</p>

              </div>
            </div>
          </div>

          <div className="h-10 w-72 mt-2 overflow-hidden">
            <p className="text-sm">{title}</p>
          </div>
          
         
        </CardContent>
      </Link>
      <div className="h-40 w-full group">
        <Carousel className="w-full overflow-hidden">
          <CarouselContent>
            {portfolioMedia.length > 0 ? (
              portfolioMedia.map((media) => (
                <CarouselItem key={media.uid}>
                  <div className="p-1">
                    <AspectRatio ratio={16 / 9} className="bg-none">
                      <img
                        src={media.src}
                        alt={`Portfolio Item ${media.uid}`}
                      />
                    </AspectRatio>
                  </div>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center aspect-[16/9] p-4 md:p-6">
                      <h3 className="text-lg font-semibold md:text-xl">
                        {category}
                      </h3>
                      <p className="text-center text-sm">{subCategory}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10 hidden group-hover:flex items-center justify-center" />
          <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 hidden group-hover:flex items-center justify-center" />
        </Carousel>
      </div>
      <CardContent className="p-0">
        <div className="mt-8 mb-4 flex justify-center items-center">
          <Button
            className="flex flex-grow mx-4 rounded-full text-sm font-semibold text-white hover:text-black hover:bg-white border border-2 border-zinc-900"
            onClick={() => router.push(`/gigPage/${id}`)}
          >
            Get in touch
          </Button>

          <Button
            variant="outline"
            className="mr-4 p-4 rounded-full border-none"
            onClick={() => handleBookmarkClick(id)}
          >
            <Bookmark
              size={24}
              color='black'
              fill={isBookmarked ? "black" : "white"}
            />
          </Button>

          <LoginAlertDialog
            open={isAlertOpen}
            onOpenChange={setIsAlertOpen}
            id={id}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface LoginAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
}

const LoginAlertDialog: React.FC<LoginAlertDialogProps> = ({
  open,
  onOpenChange,
  id,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleGoogleLogin = () => {
    dispatch(setLoggingInFromRoute(`/gigPage/${id}`));
    dispatch(setTryingToBookmarkId(id));
    router.push(`http://localhost:8080/auth/google-login`);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Login Required</AlertDialogTitle>
          <AlertDialogDescription>
            Please log in to bookmark this gig.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="outline" onClick={handleGoogleLogin}>
              Login with Google
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
