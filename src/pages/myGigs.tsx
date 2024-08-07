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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import router from "next/router";
import customAxios from "@/lib/customAxios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const fetchGigs = async () => {
  const response = await customAxios.get(`${baseURL}/gigs/myGigs`);
  return response.data.gigs;
};

export default function MyGigs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [gigToDelete, setGigToDelete] = useState(null);

  const {
    data: gigs,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["myGigs"],
    queryFn: fetchGigs,
  });

  // const handleSearch = (event: any) => {
  //   setSearchTerm(event.target.value);
  // };

  const deleteGigMutation = useMutation({
    mutationFn: async (gigId: string) => {
      await customAxios.delete(`${baseURL}/gigs/${gigId}`);
    },
    onSuccess: () => {
      toast.success("Gig deleted successfully");
      refetch(); // Refresh the gigs data after successful deletion
    },
    onError: (error) => {
      console.error("Error deleting gig:", error);
      toast.error("Error deleting gig");
    },
  });

  const handleDeleteClick = (gig: any) => {
    setGigToDelete(gig._id);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (gigToDelete) {
      deleteGigMutation.mutate(gigToDelete);
      setIsDeleteAlertOpen(false);
      setGigToDelete(null);
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
            <TableRow
              key={gig._id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => router.push(`/gigPage/${gig._id}`)}
            >
              <TableCell className="w-full sm:w-1/2 md:w-2/3">
                {gig.title}
              </TableCell>
              <TableCell className="sm:table-cell">
                <div className="flex items-center">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full mr-2",
                      gig.status === "isLive" ? "bg-green-500" : "bg-yellow-500"
                    )}
                  />
                  {gig.status === "isLive" ? "Live" : "Draft"}
                </div>
              </TableCell>
              <TableCell className="sm:w-1/4 md:w-1/6">
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                  <Link
                    href={`/editGigPage?gigId=${gig._id}`}
                    className="w-full sm:w-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="outline" className="w-full">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(gig);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    );
  };

  const createNewGig = async () => {
    const response = await customAxios.post(
      `${baseURL}/gigs/createGig`,
      null,
      {}
    );

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
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-black backdrop-blur-3xl hover:bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl hover:text-black">
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
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this gig?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              gig.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteAlertOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
