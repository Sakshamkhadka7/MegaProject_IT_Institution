import React from "react";
import HomeHeroSection from "./HomeHeroSection";
import HomeHeroSection2 from "./HomeHeroSection2";
import HomeHeroSection3 from "./HomeHeroSection3";
import HomeHeroSection4 from "./HomeHeroSection4";
import Alumni from "./Alumni";


const Home = () => {
  return (
    <div>
      <HomeHeroSection />
      <HomeHeroSection3/>
      <HomeHeroSection2/>
      <Alumni/>
      <HomeHeroSection4/>
    </div>
  );
};

export default Home;
