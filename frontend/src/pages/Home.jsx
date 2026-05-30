import React, { lazy, Suspense } from "react";

import HomeHeroSection from "./HomeHeroSection";

const HomeHeroSection2 = lazy(() => import("./HomeHeroSection2"));
const HomeHeroSection3 = lazy(() => import("./HomeHeroSection3"));
const HomeHeroSection4 = lazy(() => import("./HomeHeroSection4"));
const Alumni = lazy(() => import("./Alumni"));

const Home = () => {
  return (
    <>
      <HomeHeroSection />

      <Suspense fallback={<div>Loading...</div>}>
        <HomeHeroSection3 />
        <HomeHeroSection2 />
        <Alumni />
        <HomeHeroSection4 />
      </Suspense>
    </>
  );
};

export default Home;
