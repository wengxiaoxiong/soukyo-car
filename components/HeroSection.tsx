"use client"

import React from 'react';
import { Users, MapPin, Sparkles, Car } from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export const HeroSection: React.FC = () => {
  const t = useTranslations('HeroSection');
  const locale = useLocale();
  const router = useRouter();

  const locationCards = [
    { title: t('locations.narita.title'), bg: 'https://0nrui4uhjcvewjzb.public.blob.vercel-storage.com/hero-images/chengtian.webp' },
    { title: t('locations.haneda.title'), bg: 'https://0nrui4uhjcvewjzb.public.blob.vercel-storage.com/hero-images/yutian.webp' },
    { title: t('locations.kami_ikebukuro.title'), bg: 'https://0nrui4uhjcvewjzb.public.blob.vercel-storage.com/hero-images/chidai.webp' },
  ];

  const handleCardClick = () => {
    router.push(`/${locale}/package`);
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* 背景图片和渐变遮罩 */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://ai-public.mastergo.com/ai/img_res/ab15db9d2c399255794e1b782e0095a4.jpg')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/75 to-slate-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* 装饰性元素 - 在移动端隐藏部分 */}
      <div className="absolute top-20 right-10 opacity-30 animate-pulse hidden sm:block">
        <Sparkles className="w-8 h-8 text-blue-400" />
      </div>
      <div className="absolute top-40 right-32 opacity-20 animate-pulse delay-500 hidden lg:block">
        <Car className="w-6 h-6 text-white" />
      </div>
      <div className="absolute bottom-32 left-10 opacity-20 animate-pulse delay-1000 hidden sm:block">
        <Sparkles className="w-6 h-6 text-blue-300" />
      </div>

      {/* 主内容 */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-8 lg:py-0">
          
          {/* 左侧：标题和描述 */}
          <div className="text-center lg:text-left order-1 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 backdrop-blur-sm rounded-full text-blue-200 text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-blue-400/30">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{t('top_banner.text')}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              {t('title.part1')}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> {t('title.japan')}</span>
              <br />
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white/90">{t('title.part2')}</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0 px-2 sm:px-0">
              {t('description')}
            </p>

            {/* 特色标签 - 移动端优化 */}
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start mb-6 sm:mb-8 px-2 sm:px-0">
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-white/90 text-xs sm:text-sm">
                <Car className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{t('features.car_models')}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-white/90 text-xs sm:text-sm">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{t('features.airport_pickup')}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-white/90 text-xs sm:text-sm">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{t('features.flexible_booking')}</span>
              </div>
            </div>
          </div>

          {/* 右侧：三张目的地卡片 */}
          <div className="w-full order-2 lg:order-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-6">
              {locationCards.map((card, index) => (
                <div
                  key={card.title}
                  onClick={handleCardClick}
                  className={`relative rounded-2xl overflow-hidden shadow-lg bg-gray-200 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group ${index === 2 ? 'sm:col-span-2' : ''}`}
                  style={{
                    backgroundImage: card.bg ? `url(${card.bg})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 group-hover:via-black/30 transition-all duration-300" />
                  <div className="relative p-5 sm:p-6 h-40 sm:h-48 flex flex-col justify-end">
                    <h3 className="text-white text-xl sm:text-2xl font-bold tracking-wide transform group-hover:translate-y-[-2px] transition-transform duration-300">{card.title}</h3>
                  </div>
                  {/* 悬浮指示器 */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Car className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 