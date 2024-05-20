import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

// Mock data for the carousel items
const carouselData = [
  {
    id: 1,
    title: "Item 1",
    content: "Content for Item 1",
  },
  {
    id: 2,
    title: "Item 2",
    content: "Content for Item 2",
  },
  {
    id: 3,
    title: "Item 3",
    content: "Content for Item 3",
  },
  {
    id: 4,
    title: "Item 4",
    content: "Content for Item 4",
  },
  
]

export function GigSlideshow() {
  return (
    <div className="w-full group">
      <Carousel className="w-full">
        <CarouselContent>
          {carouselData.map((item) => (
            <CarouselItem key={item.id}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center aspect-[16/9] p-4 md:p-6">
                    <h3 className="text-2xl font-semibold md:text-4xl">{item.title}</h3>
                    <p className="text-center">{item.content}</p>
                  </CardContent>
                </Card>
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