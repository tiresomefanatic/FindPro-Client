"use client";
import Link from "next/link";
import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import Container from "./ui/container";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bookmark, Menu, Moon, ShoppingCart, Sun } from "lucide-react";
import ProfileButton from "./ProfileButton";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoggingInFromRoute } from "@/redux/authFlowSlice";
import { RootState } from "@/redux/store";
import ProfilePic from "./ProfilePic";
import { clearAuthState } from "@/redux/authSlice";
import customAxios from "@/lib/customAxios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;


const Header = () => {
  const { theme, setTheme } = useTheme();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const user = useSelector((state: RootState) => state.auth.user);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleGoogleLogin = () => {
    dispatch(setLoggingInFromRoute(router.asPath));
    router.push(`${baseURL}/auth/google-login`);
  };

  const handleLogout = async () => {
    try {
      const response = await customAxios.post(`${baseURL}/auth/logout`, null, {
        withCredentials: true,
      });

      if (response.data.message === "Logout successful") {
        dispatch(clearAuthState());
        router.push("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleBecomeSellerClick = () => {
    router.push(`/editProfile?id=${user._id}`);
  };

  const toggleMobileMenu = () => {
    setIsSheetOpen(!isSheetOpen);
  };



  


  return (
    <header className="sm:flex sm:justify-between py-3 px-4 shadow-lg backdrop-blur z-50">
      <div className="relative flex h-16 items-center justify-between w-full">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 md:hidden"
                aria-label="Toggle Menu"
                onClick={toggleMobileMenu}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
          </Sheet>
          <Link href="/" className="md:pl-20 pl-0">
            <h1 className="text-xl font-bold">FindPro</h1>
          </Link>
        </div>

        <div className="flex flex-row justify-center items-center pr-20 max-md:hidden">
          {!isAuthenticated ? (
            <div>
        
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-4"
                  onClick={handleGoogleLogin}
                >
                  Login with Google
                </Button>
       
            </div>
          ) : (
            <div className="flex flex-row gap-x-4 justify-center items-center">
              <div> <Bookmark /></div>
              <div className="flex justify-center items-center">
               {!user?.isSeller && (
               <button onClick={handleBecomeSellerClick} className="relative inline-flex h-12 overflow-hidden rounded-full p-[2px] mt-1 shadow-md">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-black backdrop-blur-3xl hover:bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl hover:text-white">
                    Become a Seller
                  </span>
                </button>
                )}
                
              </div>

              <div className="flex">
                <ProfileButton isAuthenticated={isAuthenticated} />
              </div>
            </div>
          )}
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side={"left"}>
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              <div className="flex flex-col space-y-4">
                {!isAuthenticated ? (
                  <div>
           
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-4"
                        onClick={handleGoogleLogin}
                      >
                        Login with Google
                      </Button>
                   
                  </div>
                ) : (
                  <div className="flex flex-col gap-y-2">
                    {user?.isSeller ? (
                      <div className="flex flex-col gap-y-2">
                        <div>
                          {" "}
                          <ProfilePic />{" "}
                        </div>
                        <Link
                          href={`/profile?id=${user?._id}`}
                          onClick={() => setIsSheetOpen(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          href={`/editProfile?id=${user?._id}`}
                          onClick={() => setIsSheetOpen(false)}
                        >
                          Edit Profile
                        </Link>
                        <Link
                          href="/myGigs"
                          onClick={() => setIsSheetOpen(false)}
                        >
                          My Gigs
                        </Link>
                      </div>
                    ) : (
                      <Button 
                      variant="shine"
                      onClick={handleBecomeSellerClick}
                      >Become a Seller</Button>
                    )}

                    <div className="flex flex-col gap-y-2">
                      <Link
                        href="/subscription"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        Saved Gigs
                      </Link>
                      <button onClick={handleLogout}>
                        Log Out
                      </button>
                    </div>
                  </div>
                )}

                {/* <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Toggle Theme"
                  className="mt-4"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <Moon className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Sun className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle Theme</span>
                </Button> */}
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </header>
  );
};

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  href: string;
  title: string;
}

const ListItem = React.forwardRef<React.ElementRef<"a">, ListItemProps>(
  ({ className, title, children, href, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            href={href}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            {children && (
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {children}
              </p>
            )}
          </Link>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

export default Header;
