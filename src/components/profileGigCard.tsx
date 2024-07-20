// ProfileGigCard.tsx
import React, { useEffect, useMemo, useState } from "react";
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

const formatPrice = (price: number): string => {
  if (price >= 1000) {
    const formattedPrice = (price / 1000).toFixed(1);
    return `${formattedPrice.endsWith('.0') ? Math.floor(price / 1000) : formattedPrice}k`;
  }
  return price.toString();
};

const calculatePriceRange = (packages: any[]): string => {
  if (!packages || packages.length === 0) return "Price range not available";

  const prices = packages
    .map(pkg => parseFloat(pkg.price))
    .filter(price => !isNaN(price));

  if (prices.length === 0) return "Price range not available";

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  if (minPrice === maxPrice) {
    return `₹${formatPrice(minPrice)}`;
  }

  // Special handling for when max price is exactly 1000
  if (maxPrice === 1000) {
    return `₹${formatPrice(minPrice)} - ₹1k`;
  }

  return `₹${formatPrice(minPrice)} - ₹${formatPrice(maxPrice)}`;
};

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

  const priceRange = useMemo(() => calculatePriceRange(gig.packages), [gig.packages]);


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
    <Card className="w-full max-w-sm relative rounded-2xl cursor-pointer overflow-hidden shadow-md transition-shadow duration-200 hover:shadow-2xl">
    <CardContent className="p-4">
      <div className="h-10 mb-2 overflow-hidden">
        <p className="text-sm">{gig.title}</p>
      </div>
      <div className="w-24 h-6 px-2 text-green-300 bg-gray-100 rounded-lg flex items-center shadow-sm mb-2">
        <p className="text-xs text-slate-900 whitespace-nowrap">{priceRange}</p>
      </div>
      <div className="aspect-w-16 aspect-h-9 group mb-4">
        <Carousel className="w-full overflow-hidden">
          <CarouselContent>
            {gig.portfolioMedia.length > 0 ? (
              gig.portfolioMedia.map((media: any) => (
                <CarouselItem key={media.uid}>
                  <AspectRatio ratio={16 / 9} className="bg-none">
                    <img src={media.src} alt={`Portfolio Item ${media.uid}`} className="object-cover w-full h-full" />
                  </AspectRatio>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem>
                <AspectRatio ratio={16 / 9}>
                  <div className="flex flex-col items-center justify-center h-full bg-gray-100">
                    <h3 className="text-lg font-semibold">{gig.category}</h3>
                    <p className="text-center text-sm">{gig.subCategory}</p>
                  </div>
                </AspectRatio>
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10 hidden group-hover:flex" />
          <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 hidden group-hover:flex" />
        </Carousel>
      </div>
      <div className="flex justify-between items-center">
        <Button
          className="flex-grow mr-2 rounded-full text-sm font-semibold text-black hover:text-black hover:bg-white border border-2 border-zinc-900"
          onClick={() => router.push(`/gigPage/${id}`)}
        >
          Get in touch
        </Button>
        <Button
          variant="outline"
          className="p-2 rounded-full border-none"
          onClick={() => handleBookmarkClick(id)}
        >
          <Bookmark
            size={20}
            color="black"
            fill={isBookmarked ? "black" : "white"}
          />
        </Button>
      </div>
    </CardContent>
    <LoginAlertDialog
      open={isAlertOpen}
      onOpenChange={setIsAlertOpen}
      id={id}
    />
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
  