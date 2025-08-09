"use client"

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Play, Video, MapPin, Languages } from 'lucide-react';

interface VideoData {
  airport: 'narita' | 'haneda';
  language: 'ja' | 'en' | 'zh';
  url: string;
}

const videoData: VideoData[] = [
  // 成田机场
  { airport: 'narita', language: 'ja', url: 'https://youtu.be/fMdAeNwt0Dw' },
  { airport: 'narita', language: 'en', url: 'https://youtu.be/C2gvQKoC6mA' },
  { airport: 'narita', language: 'zh', url: 'https://youtu.be/V-fMU7PmSYI' },
  // 羽田机场
  { airport: 'haneda', language: 'ja', url: 'https://youtu.be/jxUOhM11DCI' },
  { airport: 'haneda', language: 'en', url: 'https://youtu.be/AKWfCb8pdqI' },
  { airport: 'haneda', language: 'zh', url: 'https://youtu.be/a41C6bw8Kck' },
];

export const VideoTutorials: React.FC = () => {
  const t = useTranslations('VideoTutorials');
  const locale = useLocale();
  const [selectedLanguage, setSelectedLanguage] = useState<'ja' | 'en' | 'zh'>(locale as 'ja' | 'en' | 'zh');

  const languages = [
    { code: 'ja' as const, name: t('languages.japanese') },
    { code: 'en' as const, name: t('languages.english') },
    { code: 'zh' as const, name: t('languages.chinese') },
  ];

  const airports = [
    { code: 'narita' as const, name: t('airports.narita') },
    { code: 'haneda' as const, name: t('airports.haneda') },
  ];

  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const getVideoThumbnail = (url: string) => {
    const videoId = getVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  const handleVideoClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const filteredVideos = videoData.filter(video => video.language === selectedLanguage);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <Video className="w-4 h-4" />
            <span>{t('top_banner')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            {t('subtitle')}
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-2 p-1 bg-white rounded-xl shadow-sm border border-gray-200">
            <Languages className="w-4 h-4 text-gray-500 ml-3" />
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedLanguage === lang.code
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {airports.map((airport) => {
            const video = filteredVideos.find(v => v.airport === airport.code);
            if (!video) return null;

            const thumbnail = getVideoThumbnail(video.url);

            return (
              <div key={airport.code} className="group">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                  {/* Video Thumbnail */}
                  <div 
                    className="relative aspect-video bg-gray-200 cursor-pointer overflow-hidden"
                    onClick={() => handleVideoClick(video.url)}
                  >
                    {thumbnail && (
                      <img
                        src={thumbnail}
                        alt={`${airport.name} ${t('video_alt')}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors duration-300">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                      </div>
                    </div>
                    {/* Duration Badge */}
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-white text-xs rounded">
                      {t('video_duration')}
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-600 font-medium">{airport.name}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {t('video_title', { airport: airport.name })}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t('video_description', { airport: airport.name })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
            <span className="text-gray-600">{t('cta.text')}</span>
            <a 
              href={`/${locale}/package`}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
            >
              {t('cta.link')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
