import React from 'react';
import { HeroSection } from "@/components/HeroSection";
import { FeaturedCars } from "@/components/FeaturedCars";
import { StoreLocations } from "@/components/StoreLocations";
import { CompanyInfo } from "@/components/CompanyInfo";

const App: React.FC = () => {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <FeaturedCars />
      <StoreLocations />
      <CompanyInfo />
    </main>
  );
};

export default App;
