import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import router from "next/router";
import customAxios from "@/lib/customAxios";
import { toast } from "sonner";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const fetchGigs = async () => {
  const response = await customAxios.get(
    `${baseURL}/gigs/myGigs`
  );
  return response.data.gigs;
};

export default function MyGigs() {
  const {
    data: gigs,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["myGigs"],
    queryFn: fetchGigs,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteGig = async (gigId: string) => {
    try {
      await customAxios.delete(`${baseURL}/gigs/${gigId}`, {
      });
      // Refresh the gigs data after successful deletion
      await refetch();
    } catch (error) {
      console.error("Error deleting gig:", error);
      toast.error('Error deleting gig')
    }
  };

  const renderGigs = (status: any) => {
    const filteredGigs =
      status === "all"
        ? gigs
        : gigs?.filter((gig: any) =>
            status === "live"
              ? gig.status === "isLive"
              : gig.status !== "isLive"
          );

    const searchedGigs = filteredGigs?.filter((gig: any) =>
      gig.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <TableBody className="mt-96">
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              <div className="flex justify-center items-center ">
                <div className="h-10 w-10  animate-spin rounded-full border-4 border-gray-200 border-t-black" />
              </div>
            </TableCell>
          </TableRow>
        ) : isError ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              Error fetching gigs.
            </TableCell>
          </TableRow>
        ) : searchedGigs?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              No gigs found.
            </TableCell>
          </TableRow>
        ) : (
          searchedGigs?.map((gig: any) => (
            <TableRow key={gig._id}>
              <TableCell className="w-full sm:w-1/2 md:w-2/3">
                {gig.title}
              </TableCell>
              <TableCell className="sm:table-cell">
                {gig.status === "isLive" ? <div> Live </div> : "Draft"}
              </TableCell>
              <TableCell className="sm:w-1/4 md:w-1/6">
                <Link href={`/editGigPage?gigId=${gig._id}`}>
                  <Button variant="outline" className="whitespace-nowrap">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="whitespace-nowrap ml-2"
                  onClick={() => handleDeleteGig(gig._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    );
  };

  const createNewGig = async () => {
    const response = await customAxios.post(`${baseURL}/gigs/createGig`, null, {
    
    });

    return response.data;
  };

  const {
    mutate: createGigMutation,
    //isError,
    error,
  } = useMutation({
    mutationFn: createNewGig,
    onSuccess: (data) => {
      router.push(`/createNewGig?gigId=${data._id}`);
    },
  });

  const handleCreateGig = () => {
    createGigMutation();
  };

  return (
    <div className="flex min-h-screen w-full flex-col px-4 sm:px-20 gap-y-3">
      <div className="flex flex-col gap-4 py-4"></div>

      <Tabs defaultValue="all">
        <div className="flex items-center justify-between">
          <TabsList className="rounded-xl">
            <TabsTrigger className="rounded-xl" value="all">
              All
            </TabsTrigger>
            <TabsTrigger className="rounded-xl" value="live">
              Live
            </TabsTrigger>
            <TabsTrigger className="rounded-xl" value="draft">
              Draft
            </TabsTrigger>
          </TabsList>
          {/* <div className="relative sm:w-64 md:w-80">
            
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title..."
              className="w-full rounded-lg bg-background pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
       
          </div> */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleCreateGig}
              className="relative inline-flex h-12 overflow-hidden rounded-full p-[2px] mt-1 shadow-md"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-black backdrop-blur-3xl hover:bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl hover:text-white">
                Create New Gig
              </span>
            </button>{" "}
          </div>
        </div>
        <TabsContent value="all">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>All Gigs</CardTitle>
              <CardDescription>Manage all your gigs.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-full sm:w-1/2 md:w-2/3">
                      Title
                    </TableHead>
                    <TableHead className="sm:table-cell">Status</TableHead>
                    <TableHead className="sm:w-1/4 md:w-1/6">Manage</TableHead>
                  </TableRow>
                </TableHeader>
                {renderGigs("all")}
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="live">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Live Gigs</CardTitle>
              <CardDescription>Manage your live gigs.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-full sm:w-1/2 md:w-2/3">
                      Title
                    </TableHead>
                    <TableHead className="sm:table-cell">Status</TableHead>
                    <TableHead className="sm:w-1/4 md:w-1/6">Manage</TableHead>
                  </TableRow>
                </TableHeader>
                {renderGigs("live")}
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="draft">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Draft Gigs</CardTitle>
              <CardDescription>Manage your draft gigs.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-full sm:w-1/2 md:w-2/3">
                      Title
                    </TableHead>
                    <TableHead className="sm:table-cell">Status</TableHead>
                    <TableHead className="sm:w-1/4 md:w-1/6">Manage</TableHead>
                  </TableRow>
                </TableHeader>
                {renderGigs("draft")}
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
