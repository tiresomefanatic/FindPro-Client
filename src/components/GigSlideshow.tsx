import * as React from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface GigSlideshowProps {
  portfolioMedia: {
    id: string
    src: string
    //type: string
  }[]
}

export function GigSlideshow({ portfolioMedia }: GigSlideshowProps) {
  return (
    <div className="w-full group">
      <Carousel className="w-full">
        <CarouselContent>
          {portfolioMedia.map((item) => (
            <CarouselItem key={item.id}>
              <div className="p-1">
                <AspectRatio ratio={16 / 9} className="bg-none">
                  
                    <img className="w-full h-full object-cover" src={item.src} alt={`Portfolio Item ${item.id}`} />
                 
                </AspectRatio>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10 hidden group-hover:flex items-center justify-center" />
        <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 hidden group-hover:flex items-center justify-center" />
      </Carousel>
    </div>
  )
}