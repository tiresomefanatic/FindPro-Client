import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export function SwBanners() {
  const banners = [
    { color: "bg-blue-500", name: "Premier Pro" , image: '/Premierpro.png'},
    { color: "bg-purple-500", name: "After Effects", image: '/Aftereffects.png' },
    { color: "bg-green-500", name: "Photoshop", image: '/Photoshop.png'},
    { color: "bg-orange-500", name: "Illustrator", image: '/Illustrator.png' },
    
  ]

  return (
    <div>
      <h3 className="text-sm font-semibold text-center mb-4">Hire Talent In</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {banners.map((banner, index) => (
          <Card key={index}>
            <CardContent className="flex items-center justify-center space-x-2 py-1 w-48 h-20">
            <Image
            src={banner.image}
            alt={banner.name}
            width={10}
            height={10}
            className="w-full h-auto object-cover"
          />
              <span className="text-sm font-semibold text-center">{banner.name}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}