import React from 'react';
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedCars } from "@/components/FeaturedCars";
import { StoreLocations } from "@/components/StoreLocations";
import { CompanyInfo } from "@/components/CompanyInfo";
import { Footer } from "@/components/Footer";
import { CustomerServiceButton } from "@/components/CustomerServiceButton";

const App: React.FC = () => {
  return (
    <div className="min-h-[1024px]">
      <Header />
      <HeroSection />
      <FeaturedCars />
      <StoreLocations />
      <CompanyInfo />
      <Footer />
      <CustomerServiceButton />
    </div>
  );
};

export default App;
