import React from 'react';
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export const CompanyInfo: React.FC = () => {
  return (
    <div className="bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Consultation Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">咨询</h2>
              <p className="text-gray-600 mb-8">欢迎随时咨询。可通过电话或专用表格进行咨询。</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">电话咨询</h3>
                  <p className="text-2xl font-bold text-primary">048-951-1089</p>
                  <p className="text-gray-600">受理时间：10:00-19:00</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">表格咨询</h3>
                  <Button className="!rounded-button whitespace-nowrap">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                  <p className="text-gray-600">24小时受理</p>
                </div>
              </div>
            </div>
          </div>

          {/* About Us Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">关于我们</h2>
              <p className="text-gray-600 mb-8">
                我们始终将客户的满意度放在首位，致力于为每一位客户提供贴心的服务。
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                Business introduction
                <span className="block text-base font-normal text-gray-600 mt-1">事业介绍</span>
              </h3>
              <div className="text-gray-600 space-y-4">
                <p>为全面支持客户的汽车生活，本公司开展了多项业务。</p>
                <p>我们以&quot;信赖&quot;&quot;安心&quot;&quot;高品质&quot;为宗旨，将持续为客户提供令人满意的服务。</p>
                <p>衷心期待各位的光临。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 