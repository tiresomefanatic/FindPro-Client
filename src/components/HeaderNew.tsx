"use client";
import Link from "next/link";
import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import Container from "./ui/container";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, ShoppingCart, Sun } from "lucide-react";
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
import { useDispatch } from "react-redux";
import { setLoggingInFromRoute } from "@/redux/authFlowSlice";




const Header = () => {
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  // const handleGoogleLogin = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:8080/auth/google", {
  //       withCredentials: true,
  //     });
  //     // Handle successful login
  //     console.log("Login successful");
  //     // Redirect to a desired page after successful login
  //     router.push("/");
  //   } catch (error) {
  //     // Handle login error
  //     console.error("Login error:", error);
  //   }
  // };

  // const handleGoogleLogin = () => {
  //   signIn('google', { callbackUrl: 'http://localhost:3000' });
  // };


  const handleGoogleLogin = () => {
    dispatch(setLoggingInFromRoute(router.asPath))

     router.push(`http://localhost:8080/auth/google-login`)
    
    }
    

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sm:flex sm:justify-between py-3 px-4 border-b backdrop-blur bg-black/50 z-50 ">
      <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between w-full">
        <div className="flex items-center">
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
          <Link href="/" className="ml-4 lg:ml-0">
            <h1 className="text-xl font-bold">FindPro</h1>
          </Link>
        </div>
        {/* <nav className="mx-6 hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                {routes.map((route) => (
                  <NavigationMenuItem key={route.title}>
                    <NavigationMenuTrigger>
                      {route.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        {route.content.map((item) => (
                          <ListItem
                            key={item.label}
                            title={item.label}
                            href={item.href}
                          />
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
                
                  {(() => {
                    const menuItems = [];
                    for (let i = 0; i < routes.length; i++) {
                      const route = routes[i];
                      const listItems = [];
                      for (let j = 0; j < route.content.length; j++) {
                        const item = route.content[j];
                        listItems.push(
                          <ListItem key={item.label} title={item.label} href={item.href} />
                        );
                      }
                      menuItems.push(
                        <NavigationMenuItem key={route.title} className=" ">
                          <NavigationMenuTrigger>
                            {route.title}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                              {listItems}
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      );
                    }
                    return menuItems;
                  })()}
                
              </NavigationMenuList>
            </NavigationMenu>
          </nav> */}
        
        <div className="flex max-md:hidden ">
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
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Theme"
            className="mr-6"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Moon className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Sun className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle Theme</span>
          </Button>
          <ProfileButton />
        </div>
      </div>
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
