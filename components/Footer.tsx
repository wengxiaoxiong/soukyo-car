import React from 'react';
import { Button } from "@/components/ui/button";
import { Phone, Mail, Instagram, Twitter } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-8 md:mt-16">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-6">Soukyo租车</h3>
            <p className="text-gray-400">
              为您提供优质的租车服务，让您的日本之旅更加便捷舒适。
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2 text-gray-400">
              <li>关于我们</li>
              <li>服务条款</li>
              <li>隐私政策</li>
              <li>常见问题</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">联系方式</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                +81 080-4612-0188
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                contact@soukyo.com
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">关注我们</h4>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="!rounded-button">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="!rounded-button">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="!rounded-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 8.01c0-4.42-4.48-8-10-8s-10 3.58-10 8c0 4.13 3.67 7.55 8.62 7.95l1.37.06c.97 0 1.88.31 2.26.87.38.57.1 1.38-.57 2.12" />
                  <path d="M22 11.4c.11-.81.19-1.64.19-2.49" />
                  <path d="M15.26 18.11c-1.06.16-1.76.22-2.76.22" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 md:mt-12 pt-8 text-center text-gray-400">
          <p>© 2024 Soukyo租车. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}; 