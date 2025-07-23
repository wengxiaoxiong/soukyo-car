"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Mail, Phone, Clock, MessageCircle, Award, Shield, Heart } from "lucide-react";
import { useTranslations } from 'next-intl';

export const CompanyInfo: React.FC = () => {
  const t = useTranslations('CompanyInfo');

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            <Heart className="w-4 h-4" />
            <span>{t('top_banner')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
          {/* 咨询服务区域 */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{t('contact_section.title')}</h3>
              </div>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                {t('contact_section.description')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <h4 className="text-lg font-semibold text-gray-900">{t('contact_section.phone_inquiry.title')}</h4>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">048-951-1089</div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{t('contact_section.phone_inquiry.hours')}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="w-5 h-5 text-green-600" />
                    <h4 className="text-lg font-semibold text-gray-900">{t('contact_section.online_inquiry.title')}</h4>
                  </div>
                  <Button className="w-full mb-3 bg-green-600 hover:bg-green-700 rounded-lg">
                    <Mail className="w-4 h-4 mr-2" />
                    {t('contact_section.online_inquiry.button')}
                  </Button>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{t('contact_section.online_inquiry.hours')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 公司介绍区域 */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{t('about_us_section.title')}</h3>
              </div>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                {t('about_us_section.description')}
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-semibold mb-3 text-gray-900">
                    {t('about_us_section.business_intro.title_en')}
                    <span className="block text-base font-normal text-gray-600 mt-1">{t('about_us_section.business_intro.title_zh')}</span>
                  </h4>
                  <div className="text-gray-600 space-y-4 leading-relaxed">
                    <p>{t('about_us_section.business_intro.p1')}</p>
                    <p>{t('about_us_section.business_intro.p2')}</p>
                    <p>{t('about_us_section.business_intro.p3')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 服务特色 */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {t('why_choose_us.title')}
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t('why_choose_us.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">{t('why_choose_us.trust.title')}</h4>
              <p className="text-gray-600">{t('why_choose_us.trust.description')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">{t('why_choose_us.peace_of_mind.title')}</h4>
              <p className="text-gray-600">{t('why_choose_us.peace_of_mind.description')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">{t('why_choose_us.high_quality.title')}</h4>
              <p className="text-gray-600">{t('why_choose_us.high_quality.description')}</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg">
              <span className="text-gray-600">{t('cta.text')}</span>
              <a 
                href="tel:080-4612-0188" 
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
              >
                {t('cta.link')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 