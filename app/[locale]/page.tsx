import React from 'react';
import { HeroSection } from "@/components/HeroSection";
import { StoreGallery } from "@/components/StoreGallery";
import { FeaturedPackages } from "@/components/FeaturedPackages";
import { StoreLocations } from "@/components/StoreLocations";
import { CompanyInfo } from "@/components/CompanyInfo";
import { VideoTutorials } from "@/components/VideoTutorials";

const App: React.FC = () => {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <StoreGallery />
      <FeaturedPackages />
      <StoreLocations />
      <VideoTutorials />
      <CompanyInfo />
    </main>
  );
};

export default App;
