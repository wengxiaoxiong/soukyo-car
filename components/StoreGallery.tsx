"use client"

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, Award, ChevronLeft, ChevronRight } from 'lucide-react';

interface StoreImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
}

// 店面图片数据 - 按照用户体验流程逻辑排序：店内环境 → 精选车辆 → 安全保障 → 专业维护 → 清洁整洁 → 便捷交付 → 专业交付 → 温馨服务
const storeImagesData = [
  {
    id: 'diannei',
    src: 'https://0nrui4uhjcvewjzb.public.blob.vercel-storage.com/store-gallery/diannei.webp',
    key: 'diannei'
  },
  {
    id: 'xuanche',
    src: 'https://0nrui4uhjcvewjzb.public.blob.vercel-storage.com/store-gallery/xuanche.webp',
    key: 'xuanche'
  },
  {
    id: 'anquan',
    src: 'https://0nrui4uhjcvewjzb.public.blob.vercel-storage.com/store-gallery/anquan.webp',
    key: 'anquan'
  },
  {
    id: 'weihu',
    src: 'https://0nrui4uhjcvewjzb.public.blob.vercel-storage.com/store-gallery/weihu.webp',
    key: 'weihu'
  },
  {
    id: 'qingjie',
    src: 'https://0nrui4uhjcvewjzb.public.blob.vercel-storage.com/store-gallery/qingjie.webp',
    key: 'qingjie'
  },
  {
    id: 'jiaofu',
    src: 'https://0nrui4uhjcvewjzb.public.blob.vercel-storage.com/store-gallery/jiaofu.webp',
    key: 'jiaofu'
  },
  {
    id: 'jiaofu1',
    src: 'https://0nrui4uhjcvewjzb.public.blob.vercel-storage.com/store-gallery/jiaofu1.webp',
    key: 'jiaofu1'
  },
  {
    id: 'fenwei',
    src: 'https://0nrui4uhjcvewjzb.public.blob.vercel-storage.com/store-gallery/fenwei.webp',
    key: 'fenwei'
  }
];

export const StoreGallery: React.FC = () => {
  const t = useTranslations('StoreGallery');
  const locale = useLocale();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // 根据翻译生成图片数据
  const storeImages: StoreImage[] = storeImagesData.map((imageData) => ({
    id: imageData.id,
    src: imageData.src,
    alt: t(`images.${imageData.key}.title`),
    title: t(`images.${imageData.key}.title`),
    description: t(`images.${imageData.key}.description`)
  }));

  // 自动播放功能
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % storeImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, storeImages.length]);

  // 暂停自动播放
  const pauseAutoPlay = () => setIsAutoPlaying(false);
  const resumeAutoPlay = () => setIsAutoPlaying(true);

  // 导航到上一张图片
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? storeImages.length - 1 : prevIndex - 1
    );
    pauseAutoPlay();
  };

  // 导航到下一张图片
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % storeImages.length);
    pauseAutoPlay();
  };

  // 导航到指定图片
  const goToImage = (index: number) => {
    setCurrentIndex(index);
    pauseAutoPlay();
  };

  return (
         <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <Camera className="w-4 h-4" />
            <span>{t('top_banner')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>



        {/* Carousel Section */}
        <div className="relative mb-16">
          {/* Main Carousel */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <div className="aspect-[16/9] relative">
              <Image
                src={storeImages[currentIndex].src}
                alt={storeImages[currentIndex].alt}
                fill
                className="object-cover transition-all duration-500 ease-in-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority
              />
              
              {/* 灰色渐变遮罩和文字说明 */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
              
              {/* 文字内容 */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  {storeImages[currentIndex].title}
                </h3>
                <p className="text-lg md:text-xl opacity-90 max-w-2xl leading-relaxed">
                  {storeImages[currentIndex].description}
                </p>
              </div>
            </div>

            {/* 导航按钮 */}
            <button
              onClick={goToPrevious}
              onMouseEnter={pauseAutoPlay}
              onMouseLeave={resumeAutoPlay}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 hover:scale-110"
              aria-label="上一张图片"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={goToNext}
              onMouseEnter={pauseAutoPlay}
              onMouseLeave={resumeAutoPlay}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 hover:scale-110"
              aria-label="下一张图片"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* 缩略图导航 */}
          <div className="mt-6 flex justify-center">
            <div className="flex gap-3 overflow-x-auto md:overflow-x-hidden pb-2">
              {storeImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => goToImage(index)}
                  onMouseEnter={pauseAutoPlay}
                  onMouseLeave={resumeAutoPlay}
                  className={`group flex-shrink-0 relative rounded-lg transition-all duration-200 ${
                    index === currentIndex
                      ? 'ring-2 ring-blue-500'
                      : ''
                  }`}
                >
                  <div className="w-20 h-16 relative overflow-hidden rounded-md">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                      sizes="80px"
                    />
                    {index === currentIndex && (
                      <div className="absolute inset-0 bg-blue-500/20" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>


        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Award className="w-5 h-5 text-blue-600" />
            <span className="text-gray-600">{t('cta.text')}</span>
            <Link 
              href={`/${locale}/store`}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
            >
              {t('cta.link')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
