import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DirectionAwareTabs } from "../components/ui/Direction-aware-tabs";
import { Phone } from "lucide-react";
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
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
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setLoggingInFromRoute } from '@/redux/authFlowSlice';
import customAxios from '@/lib/customAxios';
import { toast } from 'sonner';

interface Package {
  name: string;
  title: string;
  description: string;
  per: string;
  price: number;
}

interface PriceTabsProps {
  packages: Package[];
  phoneNumber: string;
  gigId: string;
}

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export function PriceTabs({ packages, phoneNumber, gigId }: PriceTabsProps) {
  const [showContact, setShowContact] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const dispatch = useDispatch();

  const recordInteraction = async (action: 'contact_viewed' | 'phone_viewed' | 'whatsapp_clicked') => {
    if (!isAuthenticated || !user) {
      console.warn('User not authenticated, interaction not recorded');
      return;
    }

    try {
      await customAxios.post(`${baseURL}/gigs/${gigId}/recordInteraction`, {
        userId: user._id,
        action,
      });
    } catch (error) {
      console.error("Failed to record interaction:", error);
      toast.error("Failed to record interaction");
    }
  };

  const handleContactClick = async () => {
    if (isAuthenticated) {
      setShowContact(true);
      await recordInteraction('contact_viewed');
    } else {
      setIsAlertOpen(true);
    }
  };

  const handlePhoneClick = async () => {
    await recordInteraction('phone_viewed');
  };

  const handleWhatsAppClick = async () => {
    await recordInteraction('whatsapp_clicked');
  };

  const handleGoogleLogin = () => {
    dispatch(setLoggingInFromRoute(router.asPath));
    router.push(`${baseURL}/auth/google-login`);
  };

  const tabs = packages.map((pkg, index) => ({
    id: index,
    label: pkg.name,
    content: (
      <Card className="rounded-2xl shadow-lg">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h3 className="text-2xl font-bold">{pkg.title}</h3>
            <div className="text-3xl font-bold text-primary whitespace-nowrap">
              ₹ {pkg.price}
            </div>
          </div>
          <p className="text-gray-600 mb-6">{pkg.description}</p>
          <div className="space-y-4">
            {!showContact ? (
              <Button
              className="w-full bg-accent text-white hover:bg-primary flex items-center justify-center p-3 rounded-full"
              onClick={handleContactClick}
              >
                Contact Me
              </Button>
            ) : (
              <>
                <Button
                  className="w-full bg-accent text-white hover:bg-primary flex items-center justify-center p-3 rounded-full"
                  onClick={handlePhoneClick}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  <span>{phoneNumber}</span>
                </Button>
                <Button
                  className="w-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center p-3 rounded-full"
                  onClick={handleWhatsAppClick}
                >
                  <a
                    href={`https://wa.me/${phoneNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="currentColor"
                      style={{ color: "#128c7e" }}
                      viewBox="0 0 24 24"
                    >
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span>Connect on WhatsApp</span>
                  </a>
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    ),
  }));

  return (
    <div className="w-full">
      <DirectionAwareTabs 
        tabs={tabs} 
        className="bg-white shadow-md border-none rounded-xl shadow-inner-shadow
        [&_button]:text-black [&_button]:hover:text-black 
        [&_button[data-state=active]]:!text-black [&_button[data-state=active]]:font-semibold
        [&_.absolute]:bg-white [&_.absolute]:opacity-80 [&_.absolute]:!rounded-xl"
      />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Login Required</AlertDialogTitle>
            <AlertDialogDescription>
              Please log in to view contact information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="outline" onClick={handleGoogleLogin}>
                Login with Google
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default PriceTabs;