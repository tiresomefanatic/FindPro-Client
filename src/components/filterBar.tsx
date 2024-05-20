import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setSelectedCategory, setSelectedSubcategory } from '../redux/filtersSlice';
import { setSearchTerm } from '@/redux/searchSlice';

const categories = [
  {
    name: 'Video Production',
    subcategories: ['Wedding Films', 'Social Media Videos', 'Music Videos', 'Influencer Collabs'],
  },
  {
    name: 'Video Editing',
    subcategories: ['Color Collection', 'Instagram Videos', 'Wedding Video Editors', 'Music Videos', 'Youtube Videos', 'Commercials'],
  },
  {
    name: 'Sound',
    subcategories: ['Sync Sound', 'Dubbing Artist', 'SFX Editing', 'Mixing and Mastering', 'Music Direction'],
  },
  {
    name: 'Writers',
    subcategories: ['Content Writers', 'Script Writers'],
  },
  {
    name: 'Photographers',
    subcategories: ['Fashion Photographers', 'Event Photographers'],
  },
  {
    name: 'Visual Graphics',
    subcategories: ['Social Media Animations', 'Logo and Subtitles', 'Illustrators', 'Intros and Outros', 'VFX and Motion Graphics'],
  },
];

const FiltersBar = () => {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state: RootState) => state.filters.selectedCategory);
  const selectedSubcategory = useSelector((state: RootState) => state.filters.selectedSubcategory);
  const searchTerm = useSelector((state: RootState) => state.search.searchTerm);

  const handleCategoryChange = (value: string) => {
    dispatch(setSelectedCategory(value));
    dispatch(setSelectedSubcategory(''));
    dispatch(setSearchTerm(''));
    
  };

  const handleSubcategoryChange = (value: string) => {
    dispatch(setSelectedSubcategory(value));
    dispatch(setSearchTerm(''));
  };

  const updateSelectedFilters = () => {
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
    //  dispatch(setSelectedCategory(''));
     // dispatch(setSelectedSubcategory(''));
    }
  };

  useEffect(() => {
    updateSelectedFilters();
  }, [searchTerm]);

  return (
    <div className="bg-lime-200 flex p-20 justify-center items-center">
      <div className="bg-lime-700 flex flex-col space-y-4 mb-20 justify-ccenter">
        {/* Category Buttons */}
        <div className="flex flex-row space-x-4">
          {categories.map((category) => (
            <div key={category.name} className="relative">
              <button
                className={`flex flex-grow p-2 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  selectedCategory === category.name ? 'bg-primary text-white' : ''
                }`}
                onClick={() => handleCategoryChange(category.name)}
              >
                {category.name}
              </button>
              {selectedCategory === category.name && (
                <div className="bg-red-700 absolute top-full mt-4 left-1/2 transform -translate-x-1/2">
                  {/* Subcategory Buttons */}
                  <div className="flex space-x-2 space-y-2">
                    {category.subcategories.map((subcategory) => (
                      <button
                        key={subcategory}
                        className={`flex flex-grow p-2 rounded-md border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                          selectedSubcategory === subcategory ? 'bg-primary text-white' : ''
                        }`}
                        onClick={() => handleSubcategoryChange(subcategory)}
                      >
                        {subcategory}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;