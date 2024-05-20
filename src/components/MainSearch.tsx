import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useDispatch, useSelector } from "react-redux";
import { setSearchInput, setSearchTerm } from "../redux/searchSlice";
import { setSelectedCategory, setSelectedSubcategory } from "@/redux/filtersSlice";
import { RootState } from "@/redux/rootReducer";


export function MainSearch() {
    

    const searchInput = useSelector(
      (state: RootState) => state.search.searchInput
      );
     
    const dispatch = useDispatch();

    const handleSearchInput = (value: string) => {
      dispatch(setSearchInput(value));
    };

    const handleSearch = () => {
      dispatch(setSearchTerm(searchInput));
      dispatch(setSelectedCategory(''));
      dispatch(setSelectedSubcategory(''));
      // if (onSearch) {
      //   onSearch();
      // }
    };


  const suggestions = ["Cinematography", "Video editors", "Actors", "VFX", "SFX"]

  const handleSuggestionClick = (suggestion: string) => {
    handleSearchInput(suggestion)
   
  }

  return (
    <div className="flex flex-col items-center w-full">
    <div className="flex items-center rounded-full w-full max-w-2xl bg-white dark:bg-black border-2 border-solid border-black">
      <Input
          type="text"
          placeholder="What services are you looking"
          value={searchInput}
          onChange={(e) => handleSearchInput(e.target.value)}
          className="flex-grow text-md m-2 py-4 px-6 rounded-full bg-white dark:bg-black focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 border-none" 
      />
      <Button 
           variant="default" 
           type="submit" 
           className="text-md rounded-full m-2"
          onClick={handleSearch}
          >
            Search
           </Button>  
    </div>
    <div className="flex flex-wrap justify-center space-x-2 mt-4 w-full max-w-2xl">
        
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
      </div>
      </div> 
    
  )
}