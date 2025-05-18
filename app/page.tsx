'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */
// 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// 横向logo.png
import logo from "@/public/logo.png";
import Image from "next/image";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [i18n, setI18n] = useState("en");

  const i18n_mock = {
    "en":"english",
    "zh":"中文",
    "ja":"日本語",
    "ko":"한국어",
    "vi":"Tiếng Việt",
    "th":"ไทย",
    "id":"Bahasa Indonesia",
    "ms":"Bahasa Melayu",
  }

  // 检测用户设备语言并设置对应语言
  useEffect(() => {
    const detectUserLanguage = () => {
      const browserLang = navigator.language.split('-')[0]; // 获取浏览器语言，例如 'zh-CN' 取 'zh'
      const supportedLangs = Object.keys(i18n_mock);
      
      if (supportedLangs.includes(browserLang)) {
        setI18n(browserLang);
      } else {
        // 如果不支持当前浏览器语言，默认使用英语
        setI18n("en");
      }
    };

    detectUserLanguage();
  }, []);

  // 租车服务数据
  const carData = [
    {
      title: "保时捷 911 Carrera",
      price: "12,800円",
      date: "可租：2024/2/1 - 2024/2/28",
      image: "https://ai-public.mastergo.com/ai/img_res/5ced5ad86ae5da7130c4a77f6ac1aadf.jpg"
    },
    {
      title: "奔驰 AMG GT",
      price: "15,600円",
      date: "可租：2024/2/1 - 2024/2/28",
      image: "https://ai-public.mastergo.com/ai/img_res/fb93b24a95deba511b65b19a3f34b363.jpg"
    },
    {
      title: "法拉利 F8",
      price: "28,800円",
      date: "可租：2024/2/1 - 2024/2/28",
      image: "https://ai-public.mastergo.com/ai/img_res/988b6fc347e61899b3ae567b1e4c8dab.jpg"
    },
    {
      title: "兰博基尼 Huracan",
      price: "32,000円",
      date: "可租：2024/2/1 - 2024/2/28",
      image: "https://ai-public.mastergo.com/ai/img_res/8d24131fc50b57793e6282557faa5049.jpg"
    }
  ];

  // 服务项目数据
  const serviceData = [
    {
      title: "豪华租车",
      desc: "多款高端车型可选",
      image: "https://ai-public.mastergo.com/ai/img_res/abaa9fd3d66bd2281348e691a8df8398.jpg"
    },
    {
      title: "精致洗护",
      desc: "专业团队细致服务",
      image: "https://ai-public.mastergo.com/ai/img_res/9e20b99ce49ef2c498883dcf3fbb1f7d.jpg"
    },
    {
      title: "二手交易",
      desc: "严选优质二手车源",
      image: "https://ai-public.mastergo.com/ai/img_res/03c073538cd33bc97889210b683fee13.jpg"
    },
    {
      title: "改装升级",
      desc: "打造个性座驾",
      image: "https://ai-public.mastergo.com/ai/img_res/5754f51e6fcc0bb177836e94e9fe3986.jpg"
    }
  ];

  return (
    <div className="min-h-[1024px] w-full mx-auto bg-white">
      {/* 导航栏 */}
      <nav className="w-full fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between h-16 px-4 md:px-8">
          <div className="flex items-center gap-2">
              <Image
                src={logo}
                alt="Soukyo Logo"
                height={40}
              />
          </div>
          
          {/* 桌面端导航 */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">{i18n_mock[i18n as keyof typeof i18n_mock]}</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">租车服务</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">洗车美容</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">二手车交易</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">改装服务</a>
            <Button className="!rounded-button whitespace-nowrap bg-black text-white hover:bg-gray-800">
              <i className="fab fa-google mr-2"></i>
              Google 登录
            </Button>
          </div>
          
          {/* 移动端菜单按钮 */}
          <button 
            className="md:hidden flex items-center" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b shadow-lg animate-in slide-in-from-top">
            <div className="flex flex-col p-4 space-y-4">
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium py-2">租车服务</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium py-2">洗车美容</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium py-2">二手车交易</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium py-2">改装服务</a>
              <Button className="!rounded-button whitespace-nowrap w-full bg-black text-white hover:bg-gray-800">
                <i className="fab fa-google mr-2"></i>
                Google 登录
              </Button>
            </div>
          </div>
        )}
      </nav>
      
      {/* Hero区域 */}
      <div className="relative h-[500px] md:h-[700px] mt-16 overflow-hidden">
        <img
          src="https://ai-public.mastergo.com/ai/img_res/c67bae70bea3757e7dc46b813509e6ab.jpg"
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent">
          <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-16 md:py-32">
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-4 md:mb-8 leading-tight animate-fade-in">創挙自動車</h1>
            <p className="text-lg md:text-2xl text-gray-200 mb-8 md:mb-12 max-w-2xl leading-relaxed">为热爱生活的您，打造专属的在日汽车服务体验。从豪华租赁到专业改装，一站式满足您的品质需求。</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="!rounded-button whitespace-nowrap bg-white text-black hover:bg-gray-100 px-6 py-5 md:px-8 md:py-6 text-base md:text-lg">
                立即预约体验
              </Button>
              <Button className="!rounded-button whitespace-nowrap bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-5 md:px-8 md:py-6 text-base md:text-lg">
                了解更多服务
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 租车服务卡片 */}
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 pt-16 md:pt-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 md:mb-4">租车服务</h2>
        <p className="text-gray-600 text-center mb-8 md:mb-16 text-base md:text-lg">多款豪华车型，灵活租赁方案</p>
        
        {/* 移动端左右滑动的轮播 */}
        <div className="sm:hidden relative mb-16">
          <Swiper
            modules={[Pagination, Navigation]}
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={1.2}
            centeredSlides={false}
            className="pb-10"
          >
            {carData.map((car, index) => (
              <SwiperSlide key={index}>
                <Card className="overflow-hidden h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={car.image}
                      alt={car.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{car.title}</h3>
                    <p className="text-2xl font-bold text-red-600 mb-2">{car.price}<span className="text-sm text-gray-600">/天</span></p>
                    <p className="text-sm text-gray-600 mb-2">{car.date}</p>
                    <p className="text-sm text-gray-600 mb-4">成田店/埼玉店</p>
                    <Button className="w-full !rounded-button whitespace-nowrap bg-black text-white hover:bg-gray-800">
                      立即预约
                    </Button>
                  </div>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        {/* 电脑端网格布局 */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-24">
          {carData.map((car, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={car.image}
                  alt={car.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{car.title}</h3>
                <p className="text-2xl font-bold text-red-600 mb-2">{car.price}<span className="text-sm text-gray-600">/天</span></p>
                <p className="text-sm text-gray-600 mb-2">{car.date}</p>
                <p className="text-sm text-gray-600 mb-4">成田店/埼玉店</p>
                <Button className="w-full !rounded-button whitespace-nowrap bg-black text-white hover:bg-gray-800">
                  立即预约
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* 一站式汽车服务 */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 md:mb-4">一站式汽车服务</h2>
        <p className="text-gray-600 text-center mb-8 md:mb-16 text-base md:text-lg">专业团队，用心服务，为您的爱车保驾护航</p>
        
        {/* 移动端左右滑动的服务轮播 */}
        <div className="sm:hidden relative mb-16">
          <Swiper
            modules={[Pagination, Navigation]}
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={1.2}
            centeredSlides={false}
            className="pb-10"
          >
            {serviceData.map((service, index) => (
              <SwiperSlide key={index}>
                <Card className="overflow-hidden group cursor-pointer h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-gray-600">{service.desc}</p>
                  </div>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        {/* 电脑端网格布局 */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {serviceData.map((service, index) => (
            <Card key={index} className="overflow-hidden group cursor-pointer">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* 实时动态 */}
      <div className="bg-gray-50 py-6 mt-16">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <i className="fas fa-broadcast-tower text-yellow-500"></i>
              <span className="text-sm font-medium text-gray-900">实时动态</span>
            </div>
            <div className="w-full">
              <Swiper
                modules={[Autoplay]}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                direction="vertical"
                className="h-10"
              >
                {[
                  "刚刚 · 涩谷旗舰店 · 田中先生预约了全新迈巴赫 S680",
                  "2分钟前 · 银座店 · 山本女士的保时捷 911 完成精致洗护",
                  "5分钟前 · 新宿店 · 铃木先生的兰博基尼 SVJ 改装完成",
                  "8分钟前 · 池袋店 · 佐藤先生订购了全新法拉利 SF90",
                ].map((text, index) => (
                  <SwiperSlide key={index}>
                    <p className="text-gray-600 font-medium text-sm md:text-base truncate">{text}</p>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
      
      {/* 优惠活动 */}
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="relative overflow-hidden rounded-xl">
          <img
            src="https://ai-public.mastergo.com/ai/img_res/70dd2c6cd22d2ecc05a80850adbca7dc.jpg"
            className="absolute inset-0 w-full h-full object-cover"
            alt="Promotion Background"
          />
          <div className="relative bg-gradient-to-r from-black/90 to-black/50 p-6 md:p-16 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-sm font-semibold text-yellow-400 mb-2 md:mb-4 block">限时专享</span>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">新客尊享 VIP 洗护服务</h2>
              <p className="text-base md:text-xl text-gray-300">预约即可享受 9 折优惠，专业团队为您的爱车精心护理</p>
            </div>
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <Button className="!rounded-button whitespace-nowrap bg-white text-black hover:bg-gray-100 px-8 py-5 md:py-6 text-base md:text-lg">
                立即预约
              </Button>
              <p className="text-sm text-gray-400 text-center">优惠名额有限</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 页脚 */}
      <footer className="bg-gray-900 text-gray-300 py-12 md:py-16">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold mb-4">关于我们</h3>
              <p className="text-sm">Soukyo 致力于为客户提供高品质的汽车生活服务，是您值得信赖的专业伙伴。</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">服务项目</h3>
              <ul className="space-y-2 text-sm">
                <li>豪华车租赁</li>
                <li>精致洗护</li>
                <li>二手车交易</li>
                <li>改装服务</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">联系方式</h3>
              <ul className="space-y-2 text-sm">
                <li>电话：03-1234-5678</li>
                <li>邮箱：info@soukyo.jp</li>
                <li>地址：东京都涩谷区代々木1-1-1</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">社交媒体</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white"><i className="fab fa-instagram text-xl"></i></a>
                <a href="#" className="hover:text-white"><i className="fab fa-line text-xl"></i></a>
                <a href="#" className="hover:text-white"><i className="fab fa-twitter text-xl"></i></a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8 text-sm text-center">
            <p>© 2024 Soukyo Car Service. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App
