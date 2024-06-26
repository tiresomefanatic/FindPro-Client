import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import GigCard from "./gigCard";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setSelectedCategory, setSelectedSubcategory } from "../redux/filtersSlice";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { ArrowRightIcon } from "lucide-react";
import { setSearchTerm } from "@/redux/searchSlice";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;


const fetchGigsByCategory = async () => {
  const response = await fetch(`${baseURL}/gigs/gigs-by-category`);
  const data = await response.json();
  return data;
};

const GigsGrid: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { data: gigsData, isLoading, isError } = useQuery({
    queryKey: ["gigsByCategory"],
    queryFn: fetchGigsByCategory,
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
    <div>
      {gigsData?.map((categoryData: any) => (
        <div className="flex flex-col gap-y-3 mb-16" key={categoryData.category}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold md:px-20 px-0">
              Popular in {categoryData.category || "Uncategorized"}
            </h2>
            <Button
            variant="expandIcon" 
            Icon={ArrowRightIcon}
            iconPlacement="right"

              className="px-4 py-2 text-black rounded bg-gray-100 hover:bg-accent"
              onClick={() => handleViewMore(categoryData.category)}
            >
              View More
            </Button>
          </div>
          <div className="flex flex-col jusify-center items-center">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
            {categoryData.gigs &&
              categoryData.gigs.slice(0, 6).map((gig: any) => (
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