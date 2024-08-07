import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { PriceTabs } from "@/components/PriceTabs";
import { GigSlideshow } from "@/components/GigSlideshow";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { useDispatch, useSelector } from "react-redux";
import {
  setLoggingInFromRoute,
  setTryingToBookmarkId,
} from "@/redux/authFlowSlice";
import axios from "axios";
import { Bookmark, Frown, Languages, MapPin, RefreshCw, Share2 } from "lucide-react";
import { RootState } from "@/redux/store";
import { addBookmarkedGig, removeBookmarkedGig } from "@/redux/authSlice";
import { toast } from "sonner";
import useAuth from "@/lib/useAuth";
import { Separator } from "@radix-ui/react-select";
import customAxios from "@/lib/customAxios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const handleReload = () => {
  window.location.reload();
};

export default function GigPage() {
  const [showAllReviews, setShowAllReviews] = React.useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, checkAuth } = useAuth();

  const dispatch = useDispatch();

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const BookmarkedGigs = useSelector(
    (state: RootState) => state.auth.user?.bookmarkedGigs
  );

  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    setIsBookmarked(BookmarkedGigs?.includes(id));
  }, [BookmarkedGigs, id]);

  const handleGoogleLogin = () => {
    dispatch(setLoggingInFromRoute(router.asPath));

    router.push(`${baseURL}/auth/google-login`);
  };

  const fetchGig = async (id: string) => {
    try {
      const response = await axios.get(`${baseURL}/gigs/getGigById/${id}`, {
        baseURL: baseURL, // Set your API base URL, does not work without it
        withCredentials: true, // To let axios send cookies in header
      });
      const data = response.data;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const {
    data: gig,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["gig", id],
    queryFn: () => fetchGig(id as string),
  });
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-background">
        <section className="bg-white dark:bg-background py-8 lg:py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="lg:col-span-8  rounded-xl p-6">
              <div className="flex justify-center items-center ">
                <div className="h-10 w-10  animate-spin rounded-full border-4 border-gray-200 border-t-black" />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Frown size={48} className="text-gray-400 mb-4" />
        <p className="text-2xl mb-6">Sorry, an error occurred</p>
        <Button 
          variant="outline" 
          onClick={handleReload}
          className="flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Reloading
        </Button>
      </div>
    );
    }

  const handleBookmarkClick = async (gigId: string) => {
    if (!isAuthenticated) {
      setIsAlertOpen(true);
    } else {
      try {
        const toastPromise = toast.promise(
          customAxios.post(`${baseURL}/gigs/bookmarkGig/${gigId}`, null, {}),
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

  console.log("from gigPage", gig);

  const toggleShowAll = () => {
    setShowAllReviews(!showAllReviews);
  };

  const handleShareClick = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(
      () => {
        toast.success("Link copied to clipboard!");
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast.error("Failed to copy link");
      }
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <section className="bg-white dark:bg-background py-8 lg:py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8 rounded-xl p-6">
              {/* Gig details */}
              <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-black md:text-3xl">
                {gig.title}
              </h1>

              {/* Seller info */}
              <div className="flex flex-col md:flex-row md:items-center mb-4">
                <img
                  src={gig.owner.profilePic}
                  alt="Simran"
                  width={50}
                  height={50}
                  className="rounded-full mr-4 mb-2 md:mb-0"
                />
                <div className="flex flex-col">
                  <Link href={`/profile?id=${gig.owner._id}`}>
                    <h3 className="text-lg font-medium hover:underline cursor-pointer">
                      {gig.owner.name}
                    </h3>
                  </Link>{" "}
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="flex items-center mb-1 md:mb-0 md:mr-4">
                      <MapPin className="mr-1" />
                      <p className="text-gray-500">{gig.owner.location}</p>
                    </div>
                    <div className="flex items-center">
                      <Languages className="mr-1" />
                      <div className="flex flex-wrap">
                        {gig.owner.languages?.map((lang: string) => (
                          <p key={lang} className="text-gray-500 mr-1">
                            {lang}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bookmark and Share buttons */}
              <div className="flex space-x-2 md:hidden rounded-full justify-self-end sticky top-4 z-10 p-2 mb-4 ">
                <Button
                  variant="outline"
                  className="p-2 rounded-full"
                  onClick={() => handleBookmarkClick(id as string)}
                >
                  <Bookmark
                    size={16}
                    color="black"
                    fill={isBookmarked ? "black" : "white"}
                  />
                  Save
                </Button>
                <Button
                  variant="outline"
                  className="p-2 rounded-full"
                  onClick={handleShareClick}
                >
                  <Share2 size={16} />
                  Share
                </Button>
              </div>

              {/* Slideshow */}
              <div className="mb-4 relative z-0">
                <GigSlideshow portfolioMedia={gig.portfolioMedia} />
              </div>


              {/* Skills */}
              <h3 className="text-xl font-bold mb-2.5">Skills</h3>
              <div className="flex flex-wrap gap-4 mb-5">
                {gig.skills.map((skill: string) => (
                  <p
                    key={skill}
                    className="inline-flex items-center rounded-full border border-1 px-2.5 py-0.5 text-sm font-semibold text-foreground whitespace-normal"
                  >
                    {skill}
                  </p>
                ))}
              </div>

              {/* Gig description */}
              <h3 className="text-xl font-bold mb-3">About this gig</h3>
              <div className="mb-4 overflow-hidden">
                <p className="text-md text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words">
                  {gig.description}
                </p>
              </div>

              {gig.faqs && gig.faqs.length > 0 && (
                <div className="mb-4">
                  <Accordion type="single" collapsible className="w-full">
                    {gig.faqs.map((item: any) => (
                      <AccordionItem key={item.id} value={`item-${item.id}`}>
                        <AccordionTrigger>{item.question}</AccordionTrigger>
                        <AccordionContent>{item.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </div>
            {/* PriceTabs */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <div className="hidden md:flex justify-end space-x-2 mb-4">
                  <Button
                    variant="outline"
                    className="p-2 rounded-full"
                    onClick={() => handleBookmarkClick(id as string)}
                  >
                    <Bookmark
                      size={16}
                      color="black"
                      fill={isBookmarked ? "black" : "white"}
                    />
                    <span className="ml-1">Save</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="p-2 rounded-full"
                    onClick={handleShareClick}
                  >
                    <Share2 size={16} />
                    <span className="ml-1">Share</span>
                  </Button>
                </div>
                <PriceTabs
                  gigId={gig._id}
                  packages={gig.packages}
                  phoneNumber={gig.owner.phoneNumber}
                />
                <LoginAlertDialog
                  open={isAlertOpen}
                  onOpenChange={setIsAlertOpen}
                  id={id as string}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
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
    dispatch(setTryingToBookmarkId(JSON.stringify(id)));
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
