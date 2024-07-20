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
import { Bookmark, Frown, Instagram, Link2, MapPin, Phone, RefreshCw, User } from "lucide-react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Button } from "@/components/ui/button";
import useAuth from "@/lib/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useMemo, useState } from "react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const handleReload = () => {
  window.location.reload();
}

const fetchGigsByOwner = async (ownerId: string) => {
  const response = await axios.get(`${baseURL}/gigs/userGigs/${ownerId}`);
  return response.data.gigs.filter((gig: any) => gig.status === "isLive");
};

const fetchUserById = async (userId: string) => {
  const response = await axios.get(`${baseURL}/user/${userId}`);
  return response.data;
};

const formatPrice = (price: number): string => {
  if (price >= 1000) {
    return `${(price / 1000).toFixed(1).replace(".0", "")}k`;
  }
  return price.toString();
};

const calculatePriceRange = (gigs: any | undefined): string => {
  if (!gigs || gigs.length === 0) return "Price range not available";

  let minPrice = Infinity;
  let maxPrice = -Infinity;

  gigs.forEach((gig: any) => {
    gig.packages.forEach((pkg: any) => {
      if (pkg.price && !isNaN(parseFloat(pkg.price))) {
        const price = parseFloat(pkg.price);
        minPrice = Math.min(minPrice, price);
        maxPrice = Math.max(maxPrice, price);
      }
    });
  });

  if (minPrice === Infinity || maxPrice === -Infinity) {
    return "Price range not available";
  }

  const formattedMinPrice = formatPrice(minPrice);
  const formattedMaxPrice = formatPrice(maxPrice);

  return `₹${formattedMinPrice} - ₹${formattedMaxPrice}`;
};

const Profile: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  //const id = "66574ed781466aa2ea03c021";

  const {
    data: gigs,
    isLoading: isGigsLoading,
    isError: isGigsError,
  } = useQuery({
    queryKey: ["gigsByOwner", id],
    queryFn: () => fetchGigsByOwner(id as string),
  });

  console.log("gigdata", gigs);

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(id as string),
  });

  console.log("userdata", user);

  const priceRange = useMemo(() => calculatePriceRange(gigs), [gigs]);

  if (!id || isGigsLoading || isUserLoading) {
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

  if (isGigsError || isUserError) {
    return(
      <div className="flex flex-col items-center justify-center h-screen">
        <Frown size={48} className="text-red-500 mb-4" />
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

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <section className="bg-white dark:bg-background py-8 lg:py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8">
            {/* Left column */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <Card className="rounded-xl shadow-lg ">
                  <CardContent className="p-4">
                    <Avatar className="h-32 w-32 mb-4">
                      <AvatarImage src={user.profilePic} alt={user.name} />
                      <AvatarFallback>
                        <User className="w-24 h-24" />
                      </AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
                    <p className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-1" /> lives in{" "}
                      {user.location}
                    </p>
                    <div className="w-full mb-4">
                      <p className="font-semibold mb-2">Expertise in</p>
                      <div className="flex flex-wrap gap-2">
                        {user.skills?.map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="bg-gray-200 px-2 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    {priceRange !== "Price range not available" && (
                      <div className="w-full border-2 border-green-500 rounded-full py-2 px-4 mb-4">
                        <p className="text-green-600 font-semibold text-center">
                          {priceRange}
                        </p>
                      </div>
                    )}
                    <div className="w-full space-y-4">
                      {user.portfolioLink && (
                        <div className="text-gray-600">
                          <div className="flex items-center mb-2">
                            <Link2 className="w-5 h-5 mr-2" />
                            <span className="font-semibold">
                              Portfolio
                            </span>
                          </div>
                          <a
                            href={user.portfolioLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 ml-7"
                          >
                            portfolio.me
                          </a>
                        </div>
                      )}
                      {user.instagramLink && (
                        <div className="text-gray-600">
                          <div className="flex items-center mb-2">
                            <Link2 className="w-5 h-5 mr-2" />
                            <span className="font-semibold">Social Media</span>
                          </div>
                          <a
                            href={user.instagramLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block ml-7"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-7 w-7"
                              fill="currentColor"
                              style={{ color: "#c13584" }}
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                          </a>
                        </div>
                      )}
                      {user.phoneNumber && (
                        <div className="text-gray-600">
                          <div className="flex items-center mb-2">
                            <Phone className="w-5 h-5 mr-2" />
                            <span className="font-semibold">
                              Contact details
                            </span>
                          </div>
                          <span className="ml-7">{user.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right column */}
            <div className="lg:col-span-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">My Gigs</h2>
                <Carousel className="w-full">
                  <CarouselContent className="-ml-4">
                    {gigs.map((gig: any) => (
                      <CarouselItem
                        key={gig._id}
                        className="pl-2 sm:basis-1/2 md:basis-1/3"
                      >
                        <div className="h-full">
                          <ProfileGigCard gig={gig} id={gig._id} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                </Carousel>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">About me</h2>
                <p>{user.bio}</p>
              </div>
              {user.faqs && user.faqs.length > 0 && (
                <div className="mb-4">
                  <Accordion type="single" collapsible className="w-full">
                    {user.faqs.map((item: any) => (
                      <AccordionItem key={item.id} value={`item-${item.id}`}>
                        <AccordionTrigger>{item.question}</AccordionTrigger>
                        <AccordionContent>{item.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
