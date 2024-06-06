import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { categories } from "../lib/categories";
import { useCallback, useEffect, useState } from "react";
import { RootState } from "../redux/store";

import {
  setSelectedCategory,
  setSelectedSubcategory,
} from "../redux/filtersSlice";
import { setSearchTerm } from "../redux/searchSlice";

import { useDispatch, useSelector } from "react-redux";
import React from "react";



const FilterDrawer = React.memo( () => {
  const dispatch = useDispatch();
  const selectedCategory = useSelector(
    (state: RootState) => state.filters.selectedCategory
  );
  const selectedSubcategory = useSelector(
    (state: RootState) => state.filters.selectedSubcategory
  );
  const searchTerm = useSelector((state: RootState) => state.search.searchTerm);


  

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      dispatch(setSelectedCategory(""));
      dispatch(setSelectedSubcategory(""));
    } else {
      dispatch(setSelectedCategory(category));
      dispatch(setSelectedSubcategory(""));
    }
  };

  const handleSubcategoryClick = (subcategory: string) => {
    if (selectedSubcategory === subcategory) {
      dispatch(setSelectedSubcategory(""));
    } else {
      dispatch(setSelectedSubcategory(subcategory));
    }
  };

  const handleResetFilters = () => {
    dispatch(setSelectedCategory(""));
    dispatch(setSelectedSubcategory(""));
    dispatch(setSearchTerm(""));
  };

  const updateSelectedFilters = useCallback(() => {
    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, 'i');

      const matchedCategory = categories.find((category) =>
        searchRegex.test(category.name)
      );

      if (matchedCategory) {
        dispatch(setSelectedCategory(matchedCategory.name));
        dispatch(setSelectedSubcategory(''));
        return;
      }

      const matchedSubcategory = categories
        .flatMap((category) => category.subcategories)
        .find((subcategory) => searchRegex.test(subcategory));

      if (matchedSubcategory) {
        const matchedCategory = categories.find((category) =>
          category.subcategories.includes(matchedSubcategory)
        );
        dispatch(setSelectedCategory(matchedCategory?.name || ''));
        dispatch(setSelectedSubcategory(matchedSubcategory));
      }
    } else {
      // bugs the giginfinit page when coming back from gigpage
      // dispatch(setSelectedCategory(''));
      // dispatch(setSelectedSubcategory(''));
    }
  }, [searchTerm, dispatch]);

  useEffect(() => {
    updateSelectedFilters();
  }, [updateSelectedFilters]);

  const getSubcategories = () => {
    const category = categories.find((cat) => cat.name === selectedCategory);
    return category ? category.subcategories : [];
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
      <Button variant="outline">
      Filters
      {selectedCategory && ` - ${selectedCategory}`}
      {selectedSubcategory && ` / ${selectedSubcategory}`}
    </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
            <DrawerDescription>Apply filters to your search.</DrawerDescription>
          </DrawerHeader>
          <div className="flex">
            <div className="w-1/3 mr-4">
              <h4 className="text-lg font-semibold mb-2">Categories</h4>
              <ScrollArea className="h-64">
                <ul>
                  {categories.map((category) => (
                    <li
                      key={category.name}
                      className={`cursor-pointer p-2 ${
                        selectedCategory === category.name ? "bg-gray-200" : ""
                      }`}
                      onClick={() => handleCategoryClick(category.name)}
                    >
                      {category.name}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
            <div className="w-2/3">
              <h4 className="text-lg font-semibold mb-2">Subcategories</h4>
              <ScrollArea className="h-64">
                <ul>
                  {getSubcategories().map((subcategory) => (
                    <li
                      key={subcategory}
                      className={`cursor-pointer p-2 ${
                        selectedSubcategory === subcategory ? "bg-gray-200" : ""
                      }`}
                      onClick={() => handleSubcategoryClick(subcategory)}
                    >
                      {subcategory}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          </div>
          <DrawerFooter>
          <Button onClick={handleResetFilters}>Reset Filters</Button>

            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
)

FilterDrawer.displayName = 'FilterDrawer'

export default FilterDrawer;
