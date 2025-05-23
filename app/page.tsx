"use client"

// 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  User, 
  MapPin, 
  Calendar, 
  Users, 
  Plane, 
  Cog, 
  Clock, 
  Navigation, 
  Mail, 
  Headset, 
  Phone, 
  Instagram, 
  Twitter,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-[1024px]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4 md:gap-12">
              <h1 className="text-lg md:text-xl font-bold">Soukyo租车</h1>
              <nav className="hidden md:flex items-center gap-8">
                <a href="#" className="text-gray-600 hover:text-gray-900">首页</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">车型</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">门店</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">关于我们</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="!rounded-button whitespace-nowrap hidden md:flex">
                <Globe className="w-4 h-4 mr-2" />
                Language
              </Button>
              <Button variant="outline" className="!rounded-button whitespace-nowrap md:hidden">
                <Globe className="w-4 h-4" />
                Lang
              </Button>
              <Button className="!rounded-button whitespace-nowrap">
                <User className="w-4 h-4 mr-2" />
                登录
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden !rounded-button" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-sm">
            <div className="max-w-[1440px] mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                <a href="#" className="text-gray-600 hover:text-gray-900 py-2">首页</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 py-2">车型</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 py-2">门店</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 py-2">关于我们</a>
              </nav>
            </div>
          </div>
        )}
      </header>
      {/* Hero Section */}
      <div className="relative h-[500px] md:h-[600px] w-full">
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
        <div className="relative max-w-[1440px] mx-auto px-4 md:px-8 pt-32">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">探索日本，从这里开始</h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 md:mb-12">便捷的租车服务，让您的旅程更自由</p>
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
            <div className="flex flex-col md:flex-row gap-4 mt-6">
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
      {/* Featured Cars */}
      <div className="bg-gray-50">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12">推荐车型</h2>
          <div className="relative">
            {/* 移动端滚动指示 */}
            <div className="md:hidden mb-4 text-sm text-gray-500 flex items-center">
              <span>← 左右滑动查看更多 →</span>
            </div>
            {/* 滚动容器 */}
            <div className="flex overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 scrollbar-hide">
              {[
                {
                  name: 'Toyota Crown',
                  type: '豪华轿车',
                  price: '￥688',
                  image: 'https://ai-public.mastergo.com/ai/img_res/e8ecc253a5e6100ab260268be804cff7.jpg',
                  location: '成田机场可取还',
                  seats: '5座',
                  transmission: '自动档'
                },
                {
                  name: 'Lexus RX',
                  type: '中型SUV',
                  price: '￥888',
                  image: 'https://ai-public.mastergo.com/ai/img_res/b60edb48f6231afe2377abfabca6df06.jpg',
                  location: '羽田机场可取还',
                  seats: '5座',
                  transmission: '自动档'
                },
                {
                  name: 'Mercedes-Benz V-Class',
                  type: '商务车',
                  price: '￥1288',
                  image: 'https://ai-public.mastergo.com/ai/img_res/bb3d7e5a7094b25349c48ee525d7fb60.jpg',
                  location: '池袋店可取还',
                  seats: '7座',
                  transmission: '自动档'
                }
              ].map((car, index) => (
                <Card key={index} className="overflow-hidden flex-shrink-0 w-[280px] md:w-auto mx-2 first:ml-0 last:mr-0 md:mx-0">
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/80 text-black hover:bg-white/90">
                        {car.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{car.name}</h3>
                        <p className="text-gray-600 text-sm">
                          <MapPin className="inline w-4 h-4 mr-2" />
                          {car.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">起步价/天</div>
                        <div className="text-xl font-bold text-primary">{car.price}</div>
                      </div>
                    </div>
                    <div className="flex gap-4 mb-6">
                      <Badge variant="secondary">
                        <Users className="w-4 h-4 mr-2" />
                        {car.seats}
                      </Badge>
                      <Badge variant="secondary">
                        <Cog className="w-4 h-4 mr-2" />
                        {car.transmission}
                      </Badge>
                    </div>
                    <Button className="w-full !rounded-button whitespace-nowrap">
                      立即预订
                    </Button>
                  </div>
                </Card>
              ))}
              
              {/* "查看更多"卡片 */}
              <Card className="overflow-hidden flex-shrink-0 w-[280px] md:w-auto mx-2 last:mr-0 md:mx-0 bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center">
                <a href="#" className="p-6 flex flex-col items-center justify-center w-full h-full min-h-[380px]">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <ChevronRight className="w-6 h-6 text-gray-500" />
                  </div>
                  <p className="text-lg font-medium text-gray-700">查看更多车型</p>
                </a>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* Store Locations */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12">门店网络</h2>
        <div className="relative">
          {/* 移动端滚动指示 */}
          <div className="md:hidden mb-4 text-sm text-gray-500 flex items-center">
            <span>← 左右滑动查看更多 →</span>
          </div>
          {/* 滚动容器 */}
          <div className="flex overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 scrollbar-hide">
            {[
              {
                name: '成田机场店',
                address: '千叉县成田市三里塚字御料牧場1-1',
                time: '07:00-22:00',
                image: 'https://ai-public.mastergo.com/ai/img_res/cdf485d92b8e70859685cbb1dc683192.jpg'
              },
              {
                name: '池袋店',
                address: '东京都丰岛区西池袋1丁目',
                time: '09:00-20:00',
                image: 'https://ai-public.mastergo.com/ai/img_res/3152122a6fdd97d2f37d6054f81a3e61.jpg'
              },
              {
                name: '琦玉店',
                address: '琦玉县さいたま市大宮区桜木町1-7-5',
                time: '09:00-20:00',
                image: 'https://ai-public.mastergo.com/ai/img_res/0ac5ab1537398847b6ba818693d78968.jpg'
              }
            ].map((store, index) => (
              <Card key={index} className="overflow-hidden flex-shrink-0 w-[280px] md:w-auto mx-2 first:ml-0 last:mr-0 md:mx-0">
                <div className="relative h-36 md:h-40">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">{store.name}</h3>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-start">
                      <MapPin className="w-4 h-4 mt-1 mr-3" />
                      <span>{store.address}</span>
                    </p>
                    <p className="flex items-center">
                      <Clock className="w-4 h-4 mr-3" />
                      <span>{store.time}</span>
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-6 !rounded-button whitespace-nowrap"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    导航前往
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Company Information */}
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

      {/* Footer */}
      {/* Customer Service Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg !rounded-button" size="icon">
          <Headset className="w-6 h-6" />
        </Button>
      </div>
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
                  +81 3-1234-5678
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
    </div>
  );
};
export default App
