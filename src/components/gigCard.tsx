
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import { Bookmark } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/router";

interface GigCardProps {
  id: string;
  name: string;
  price: string;

  title: string;
  skills: string[];
}

const mockskills = [
  "Color Collection",
  "Instagram Videos",
  "Wedding Video Editors",
  "Music Videos",
  "Youtube Videos",
  "Commercials",
];

// Mock data for the carousel items
const carouselData = [
  {
    id: 1,
    title: "Item 1",
    content: "Content for Item 1",
  },
  {
    id: 2,
    title: "Item 2",
    content: "Content for Item 2",
  },
  {
    id: 3,
    title: "Item 3",
    content: "Content for Item 3",
  },
  {
    id: 4,
    title: "Item 4",
    content: "Content for Item 4",
  },
];

const GigCard: React.FC<GigCardProps> = ({
  id,
  name,
  price,
 
  title,
  skills,
}) => {
  const displayedSkills = mockskills.slice(0, 3);
  const remainingSkills = mockskills.length - displayedSkills.length;
  const router = useRouter();

  return (
    <Card className="w-80 h-96 max-w-sm cursor-pointer overflow-hidden transition-shadow duration-200 hover:shadow-lg">
      <Link href={`/gigPage/${id}`}>
       <CardContent className="pl-4 pb-3">
            <div className="flex items-center ">
              <div className="flex items-center">
                <div className="h-12 w-12 mt-5 mr-2 rounded-full bg-gray-300" />
                </div>
              <div className="mt-4">
                  <p className="text-lg font-semibold">{name}</p>
                 <div className="w-24 h-6 mt-0 bg-gray-200 flex items-center">
                  <p className="m-1 text-sm font-semibold">{price}</p>
                   </div>
              </div>
              </div>
            
           
            <div className="h-10 w-72 bg-gray-100 mt-4 overflow-hidden">
              <p className="text-md">{title}</p>
           
            </div>
          </CardContent>
      
      </Link>
      <div className="h-40 w-full group">
        <Carousel className="w-full overflow-hidden">
          <CarouselContent>
            {carouselData.map((item) => (
              <CarouselItem key={item.id}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center aspect-[16/9] p-4 md:p-6">
                      <h3 className="text-lg font-semibold md:text-xl">
                        {item.title}
                      </h3>
                      <p className="text-center text-sm">{item.content}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10 hidden group-hover:flex items-center justify-center" />
          <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 hidden group-hover:flex items-center justify-center" />
        </Carousel>
      </div>
      <CardContent className="p-0">
        <div className="mt-8 flex justify-center items-center">
          
          <Button 
           className="flex flex-grow mx-4 rounded-full bg-black text-sm font-semibold text-white"
           onClick={() => router.push(`/gigPage/${id}`)}
           >
            Get in touch
          </Button>
          <Button variant="outline"className="mr-4 p-4 rounded-full">
          <Bookmark size={24}/>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GigCard;