// CategoryBanners.tsx
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { DirectionAwareHover } from "./ui/3dCard";

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
  ];

  return (
    <div className="flex flex-col gap-y-8">
      <h3 className="text-md font-semibold text-center mb-4">Trending In</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((category, index) => (
          <div
            className="h-200 relative flex items-center justify-center"
            key={index}
          >
            <DirectionAwareHover imageUrl={category.image}>
              <p className="font-bold text-xl">{category.title}</p>
              <p className="font-normal text-sm">{category.description}</p>
            </DirectionAwareHover>
          </div>
        ))}
      </div>
    </div>
  );
}
