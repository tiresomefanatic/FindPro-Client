import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone } from "lucide-react";

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
}

export function PriceTabs({ packages, phoneNumber }: PriceTabsProps) {
  const tabsListClass = `grid grid-cols-${packages.length} gap-4 bg-gray-100 max-w-60 mx-auto items-center justify-center rounded-[10px]`;

  return (
    <Tabs defaultValue={packages[0]?.name} className="w-full">
      <TabsList className={tabsListClass}>
        {packages.map((pkg) => (
          <TabsTrigger
            key={pkg.name}
            value={pkg.name}
            className="px-4 py-2 text-sm font-medium transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 data-[state=active]:bg-blue-100 data-[state=active]:rounded-lg"
          >
            {pkg.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {packages.map((pkg) => (
        <TabsContent key={pkg.name} value={pkg.name}>
          <Card className="rounded-xl shadow-lg">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <h3 className="text-2xl font-bold">{pkg.title}</h3>
                <div className="text-3xl font-bold text-blue-500 whitespace-nowrap">
                  ₹ {pkg.price}
                </div>
              </div>
              <p className="text-gray-600 mb-6">{pkg.description}</p>
              <div className="space-y-4">
                <div className="w-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center p-3 rounded-full">
                  <Phone className="mr-2 h-5 w-5" />
                  <span>{phoneNumber}</span>
                </div>
                <a
                  href={`https://wa.me/${phoneNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="w-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="currentColor"
                      style={{ color: "#128c7e" }}
                      viewBox="0 0 24 24"
                    >
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span>Connect on Whatsapp</span>
                  </div>
                </a>
              </div>
            </div>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
