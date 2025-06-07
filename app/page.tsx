import React from 'react';
import { HeroSection } from "@/components/HeroSection";
import { FeaturedCars } from "@/components/FeaturedCars";
import { StoreLocations } from "@/components/StoreLocations";
import { CompanyInfo } from "@/components/CompanyInfo";

const App: React.FC = () => {
  return (
    <div className="min-h-[1024px]">
      <HeroSection />
      <FeaturedCars />
      <StoreLocations />
      <CompanyInfo />
    </div>
  );
};

export default App;
