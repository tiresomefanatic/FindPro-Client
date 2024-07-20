import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  setSelectedCategory,
  setSelectedSubcategory,
} from "../redux/filtersSlice";
import { useDispatch } from "react-redux";
import { categories } from "../lib/categories";
import router from "next/router";

export function SwBanners() {
  const banners = [
    {
      color: "bg-blue-500",
      name: "Premier Pro",
      image: "/Premierpro.png",
      cl1: "absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-full",
      cl2: " px-8 py-2  bg-black rounded-full relative group transition duration-200 text-black",
    },

    {
      color: "bg-green-500",
      name: "Photoshop",
      image: "/Photoshop.png",
      cl1: "absolute inset-0 bg-black to-blue-500 rounded-md",
      cl2: "px-8 py-2  bg-white rounded-md  relative group transition duration-200 text-black",
    },
    {
      color: "bg-purple-500",
      name: "After Effects",
      image: "/Aftereffects.png",
      cl1: "absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full",
      cl2: "px-8 py-2  bg-black rounded-full  relative group transition duration-200 text-black",
    },
    {
      color: "bg-orange-500",
      name: "Illustrator",
      image: "/Illustrator.png",
      cl1: "absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full",
      cl2: "px-8 py-2  bg-black rounded-full  relative group transition duration-200 text-black",
    },
  ];

  const dispatch = useDispatch();

  const handleSubcategoryClick = (subcategory: string) => {
    // Find the category that the subcategory belongs to
    const category = categories.find((category) =>
      category.subcategories.includes(subcategory)
    );

    if (category) {
      dispatch(setSelectedCategory(category.name));
      dispatch(setSelectedSubcategory(subcategory));
      router.push('/exploreGigs');

    }
  };

  return (
    <div className="flex flex-col gap-y-8">
      <h3 className="text-md font-semibold text-center ">Hire Talent In</h3>
      <div className="grid place-content-center grid-cols-2 sm:grid-cols-4 gap-4">
        {banners.map((banner, index) => (
          <button
            key={index}
            className="mx-4 rounded-xl text-sm font-semibold text-black hover:text-black hover:bg-accent shadow-md py-2"
            onClick={() => handleSubcategoryClick(banner.name)}
          >
            
         
              <div className="flex items-center justify-center space-x-2">
                <Image
                  src={banner.image}
                  alt={`${banner.name} logo`}
                  width={32}
                  height={32}
                />
                <span className="text-sm">{banner.name}</span>
              </div>
          
          </button>
        ))}
      </div>
    </div>
  );
}
