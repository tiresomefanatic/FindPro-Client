import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import GigCard from "../components/gigCard";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setSelectedCategory, setSelectedSubcategory } from "../redux/filtersSlice";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { ArrowRightIcon } from "lucide-react";
import { setSearchTerm } from "@/redux/searchSlice";
import customAxios from "@/lib/customAxios";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;


const fetchSavedGigs = async () => {
  const response = await customAxios.get(`${baseURL}/gigs/getBookmarkedGigs`);
  console.log('saved gigs data', response.data)
  return response.data;
};

const GigsGrid: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { data: savedGigs, isLoading, isError } = useQuery({
    queryKey: ["savedGigs"],
    queryFn: fetchSavedGigs,
  });

  const handleViewMore = (category: string) => {
    dispatch(setSearchTerm(''))
    dispatch(setSelectedCategory(category));
    dispatch(setSelectedSubcategory(""));
    router.push("/exploreGigs");
  };

  if (isLoading) {
    return   <div className="flex h-screen justify-center mt-20">
    <div className="grid gap-x-2 gap-y-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      <Skeleton className="w-80 h-96 max-w-sm gap-x-2 "> </Skeleton>
      <Skeleton className="w-80 h-96 max-w-sm gap-x-2 "> </Skeleton>
      <Skeleton className="w-80 h-96 max-w-sm gap-x-2 "> </Skeleton>
      <Skeleton className="w-80 h-96 max-w-sm gap-x-2 "> </Skeleton>
      <Skeleton className="w-80 h-96 max-w-sm gap-x-2 "> </Skeleton>
      <Skeleton className="w-80 h-96 max-w-sm gap-x-2 "> </Skeleton>
    </div>
  </div>
  }

  if (isError) {
    return <div className="flex h-screen justify-center mt-20">
    <p className="text-2xl"> Sorry an error occured </p>
  </div>
  }

  return (
    <div className="mt-20">
      {savedGigs.bookmarkedGigs?.map((categoryData: any) => (
        <div className="flex flex-col gap-y-3 mb-16" key={categoryData.category}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold md:px-20 px-0">
              {categoryData.category || "Uncategorized"}
            </h2>
          </div>
          <div className="flex flex-col jusify-center items-center">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
            {categoryData.gigs &&
              categoryData.gigs.map((gig: any) => (
                <div key={gig._id} className="flex justify-center">
                  <GigCard
                    id={gig._id}
                    name={gig.owner?.name}
                    profilePic={gig.owner?.profilePic}
                    price={gig.packages[0]?.price}
                    title={gig.title}
                    skills={gig.skills}
                    portfolioMedia={gig.portfolioMedia}
                    category={gig.category}
                    subCategory={gig.subCategory}
                  />
                </div>
              ))}
          </div>
          </div>
        </div>
      ))}
    </div>
 
  );
};

export default GigsGrid;