import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000); // Show popup after 1 second

    return () => clearTimeout(timer);
  }, []);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-[95vw] w-full sm:max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0">
        <div className="p-6 flex-shrink-0">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl sm:text-2xl">Welcome to FindPro!</AlertDialogTitle>
          </AlertDialogHeader>
        </div>
        <AlertDialogDescription className="overflow-y-auto flex-grow px-6">
          <div className="space-y-4">
            <p className="text-sm sm:text-base">
              Hello recruiters! 
              This project showcases my skills in Next.js, React, and modern UI development.
              The backend is made of Express.js and MongoDb. Using s3 as CDN.
              I made this as a freelance project.
              This version of the website is to showcase to recruiters. The actual project is still ongoing, and the clients are still handling the business side more before further development can take place.
            </p>

            <p className="font-bold text-base sm:text-lg bg-yellow-100 p-2 rounded-md text-center">
              To check out all features please login with Google and become a seller and post a gig.
            </p>
           
            <p className="font-semibold">Key features include:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Frontend Technologies:</h3>
                <ul className="list-disc pl-5 text-sm sm:text-base">
                  <li>Next.js for server-side rendering and routing</li>
                  <li>React with functional components and hooks</li>
                  <li>Responsive design using Tailwind CSS with global theming</li>
                  <li>Shadcn/ui components for a polished UI</li>
                  <li>Custom animations and interactive elements using framer motion</li>
                  <li>Redux for global state management</li>
                  <li>UI/UX design also done by me</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Advanced Features:</h3>
                <ul className="list-disc pl-5 text-sm sm:text-base">
                  <li>Google OAuth integration for user authentication</li>
                  <li>JWT authentication with automatic token refreshing</li>
                  <li>Infinite scrolling for efficient data loading</li>
                  <li>Frontend caching with TanStack Query (React Query)</li>
                  <li>Complete media gallery manager with smart uploading</li>
                  <li>Automatic stale asset cleanup (24-hour expiration)</li>
                  <li>Fuzzy Search and filters</li>
                </ul>
              </div>
            </div>
            <p className="text-sm sm:text-base pb-6">
              Feel free to explore the application and its codebase. I&apos;m excited to discuss how 
              these skills and technologies can contribute to your team&apos;s projects!
            </p>          
          </div>
        </AlertDialogDescription>
        <div className="p-6 flex-shrink-0 mt-auto">
          <AlertDialogFooter>
            <AlertDialogAction className="w-full sm:w-auto">Got it, thanks!</AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WelcomePopup;