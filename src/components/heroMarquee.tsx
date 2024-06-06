import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Marquee from "@/components/ui/marquee";
import { categories } from "../lib/categories";
import { useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useDispatch } from "react-redux";
import {
  setSelectedCategory,
  setSelectedSubcategory,
} from "../redux/filtersSlice";
import { useRef } from "react";

interface ButtonCardProps {
  label: string;

  onClick: () => void;
}

const ButtonCard = ({ label, onClick }: ButtonCardProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    onClick();
    buttonRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <Button
      variant="outline"
      className={cn(
        "relative mx-1 cursor-pointer overflow-hidden rounded-full p-4 sm:p-6 text-md sm:text-md rounded-full border bg-background",
        // light styles
        "bg-white hover:bg-gray-950/[.25]",
        // dark styles
        "dark:bg-black dark:hover:bg-gray-50/[.35]"
      )}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
};

const HeroMarquee = () => {
  const firstRow = categories.map((category) => category.name);
  const secondRow = categories.flatMap((category) => category.subcategories);

  const [isFirstRowPaused, setIsFirstRowPaused] = useState(false);
  const [isSecondRowPaused, setIsSecondRowPaused] = useState(false);

  const dispatch = useDispatch();

  const handleCategoryClick = (category: string) => {
    dispatch(setSelectedCategory(category));
    dispatch(setSelectedSubcategory(""));
  };

  const handleSubcategoryClick = (subcategory: string) => {
    // Find the category that the subcategory belongs to
    const category = categories.find((category) =>
      category.subcategories.includes(subcategory)
    );

    if (category) {
      dispatch(setSelectedCategory(category.name));
      dispatch(setSelectedSubcategory(subcategory));
    }
  };

  return (
    <div
      className={`relative shadow-inner-xl flex flex-col items-center justify-center overflow-hidden py-8 sm:py-12`}
    >
      <div
        onMouseEnter={() => setIsFirstRowPaused(true)}
        onMouseLeave={() => setIsFirstRowPaused(false)}
        className="w-full"
      >
        <Marquee
          pauseOnHover={isFirstRowPaused}
          className="[--duration:30s] sm:[--duration:40s]"
        >
          {firstRow.map((category, index) => (
            <ButtonCard
              key={`category-${index}`}
              label={category}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </Marquee>
      </div>
      <div
        onMouseEnter={() => setIsSecondRowPaused(true)}
        onMouseLeave={() => setIsSecondRowPaused(false)}
        className="w-full"
      >
        <Marquee
          reverse
          pauseOnHover={isSecondRowPaused}
          className="[--duration:220s] sm:[--duration:230s]"
        >
          {secondRow.map((subcategory, index) => (
            <ButtonCard
              key={`subcategory-${index}`}
              label={subcategory}
              onClick={() => handleSubcategoryClick(subcategory)}
            />
          ))}
        </Marquee>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 sm:w-1/3 bg-gradient-to-r from-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 sm:w-1/3 bg-gradient-to-l from-transparent"></div>
    </div>
  );
};

export default HeroMarquee;
