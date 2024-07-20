import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCategory, setSelectedSubcategory } from '../redux/filtersSlice';
import { setSearchTerm } from '@/redux/searchSlice';
import { RootState } from '@/redux/store';
import { categories } from "../lib/categories";
import { motion } from 'framer-motion';
import { Button } from './ui/button';


const FiltersBar = React.memo( () => {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state: RootState) => state.filters.selectedCategory);
  const selectedSubcategory = useSelector((state: RootState) => state.filters.selectedSubcategory);
  const searchTerm = useSelector((state: RootState) => state.search.searchTerm);

  const handleCategoryChange = (value: string) => {
    if (selectedCategory === value) {
      dispatch(setSelectedCategory(''));
      dispatch(setSelectedSubcategory(''));
    } else {
      dispatch(setSelectedCategory(value));
      dispatch(setSelectedSubcategory(''));
    }
    dispatch(setSearchTerm(''));
  };

  const handleSubcategoryChange = (value: string) => {
    if (selectedSubcategory === value) {
      dispatch(setSelectedSubcategory(''));
    } else {
      dispatch(setSelectedSubcategory(value));
    }
    dispatch(setSearchTerm(''));
  };

  const handleClearAll = () => {
    dispatch(setSelectedCategory(''));
    dispatch(setSelectedSubcategory(''));
    dispatch(setSearchTerm(''));
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

  console.log('search state category:', selectedCategory, 'Subcateogry:', selectedCategory, 'searchterm:', searchTerm)



  useEffect(() => {
    updateSelectedFilters();
  }, [updateSelectedFilters]);

  return (
    <motion.div
      className="flex p-4 pt-10 justify-start items-start"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col space-y-4 mb-20">
        <motion.h2
          className="text-xl font-bold"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Categories
        </motion.h2>
       

        {/* Category Tree */}
        <motion.div
          className="flex flex-col space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {categories.map((category) => (
            <motion.div
              key={category.name}
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Button
              variant='filterTree'
                className={`flex flex-grow p-2 text-lg rounded-md text-black dark:text-black ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  selectedCategory === category.name ? 'font-bold text-primary' : ''
                }`}
                onClick={() => handleCategoryChange(category.name)}
               // whileHover={{ scale: 1.05 }}
               // whileTap={{ scale: 0.95 }}
              >
                {category.name}
              </Button>
              {selectedCategory === category.name && (
                <motion.div
                  className="mt-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Subcategory Buttons */}
                  <div className="flex flex-col gap-y-3 ml-5">
                    {category.subcategories.map((subcategory) => (
                      <button
                     
                        key={subcategory}
                        className={`p-2 text-md text-start rounded-md text-gray-700 ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        selectedSubcategory === subcategory ? 'font-bold text-primary' : ''
                        }`}
                        onClick={() => handleSubcategoryChange(subcategory)}
                      //  whileHover={{ scale: 1.05 }}
                      //  whileTap={{ scale: 0.95 }}
                      >
                        {subcategory}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>

  );
});

FiltersBar.displayName = 'FiltersBar'

export default FiltersBar;