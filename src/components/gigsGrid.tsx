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
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import GigCard from "./gigCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "./ui/pagination";

const fetchGigs = async (
  page: number,
  category?: string,
  limit: number = 12
) => {
  const response = await fetch(
    `/api/gigs/getGigs?category=${category}&page=${page}&limit=${limit}`
  );
  const data = await response.json();
  return data;
};

const GigsGrid: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState("Writers");

  const [currentPage, setCurrentPage] = React.useState(1);

  const gridContainerRef = React.useRef<HTMLDivElement>(null);

  const {
    data: gigs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["gigs", currentPage, selectedCategory],
    queryFn: () => fetchGigs(currentPage, selectedCategory),
    placeholderData: keepPreviousData,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    handlePageChange(currentPage - 1);
  };

  const handleNextPage = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    handlePageChange(currentPage + 1);
  };

  const handlePageClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    page: number
  ) => {
    event.preventDefault();
    handlePageChange(page);
  };

  React.useEffect(() => {
    if (gridContainerRef.current) {
      gridContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentPage]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching gigs.</div>;
  }

  //console.log(gigs.totalPages);

  return (
    <div>
      <div
        ref={gridContainerRef}
        className="grid gap-x-2 gap-y-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
      >
        {gigs.gigs.map((gig: any) => (
          <div key={gig._id} className="flex justify-center">
            <GigCard
              id={gig._id}
              name={gig.owner.firstName}
              price={gig.price}
              title={gig.title}
              skills={gig.skills}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={handlePreviousPage}
                // disabled={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({ length: gigs.totalPages }, (_, i) => (
              <React.Fragment key={i}>
                {i === 0 ||
                i === gigs.totalPages - 1 ||
                (i >= currentPage - 2 && i <= currentPage + 2) ? (
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive={i + 1 === currentPage}
                      onClick={(event) => handlePageClick(event, i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ) : i === currentPage - 3 || i === currentPage + 3 ? (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : null}
              </React.Fragment>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={handleNextPage}
                //disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default GigsGrid;
