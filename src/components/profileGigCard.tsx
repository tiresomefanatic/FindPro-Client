// ProfileGigCard.tsx
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
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
} from "@/components/ui/alert-dialog";
import { Bookmark, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import customAxios from "@/lib/customAxios";
import useAuth from "@/lib/useAuth";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

interface ProfileGigCardProps {
  gig: any;
  id: string;
}

const ProfileGigCard: React.FC<ProfileGigCardProps> = ({ gig, id }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const BookmarkedGigs = useSelector(
    (state: RootState) => state.auth.user?.bookmarkedGigs
  );
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    setIsBookmarked(BookmarkedGigs?.includes(id));
  }, [BookmarkedGigs, id]);

  const handleBookmarkClick = async (gigId: string) => {
    if (!isAuthenticated) {
      setIsAlertOpen(true);
    } else {
      try {
        const toastPromise = toast.promise(
          customAxios.post(
            `${baseURL}/gigs/bookmarkGig/${gigId}`,
            null,
            {
              baseURL: baseURL,
              withCredentials: true,
            }
          ),
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
      <CardContent>
        <div className="h-10 w-72 mt-2 overflow-hidden">
          <p className="text-sm">{gig.title}</p>
        </div>
        <div className="w-24 h-6 mt-0 px-2 text-green-300 bg-gray-100 rounded-lg flex items-center shadow-sm">
          <p className="text-sm text-slate-900">₹</p>
          <p className="m-1 text-sm text-slate-900">{gig.packages[0].price}</p>
        </div>
        <div className="h-40 w-full group">
          <Carousel className="w-full overflow-hidden">
            <CarouselContent>
              {gig.portfolioMedia.length > 0 ? (
                gig.portfolioMedia.map((media: any) => (
                  <CarouselItem key={media.uid}>
                    <div className="p-1">
                      <AspectRatio ratio={16 / 9} className="bg-none">
                        <img src={media.src} alt={`Portfolio Item ${media.uid}`} />
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
                          {gig.category}
                        </h3>
                        <p className="text-center text-sm">{gig.subCategory}</p>
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
                color="black"
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
      </CardContent>
    </Card>
  );
};

export default ProfileGigCard;

// LoginAlertDialog component code remains the same as in the profile.tsx file

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
      router.push(`${baseURL}/auth/google-login`);
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
  