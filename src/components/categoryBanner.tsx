// CategoryBanners.tsx
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export function CategoryBanners() {
  const categories = [
    {
      title: "Video Editors",
      description: "Starting from 4000 per hour",
      image: "/videoeditorsbanner.jpg",
    },
    {
      title: "Actors",
      description: "Starting from 10,000 per hour",
      image: "/actors.jpg",
    },
    {
      title: "Camera & Lights",
      description: "Starting from 4000 per hour",
      image: "/camera.jpg",
    },
    {
      title: "Music & SFX",
      description: "Starting from 4000 per hour",
      image: "/sfx.jpg",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category, index) => (
        <Card key={index} className="relative border border-none">
          <Image
            src={category.image}
            alt={category.title}
            width={200}
            height={50}
            className="w-full h-auto object-cover"
          />
          <CardContent className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
            <CardTitle>{category.title}</CardTitle>
            <p className="text-sm">{category.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}