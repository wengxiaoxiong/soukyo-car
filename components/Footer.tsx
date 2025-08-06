import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Phone, Mail, Instagram } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';

export const Footer: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  
  return (
    <footer className="bg-gray-900 text-white mt-8 md:mt-16">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-6">{t('home.soukyo')}</h3>
            <p className="text-gray-400">
              {t('home.subtitle')}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('footer.services')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href={`/${locale}/about`} className="hover:text-white transition-colors">
                  {t('common.about')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/legal/commerce`} className="hover:text-white transition-colors">
                  特定商取引法に基づく表記
                </Link>
              </li>
              <li>{t('footer.terms_of_service')}</li>
              <li>{t('footer.privacy_policy')}</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('common.contact')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                048-951-1089
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                rentalcar@soukyo-motors.jp
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('footer.support')}</h4>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="!rounded-button">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="!rounded-button group">
                <Image 
                  src="/icons8-推特x.svg" 
                  alt="Twitter X" 
                  width={20} 
                  height={20}
                  className="filter brightness-0 invert group-hover:brightness-0 group-hover:invert-0 transition-all duration-200"
                />
              </Button>
              <Button variant="ghost" size="icon" className="!rounded-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 8.01c0-4.42-4.48-8-10-8s-10 3.58-10 8c0 4.13 3.67 7.55 8.62 7.95l1.37.06c.97 0 1.88.31 2.26.87.38.57.1 1.38-.57 2.12" />
                  <path d="M22 11.4c.11-.81.19-1.64.19-2.49" />
                  <path d="M15.26 18.11c-1.06.16-1.76.22-2.76.22" />
                </svg>
              </Button>
              
              <Button variant="ghost" size="icon" className="!rounded-button group">
                <Image 
                  src="/icons8-微信.svg" 
                  alt="微信" 
                  width={20} 
                  height={20}
                  className="filter brightness-0 invert group-hover:brightness-0 group-hover:invert-0 transition-all duration-200"
                />
              </Button>
              <Button variant="ghost" size="icon" className="!rounded-button group">
                <Image 
                  src="/小红书.svg" 
                  alt="小红书" 
                  width={26} 
                  height={26}
                  className="filter brightness-0 invert group-hover:brightness-0 group-hover:invert-0 transition-all duration-200"
                />
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 md:mt-12 pt-8 text-center text-gray-400">
          <p>© 2024 株式会社創挙. {t('footer.copyright')}.</p>
        </div>
      </div>
    </footer>
  );
}; 