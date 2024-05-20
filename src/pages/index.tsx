import Image from "next/image";
import { Inter } from "next/font/google";
import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import PersonGrid from "@/components/gigsGrid";
import { MainSearch } from "@/components/MainSearch";
import { SwBanners } from "@/components/swBanners";
import { CategoryBanners } from "@/components/categoryBanner";

import { cn } from "@/lib/utils";
import GigsGrid from "@/components/gigsGrid";

import GigsGridInf from "@/components/gigsGridInfinite";
//import { Icons } from "@/components/icons"
import FiltersBars from "../components/filterBar";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

import { useMutation, useIsMutating  } from '@tanstack/react-query';
import axios from 'axios';
import { setBookmarkedGigs } from "@/redux/bookmarkedGigsSlice";
import { useDispatch } from "react-redux";

import {
  MultiFileDropzone,
  type FileState,
} from '@/components/uploadFile';
import { useEdgeStore } from '../lib/edgeStore';
import { useState } from 'react';

// import { Cookies } from 'react-cookie';

// const cookies = new Cookies();

//  const accessToken = cookies.get('accessToken');

//   console.log('token in frontend', accessToken)

console.log('env', process.env)

const fetchBookmarkedGigs = async (userId: string) => {
  const response = await fetch(`/api/gigs/getBookmarkedGigs`);
  const data = await response.json();

  console.log('bookmarked gigs', data)

  return data.bookmarkedGigs;
};


const createNewGig = async () => {
  const response = await axios.post('/api/gigs/createGig');
  return response.data;
};

export default function Home() {
  const router = useRouter();

  const { mutate: createGigMutation, isError, error } = useMutation({
    mutationFn: createNewGig,
    onSuccess: (data) => {
      router.push(`/createNewGig?gigId=${data._id}`);
    },
  });

  const isMutating = useIsMutating();

  const handleCreateGig = () => {
    createGigMutation();
  };

  const dispatch = useDispatch();

React.useEffect(() => {
  const fetchData = async () => {
    try {
      const userId = '65efa449e361348ac66842d0'; // Replace with the actual user ID
      const bookmarkedGigs = await fetchBookmarkedGigs(userId);
      dispatch(setBookmarkedGigs(bookmarkedGigs));
    } catch (error) {
      console.error("Error fetching bookmarked gigs:", error);
    }
  };

  fetchData();
}, [dispatch]);

const [fileStates, setFileStates] = useState<FileState[]>([]);
  const { edgestore } = useEdgeStore();
  function updateFileProgress(key: string, progress: FileState['progress']) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key,
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }


  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className=" min-h-[70vh] flex items-center bg-red-500">
        <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-16 w-full">
          <div className="grid grid-cols-12">
            <h1 className="col-start-2 col-end-12 text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8 text-center">
              Find and book{" "}
              <span className="text-blue-600 dark:text-blue-400">
                Flexible Talent
              </span>{" "}
              in multimedia
              <br />
              <span className="text-5xl">all in one place</span>
            </h1>
            <div className="col-start-2 col-end-12">
              <MainSearch />
            </div>
          </div>
        </div>
      </section>

        {/* {Create Gig Button} */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button onClick={handleCreateGig} disabled={isMutating > 0}>
            {isMutating > 0 ? 'Creating Gig...' : 'Create New Gig'}
          </Button>
          {isError && <p className="text-red-500 mt-2">{error.message}</p>}
        </div>
      </section>

      {/* Upload */}
      <section className="mx-40 my-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MultiFileDropzone
        value={fileStates}
        onChange={(files) => {
          setFileStates(files);
        }}
        onFilesAdded={async (addedFiles) => {
          setFileStates([...fileStates, ...addedFiles]);
          await Promise.all(
            addedFiles.map(async (addedFileState) => {
              try {
                const res = await edgestore.publicFiles.upload({
                  file: addedFileState.file,
                  onProgressChange: async (progress) => {
                    updateFileProgress(addedFileState.key, progress);
                    if (progress === 100) {
                      // wait 1 second to set it to complete
                      // so that the user can see the progress bar at 100%
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      updateFileProgress(addedFileState.key, 'COMPLETE');
                    }
                  },
                });
                console.log(res);
              } catch (err) {
                updateFileProgress(addedFileState.key, 'ERROR');
              }
            }),
          );
        }}
      />
        </div>
      </section>


       

      {/* SwBanners Section */}
      <section className="mx-40 my-12 bg-lime-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SwBanners />
        </div>
      </section>

      {/* CategoryBanners Section */}
      <section className="mx-40 mt-16 bg-orange-200">
      <h3 className="text-sm font-semibold text-center mb-4">Trending In</h3>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryBanners />
        </div>
      </section>

      {/* Filter Bars Section */}
      <section className="mx-40 my-16 bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FiltersBars />
        </div>
      </section>

      {/* PersonGrid Section */}
      <section className="mx-40 my-16 bg-black">
        <div className="max-w-7xl container mx-auto px-4 sm:px-6 lg:px-8">
          <GigsGridInf />
        </div>
      </section>
    </div>
  );
}
