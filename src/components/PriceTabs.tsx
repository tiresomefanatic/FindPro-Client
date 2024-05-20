import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Package {
  name: string;
  description: string;
  per: string;
  price: number;
}

interface PriceTabsProps {
  packages: Package[];
}

export function PriceTabs({ packages }: PriceTabsProps) {
  console.log('pricetabs fuckup', packages);
  const tabsListClass = `grid grid-cols-${packages.length} gap-4`;


  return (
    <div className="flex justify-center">
      <Tabs defaultValue={packages[0]?.name} className="w-full p-2">
        <TabsList className={tabsListClass}>
          {packages.map((pkg) => (
            <TabsTrigger key={pkg.name} value={pkg.name}>
              {pkg.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {packages.map((pkg) => (
          <TabsContent key={pkg.name} value={pkg.name}>
            <CardContent className="flex flex-col items-center p-2 md:p-4 dark:bg-zinc-950">
              <h3 className="text-xl font-semibold">{pkg.name}</h3>
              <p className="mt-1 text-xs text-gray-600">{pkg.description}</p>
              <div className="mt-2 text-3xl font-bold">${pkg.price}</div>
              <Button className="mt-4" size="sm">
                Choose Plan
              </Button>
            </CardContent>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}