import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/router";
import { setLoggingInFromRoute, setLoggingInFromRouteAsync } from "@/redux/authFlowSlice";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from '../redux/store'; // Import the AppDispatch type from your store file




interface Gig {
    _id: string;
    title: string;
    status: string;
    packages: 
        [{
      name: string,
      price: string
        }
     ];
  }




const fetchGigs = async ({
  
  queryKey,
}: {
 
  queryKey: string[];
}) => {
  const [_key] = queryKey;
  const response = await axios.get(
    `/api/gigs/getGigs`);
  const data = response.data;
  return data;
};

export default function MyGigsPage() {

  
const router = useRouter()
const dispatch = useDispatch(); // Specify the type of the dispatch function

  // ...

  const handleGoogleLogin = () => {
    dispatch(setLoggingInFromRoute(router.asPath))

     router.push(`http://localhost:8080/auth/google-login`)
    
    }
    
  


  const authFlowState= useSelector((state: RootState) => state.authFlow.loggingInFromRoute);
 
  console.log('state authflow', authFlowState)

  const { data: gigs, isLoading, isError, error } = useQuery({
    queryKey: ["gigs"],
    queryFn: fetchGigs
  });

  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }



  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            {/* ... */}
            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>My Gigs</CardTitle>
                  <CardDescription>
                    Manage your gigs and view their details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Package</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gigs.map((gig: Gig) => (
                        <TableRow key={gig._id}>
                          <TableCell className="font-medium">
                            {gig.title}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{gig.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {gig.packages[0]?.name || "N/A"}
                          </TableCell>
                          <TableCell>
                            {gig.packages[0]?.price || "N/A"}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>1-10</strong> of <strong>{gigs.length}</strong> gigs
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      {/* {login button} */}
       <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="outline"
            size="sm"
            className="ml-4"
            onClick={handleGoogleLogin}
          > 
           
            Login with Google
          </Button>
     
        </div>
      </section>
    </div>
  );
}