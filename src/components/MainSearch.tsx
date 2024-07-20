import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDispatch, useSelector } from "react-redux";
import { setSearchInput, setSearchTerm } from "../redux/searchSlice";
import { setSelectedCategory, setSelectedSubcategory } from "@/redux/filtersSlice";
import { RootState } from "@/redux/rootReducer";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Head from "next/head";

interface MainSearchProps {
  shouldRoute?: boolean;
  inHomePage?: boolean;
  className?: string;
}

export function MainSearch({ inHomePage, shouldRoute, className }: MainSearchProps) {
  const router = useRouter();
  const searchInput = useSelector((state: RootState) => state.search.searchInput);
  const searchTerm = useSelector((state: RootState) => state.search.searchTerm);
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
    if (shouldRoute) {
      router.push('/exploreGigs');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch();
  };

  const suggestions = ["Illustrator", "Color Correction", "Social Media Animations", "Script Writer"];

  const handleSuggestionClick = (suggestion: string) => {
    handleSearchInput(suggestion);
    dispatch(setSearchTerm(suggestion));
    dispatch(setSelectedCategory(''));
    dispatch(setSelectedSubcategory(''));
    if (shouldRoute) {
      router.push('/exploreGigs');
    }
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <div className={cn("flex flex-col items-center w-full", className)}>
        <form onSubmit={handleSubmit} className="flex items-center rounded-full w-full max-w-4xl bg-white dark:bg-black border shadow-lg">
          <Input
            type="text"
            placeholder="What services are you looking for?"
            value={searchInput}
            onChange={(e) => handleSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow text-sm sm:text-md m-1 sm:m-2 py-2 sm:py-4 px-4 sm:px-6 rounded-full bg-white dark:bg-black focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 border-none"
          />
          <Button 
            variant="searchIcon" 
            type="submit" 
            className="text-sm sm:text-md rounded-full m-1 sm:m-2"
          >
            <Search size={18} />
          </Button>  
        </form>
       {!shouldRoute?  <div> </div> :
        <div className="flex flex-row justify-center items-center"> 
          <p className="px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-lg font-semibold whitespace-nowrap">Popular:</p>
          <div className="flex flex-row flex-wrap items-center justify-start gap-2 mt-4 w-full max-w-4xl overflow-x-auto">
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant='outline'
                size="sm"
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm whitespace-nowrap"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>}
      </div>
    </>
  );
}