"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Users, Plane } from "lucide-react";

export const HeroSection: React.FC = () => {
  return (
    <div className="relative min-h-[600px] md:h-[600px] w-full">
      {/* Hero Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url('https://ai-public.mastergo.com/ai/img_res/ab15db9d2c399255794e1b782e0095a4.jpg')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
      </div>
      {/* Hero Content */}
      <div className="relative max-w-[1440px] mx-auto px-4 md:px-8 pt-32 md:pt-48 pb-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">探索日本，从这里开始</h1>
          <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-12">便捷的租车服务，让您的旅程更自由</p>
          {/* Search Box */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-full md:flex-1">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    className="pl-10 h-12 text-sm border-none"
                    placeholder="选择取车地点"
                  />
                </div>
              </div>
              <div className="w-full md:flex-1">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    className="pl-10 h-12 text-sm border-none"
                    placeholder="选择取还车日期"
                  />
                </div>
              </div>
              <div className="w-full md:flex-1">
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    className="pl-10 h-12 text-sm border-none"
                    type="number"
                    defaultValue="4"
                    min="1"
                    max="9"
                  />
                </div>
              </div>
              <Button className="w-full md:w-auto h-12 px-8 !rounded-button whitespace-nowrap" size="lg">
                立即查找
              </Button>
            </div>
          </div>
          {/* Quick Airport Links */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-4 md:mt-6">
            <Button
              variant="outline"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 !rounded-button whitespace-nowrap w-full md:w-auto"
            >
              <Plane className="w-4 h-4 mr-2" />
              成田机场取车
            </Button>
            <Button
              variant="outline"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 !rounded-button whitespace-nowrap w-full md:w-auto"
            >
              <Plane className="w-4 h-4 mr-2" />
              羽田机场取车
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 