// SearchResults.tsx

import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import GigsGridInf from '@/components/gigsGridInfinite';
import FiltersTree from '@/components/filterBar';
import { MainSearch } from '@/components/MainSearch';
import { useMediaQuery } from '@uidotdev/usehooks';
import FilterDrawer from '@/components/filtersDrawer';

const SearchResults = () => {
  const router = useRouter();
  const selectedCategory = useSelector((state: RootState) => state.filters.selectedCategory);
  const selectedSubcategory = useSelector((state: RootState) => state.filters.selectedSubcategory);
  const searchTerm = useSelector((state: RootState) => state.search.searchTerm);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const isMediumDevice = useMediaQuery(
    "only screen and (min-width : 769px) and (max-width : 992px)"
  );
  const isLargeDevice = useMediaQuery(
    "only screen and (min-width : 993px) and (max-width : 1200px)"
  );
  const isExtraLargeDevice = useMediaQuery(
    "only screen and (min-width : 1201px)"
  );


  
  return (
   
    <div className="py-3 px-4 z-50">
      <div className="grid grid-cols-1 gap-8">
        <div className="col-span-1 sticky top-5 z-40 mt-20">
          <MainSearch shouldRoute={false} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          <div className="hidden lg:block lg:col-span-1 sticky top-20 h-screen overflow-y-auto z-0">
            <FiltersTree />
          </div>
        
       {/* Filter Drawer Section */}
       {!(isLargeDevice || isExtraLargeDevice) && (
      <section className="sticky top-20 z-50">
        <div className="px-4 sm:px-6 lg:px-8 flex justify-center">
          <FilterDrawer />
        </div>
      </section>
    )}
          <div className="col-span-1 lg:col-span-5 mt-10">
            <GigsGridInf />
          </div>
        </div>
      </div>
    </div>
 
  );

};

export default SearchResults;