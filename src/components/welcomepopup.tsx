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
      <AlertDialogContent className="max-w-4xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Welcome to My Project!</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Hello recruiters! 
              This project showcases my skills in Next.js, React, and modern UI development.
              The backend is made of Express.js and MongoDb. Using s3 as CDN.
              I made this as a freelance project.
              This version of the website is to showcase to recruiters. The actual project is still ongoing, and the clients are still handling the business side more before further development can take place.
            </p>

            <p className="font-bold text-lg bg-yellow-100 p-2 rounded-md text-center">
              To check out all features please login with Google and become a seller and post a gig.
            </p>
           
            <p>Key features include:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Frontend Technologies:</h3>
                <ul className="list-disc pl-5">
                  <li>Next.js for server-side rendering and routing</li>
                  <li>React with functional components and hooks</li>
                  <li>Responsive design using Tailwind CSS with global theming</li>
                  <li>shadcn/ui components for a polished UI</li>
                  <li>Custom animations and interactive elements</li>
                  <li>Redux for global state management</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Advanced Features:</h3>
                <ul className="list-disc pl-5">
                  <li>Google OAuth integration for user authentication</li>
                  <li>JWT authentication with automatic token refreshing</li>
                  <li>Infinite scrolling for efficient data loading</li>
                  <li>Frontend caching with TanStack Query (React Query)</li>
                  <li>Complete media gallery manager with smart uploading</li>
                  <li>Automatic stale asset cleanup (24-hour expiration)</li>
                </ul>
              </div>
            </div>
            <p>
              Feel free to explore the application and its codebase. I&apos;m excited to discuss how 
              these skills and technologies can contribute to your team&apos;s projects!
            </p>          
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Got it, thanks!</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WelcomePopup;