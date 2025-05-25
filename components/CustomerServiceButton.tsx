import React from 'react';
import { Button } from "@/components/ui/button";
import { Headset } from "lucide-react";

export const CustomerServiceButton: React.FC = () => {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Button className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg !rounded-button" size="icon">
        <Headset className="w-6 h-6" />
      </Button>
    </div>
  );
}; 