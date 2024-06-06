import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
import ShinyButton from "@/components/ui/ShinyButton";

const fetchGigs = async () => {
  const response = await axios.get(
    "http://localhost:8080/gigs/userGigs/66574ed781466aa2ea03c021"
  );
  return response.data.gigs;
};

export default function MyGigs() {
  const {
    data: gigs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["gigs"],
    queryFn: fetchGigs,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
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
                    Edit Gig
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    );
  };

  return (
    <div className="flex min-h-screen w-full flex-col px-4 sm:px-20 gap-y-3 mt-20">
      <div className="flex flex-col gap-4 py-4">
        <div className="flex items-center justify-between">
          <ShinyButton text="Create a New Gig" />
        </div>
      </div>

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
          <div className="relative sm:w-64 md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title..."
              className="w-full rounded-lg bg-background pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
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
