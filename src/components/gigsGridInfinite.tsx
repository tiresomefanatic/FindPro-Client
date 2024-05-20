import * as React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { RootState } from "@/redux/rootReducer";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedCategory,
  setSelectedSubcategory,
} from "../redux/filtersSlice";

import { Skeleton } from "@/components/ui/skeleton";
import GigCard from "./gigCard";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";

const fetchGigs = async ({
  pageParam = 1,
  queryKey,
}: {
  pageParam?: number;
  queryKey: string[];
}) => {
  const [_key, selectedCategory, selectedSubCategory, searchTerm] = queryKey;
  const response = await axios.get(
    `/api/gigs/getGigs`,
    {
      params: {
        category: selectedCategory,
        subCategory: selectedSubCategory,
        page: pageParam,
        limit: 10,
        searchTerm: searchTerm,
      },
    }
  );
  const data = response.data;
  return data;
};

const GigsGridInf: React.FC = () => {
  const dispatch = useDispatch();

  const selectedCategory = useSelector(
    (state: RootState) => state.filters.selectedCategory
  );
  const selectedSubcategory = useSelector(
    (state: RootState) => state.filters.selectedSubcategory
  );

  const searchTerm = useSelector(
    (state: RootState) => state.search.searchTerm
    );

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["gigs", selectedCategory, selectedSubcategory, searchTerm],
    queryFn: fetchGigs,
    getNextPageParam: (lastPage, allPages) => {
        if (lastPage.gigs.length === 0) {
          return undefined;
        }
        return allPages.length + 1;
      },
      getPreviousPageParam: (firstPage, allPages) => {
        if (allPages.length <= 1) {
          return undefined;
        }
        return allPages.length - 1;
      },
     
      initialPageParam: 1, 
    });

  const loadMoreRef = React.useRef(null);

  React.useEffect(() => {
    if (loadMoreRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        { rootMargin: "0px 0px 100px 0px" }
      );
      observer.observe(loadMoreRef.current);
      return () => {
        observer.disconnect();
      };
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "pending") {
    return (
      <div className="flex h-screen justify-center mt-20">
        <div className="grid gap-x-2 gap-y-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          <Skeleton className="w-80 h-96 max-w-sm gap-x-2 "> </Skeleton>
          <Skeleton className="w-80 h-96 max-w-sm gap-x-2 "> </Skeleton>
          <Skeleton className="w-80 h-96 max-w-sm gap-x-2 "> </Skeleton>
          <Skeleton className="w-80 h-96 max-w-sm gap-x-2 "> </Skeleton>
          <Skeleton className="w-80 h-96 max-w-sm gap-x-2 "> </Skeleton>
          <Skeleton className="w-80 h-96 max-w-sm gap-x-2 "> </Skeleton>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return <div>Error: {error.message}</div>;
  }
  
  if (data && data.pages[0].gigs.length === 0) {
    return <div>No gigs found.</div>;
  }
  
  return (
    <div className="">
      <div className="grid gap-x-2 gap-y-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {data.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.gigs.map((gig: any) => (
              <div key={gig._id} className="flex justify-center">
                <GigCard
                  id={gig._id}
                  name={gig.owner.firstName}
                  price={gig.packages[0].price}
                  title={gig.title}
                  skills={gig.skills}
                />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      <div ref={loadMoreRef} className="text-center mt-4">
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
          ? "Load More"
          : "Nothing more to load"}
      </div>
      <div className="text-center mt-4">
        {isFetching && !isFetchingNextPage ? "Fetching..." : null}
      </div>
    </div>
  );
};

export default GigsGridInf;
