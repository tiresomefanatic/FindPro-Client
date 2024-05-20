import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';


import { PriceTabs } from "@/components/PriceTabs";
import { GigSlideshow } from "@/components/GigSlideshow";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { setLoggingInFromRoute } from "@/redux/authFlowSlice";
import axios from "axios";

const fetchGig = async (id: string) => {
  try {
    const response = await axios.get(`/api/gigs/${id}`);
    const data = response.data;
    console.log('single gig', data)
    return data;
  } catch (error) {
    throw error;
  }
};
const skills = [
  "React",
  "JavaScript",
  "React Native",
  "Tailwind CSS",
  "Expressjs",
  "MongoDB",
  "Node.js",
  "HTML5",
];

const mockReviews = [
  {
    id: 1,
    author: "John Doe",
    review: "Excellent service! Highly recommended.",
  },
  {
    id: 2,
    author: "Jane Smith",
    review: "The quality is outstanding.",
  },
  {
    id: 3,
    author: "Michael Johnson",
    review: "Fantastic work! I will definitely use this service again.",
  },
  {
    id: 4,
    author: "Emily Davis",
    review: "The attention to detail is remarkable. Well done!",
  },
  {
    id: 5,
    author: "David Wilson",
    review: "I am completely satisfied with the results. Great job!",
  },
];

const mockAccordionData = [
  {
    id: 1,
    question: "What services do you offer?",
    answer:
      "I offer web development services using React, Node.js, Next.js, and Tailwind CSS.",
  },
  {
    id: 2,
    question: "What is your turnaround time?",
    answer:
      "The turnaround time depends on the project scope and complexity. Typically, I can deliver within 1-2 weeks.",
  },
  {
    id: 3,
    question: "How do you communicate with clients?",
    answer:
      "I prefer to communicate via email or chat platforms like Slack or Discord. I'm also open to voice or video calls when necessary.",
  },
];



export default function GigPage() {

  const [showAllReviews, setShowAllReviews] = React.useState(false);
  const router = useRouter();
  const { id } = router.query;
  //console.log('ID from router.query:', id);
  const dispatch = useDispatch();

  
  const handleGoogleLogin = () => {
    dispatch(setLoggingInFromRoute(router.asPath))

     router.push(`http://localhost:8080/auth/google-login`)
    
    }
    


  const { data: gig, isLoading, isError } = useQuery({
    queryKey: ['gig', id],
    queryFn: () => fetchGig(id as string),
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching gig.</div>;
  }

  //console.log("from gigPage", gig.package)


  const toggleShowAll = () => {
    setShowAllReviews(!showAllReviews);
  };

  const visibleReviews = showAllReviews ? mockReviews : mockReviews.slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <section className="bg-white dark:bg-background  py-8 lg:py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-1 xl:grid-cols-12 lg:gap-8">
            <div className="xl:col-span-8">
              {/* Gig details */}
              <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-4xl">
                {gig.title}
              </h1>
              {/* Seller info */}
              <div className="flex items-center mb-6">
                <Image
                  src="/avatars/simran.jpg"
                  alt="Simran"
                  width={50}
                  height={50}
                  className="rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-medium">Simran</h3>
                  <p className="text-gray-500">
                    Pakistan | I speak English | 107 orders completed
                  </p>
                </div>
              </div>
              {/* Slideshow */}
              <div className="mb-8 relative z-0">
                <GigSlideshow />
              </div>
              {/* Gig description */}
              <div className="mb-8">
                <p className="text-gray-600 dark:text-gray-400">
                  Your Satisfaction is everything
                  <br />
                  <br />
                  Hi, Greetings :) I am a full-stack developer with 6+ years of
                  experience with modern technologies like React, React Native,
                  Next js, Node js, Express js, Firebase, Mysql, MongoDB, and so
                  on. I build responsive websites on react js and node js and
                  mobile apps.
                </p>
                <Link href="#" className="text-blue-600 hover:underline">
                  Read More
                </Link>
              </div>
              {/* Skills */}
              <h3 className="text-2xl font-bold mb-4">Skills</h3>
              <div className="flex flex-wrap gap-4 mb-8">
                {skills.map((skill) => (
                  <p
                    key={skill}
                    className="inline-flex items-center rounded-full border border-1 px-2.5 py-0.5 text-sm font-semibold text-foreground whitespace-normal"
                  >
                    {skill}
                  </p>
                ))}
              </div>
              <div className="mb-8">
                <Accordion type="single" collapsible className="w-full">
                  {mockAccordionData.map((item) => (
                    <AccordionItem key={item.id} value={`item-${item.id}`}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                <div className="grid grid-cols-1 gap-4">
                  {visibleReviews.map((review) => (
                    <Card
                      key={review.id}
                      className="border border-gray-200 p-3 bg-white dark:bg-card shadow-md"
                    >
                      <CardContent>
                        <CardTitle className="flex flex-grow text-md font-semibold text-gray-900 dark:text-white py-2">
                          {review.author}
                        </CardTitle>
                        <CardDescription className="flex flex-grow text-gray-900 dark:text-white mt-2 overflow-hidden">
                          {review.review}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {mockReviews.length > 3 && (
                  <button
                    onClick={toggleShowAll}
                    className="mt-4 text-blue-500 hover:underline"
                  >
                    {showAllReviews ? "See Less" : "See More"}
                  </button>
                )}
              </div>
                     {/*edit gig button*/}
                     <div className="mt-8">
    <Link href={`/editGigPage?gigId=${gig._id}`}>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Edit Gig
      </button>
    </Link>
    {/* {login button} */}
    <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href={`http://localhost:8080/auth/google-login`}> 
          <Button
            variant="outline"
            size="sm"
            className="ml-4"
            onClick={handleGoogleLogin}
          > 
           
            Login with Google
          </Button>
       </Link>
       
        </div>
      </section>

  </div>

       
            </div>
            {/* PriceTabs */}
            <div className="xl:col-span-4">
              <div className="sticky top-24">
                <PriceTabs packages={gig.packages} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
