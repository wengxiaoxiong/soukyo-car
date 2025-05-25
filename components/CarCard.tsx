import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Cog } from "lucide-react";

interface CarCardProps {
  name: string;
  type: string;
  price: string;
  image: string;
  location: string;
  seats: string;
  transmission: string;
}

export const CarCard: React.FC<CarCardProps> = ({
  name,
  type,
  price,
  image,
  location,
  seats,
  transmission
}) => {
  return (
    <Card className="overflow-hidden flex-shrink-0 w-[280px] md:w-auto mx-2 first:ml-0 last:mr-0 md:mx-0">
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/80 text-black hover:bg-white/90">
            {type}
          </Badge>
        </div>
      </div>
      <div className="p-6 flex flex-col h-[calc(100%-12rem)] md:h-[calc(100%-14rem)]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{name}</h3>
            <p className="text-gray-600 text-sm">
              <MapPin className="inline w-4 h-4 mr-2" />
              {location}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">起步价/天</div>
            <div className="text-xl font-bold text-primary">{price}</div>
          </div>
        </div>
        <div className="flex gap-4 mb-6">
          <Badge variant="secondary">
            <Users className="w-4 h-4 mr-2" />
            {seats}
          </Badge>
          <Badge variant="secondary">
            <Cog className="w-4 h-4 mr-2" />
            {transmission}
          </Badge>
        </div>
        <Button className="w-full !rounded-button whitespace-nowrap mt-auto">
          立即预订
        </Button>
      </div>
    </Card>
  );
}; 