import React from 'react';
import { HeroSection } from "@/components/HeroSection";
import { FeaturedPackages } from "@/components/FeaturedPackages";
import { StoreLocations } from "@/components/StoreLocations";
import { CompanyInfo } from "@/components/CompanyInfo";

const App: React.FC = () => {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <FeaturedPackages />
      <StoreLocations />
      <CompanyInfo />
    </main>
  );
};

export default App;
