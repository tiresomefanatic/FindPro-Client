import { DirectionAwareHover } from "./ui/3dCard";
import { useDispatch } from "react-redux";
import { setSelectedCategory, setSelectedSubcategory } from "../redux/filtersSlice";
import { categories } from "../lib/categories";
import router from "next/router";

export function CategoryBanners() {
  const dispatch = useDispatch();

  const categoryBanners = [
    {
      title: "Photographers",
      description: "Starting from 500 per hour",
      image: "/BannerPhotographer.png",
    },
    {
      title: "Video Editing",
      description: "Starting from 500 per hour",
      image: "/BannerVideoEditor.png",
    },
    {
      title: "Writers",
      description: "Starting from 2000 per hour",
      image: "/BannerWriter.png",
    },
    {
      title: "Music",
      description: "Starting from 1000 per hour",
      image: "/BannerMusic.png",
    },
  ];

  const handleCategoryClick = (categoryTitle: string) => {
    // Find the category that matches the clicked banner title
    const category = categories.find(cat => 
      cat.subcategories.includes(categoryTitle) || cat.name === categoryTitle
    );

    if (category) {
      dispatch(setSelectedCategory(category.name));
      router.push('/exploreGigs');
    }
  };

  return (
    <div className="flex flex-col gap-y-8">
      <h3 className="text-md font-semibold text-center mb-4">Trending In</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {categoryBanners.map((category, index) => (
          <div key={index} onClick={() => handleCategoryClick(category.title)} className="cursor-pointer">
            <DirectionAwareHover
              imageUrl={category.image}
              className="aspect-[3/4] w-full h-auto"
              imageClassName="object-cover"
            >
              <div className="flex flex-col items-start p-3">
                <div className="absolute inset-0 bg-black bg-opacity-5 backdrop-blur-[2px] rounded-full"></div>
                <div className="relative z-10">
                  <h4 className="font-bold text-xl text-white">{category.title}</h4>
                  <p className="font-normal text-sm text-white">{category.description}</p>
                </div>
              </div>
            </DirectionAwareHover>
          </div>
        ))}
      </div>
    </div>
  );
}