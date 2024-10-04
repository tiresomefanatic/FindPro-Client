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
import HeroMarquee from "@/components/heroMarquee";

import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "../components/ui/hero-highlight";

import GigsGridInf from "@/components/gigsGridInfinite";

import FiltersBars from "../components/filterBar";
import FilterDrawer from "../components/filtersDrawer";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

import { useMutation, useIsMutating } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { useEdgeStore } from "../lib/edgeStore";
import { useState } from "react";

import { useMediaQuery } from "@uidotdev/usehooks";
import { RootState } from "@/redux/store";
import GigsGrid from "@/components/gigsGrid";
import SparklesText from "@/components/ui/sparkleText";
import WordRotate from "@/components/ui/wordrotate";
import { AnimatedBeamMultipleOutput } from "@/components/animatedBeamMulti";
import WelcomePopup from "@/components/welcomepopup";


export default function Home() {
  const router = useRouter();
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
    <div className="min-h-screen">
      <WelcomePopup/>
      {/* Hero Section */}
      <HeroHighlight>
        <section className="min-h-[90vh] grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8 px-4 sm:px-8 md:px-16 lg:px-24">
          <div className="flex mt-40 justify-center lg:justify-start">
            <div className="w-full max-w-xl px-4">
              <div className="flex flex-col items-center lg:items-start justify-start text-center lg:text-left gap-y-4 sm:gap-y-8">
                <div className="grid grid-cols-1 gap-y-2">
                  <h1 className="text-5xl sm:text-5xl font-bold">
                    Hire the best
                  </h1>
                  <div className="h-[60px]">
                    <WordRotate
                      className="text-5xl sm:text-5xl font-bold text-black"
                      words={[
                        "Video Editors",
                        "Writers",
                        "Photographers",
                        "VFX Artists",
                      ]}
                    />
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1.5,
                    ease: [0.4, 0.0, 0.2, 1],
                    delay: 0.3,
                  }}
                  className="w-full"
                >
                  <MainSearch shouldRoute={true} />
                </motion.div>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex mt-8 justify-center">
            <AnimatedBeamMultipleOutput className="w-full h-[600px]" />
          </div>
        </section>
      </HeroHighlight>

      {/* {Create Gig Button}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button onClick={handleCreateGig} disabled={isMutating > 0}>
            {isMutating > 0 ? "Creating Gig..." : "Create New Gig"}
          </Button>
          {isError && <p className="text-red-500 mt-2">{error.message}</p>}
        </div>
      </section> */}

      {/* SwBanners Section */}
      <section className=" py-12 ">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 1.5,
            ease: [0.4, 0.0, 0.2, 1],
            delay: 0.3,
          }}
          className="container mx-auto px-4"
        >
          <SwBanners />
        </motion.div>
      </section>

      {/* CategoryBanners Section */}
      {(isLargeDevice || isExtraLargeDevice) && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <CategoryBanners />
          </div>
        </section>
      )}

      {/* PersonGrid Section */}
      <section className="my-16 ">
        <div className="container mx-auto px-4">
          <GigsGrid />
        </div>
      </section>
    </div>
  );
}
