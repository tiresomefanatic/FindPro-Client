import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useDispatch, useSelector } from "react-redux";
import { setSearchInput, setSearchTerm } from "../redux/searchSlice";
import { setSelectedCategory, setSelectedSubcategory } from "@/redux/filtersSlice";
import { RootState } from "@/redux/rootReducer";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface MainSearchProps {
  shouldRoute?: boolean;
  inHomePage?: boolean;
  className?: string;
}


export function MainSearch({ shouldRoute, className }: MainSearchProps) {

  const router = useRouter();

    

    const searchInput = useSelector(
      (state: RootState) => state.search.searchInput
      );

      const searchTerm = useSelector(
        (state: RootState) => state.search.searchTerm
        );
     
    const dispatch = useDispatch();

    const handleSearchInput = (value: string) => {
      dispatch(setSearchInput(value));
    };

    const handleSearch = () => {
      if (searchInput !== searchTerm) {
        dispatch(setSearchTerm(searchInput));
        dispatch(setSelectedCategory(''));
        dispatch(setSelectedSubcategory(''));
      } else {
        dispatch(setSearchTerm(searchInput));
      }
      // if (shouldRoute) {
      //   router.push('/exploreGigs');
      // }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleSearch();
      }
    };


  const suggestions = ["Color Correction", "Social Media Animations", "Illustrator"]

  const handleSuggestionClick = (suggestion: string) => {
    handleSearchInput(suggestion)
    dispatch(setSearchTerm(suggestion));
      dispatch(setSelectedCategory(''));
      dispatch(setSelectedSubcategory(''));
      if (shouldRoute) {
        router.push('/exploreGigs');
      }
   
  }

  return (
    <div className={cn("flex flex-col items-center w-full", className)}>      
    <div className="flex items-center rounded-full w-full max-w-2xl bg-white dark:bg-black border shadow-lg">
      <Input
          type="text"
          placeholder="What services are you looking"
          value={searchInput}
          onChange={(e) => handleSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}

          className="flex-grow text-md m-2 py-4 px-6 rounded-full bg-white dark:bg-black focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 border-none" 
      />
      <Button 
           variant="searchIcon" 
           type="submit" 
           className="text-md rounded-full m-2"
          onClick={handleSearch}
          >
            <Search />
           </Button>  
    </div>

    { !shouldRoute ? <div> </div> :
    <div className="flex flex-wrap space-x-2 mt-4 w-full max-w-2xl">
        <p className="px-3 py-2 m-1">Popular</p>
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            variant="secondary"
            size="sm"
            className="px-3 py-1 m-1"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>}
    
 </div> 
    
  )
}