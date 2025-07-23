import React from 'react';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('AboutPage');
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('hero_title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            {t('hero_subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-black bg-opacity-20 px-4 py-2 rounded-full text-lg *:">
              🛡️ {t('trust')}
            </span>
            <span className="bg-black bg-opacity-20 px-4 py-2 rounded-full text-lg">
              ⭐ {t('peace_of_mind')}
            </span>
            <span className="bg-black bg-opacity-20 px-4 py-2 rounded-full text-lg">
              ⚡ {t('high_quality')}
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* 公司理念 */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t('company_philosophy_title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('company_philosophy_subtitle')}
            </p>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg p-8">
                          <blockquote className="text-lg text-gray-700 leading-relaxed text-center italic">
                {t('company_philosophy_quote')}
              </blockquote>
            <div className="text-center mt-6">
              <p className="text-gray-600 font-medium">{t('company_philosophy_ceo')}</p>
            </div>
          </div>
        </section>

        {/* 业务介绍 */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t('business_intro_title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('business_intro_subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  🚗
                </div>
                <h3 className="text-xl font-semibold text-blue-600">{t('used_car_title')}</h3>
              </div>
              <p className="text-gray-600">
                {t('used_car_description')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  🚙
                </div>
                <h3 className="text-xl font-semibold text-green-600">{t('rental_service_title')}</h3>
              </div>
              <p className="text-gray-600">
                {t('rental_service_description')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  🔧
                </div>
                <h3 className="text-xl font-semibold text-purple-600">{t('maintenance_title')}</h3>
              </div>
              <p className="text-gray-600">
                {t('maintenance_description')}
              </p>
            </div>
          </div>
        </section>

        {/* 专业服务 */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t('pro_service_title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('pro_service_subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">{t('car_inspection_title')}</h3>
              <p className="text-gray-500 text-sm mb-4">{t('car_inspection_subtitle')}</p>
              <p className="text-gray-600 mb-4">
                {t('car_inspection_description')}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{t('free_assessment')}</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{t('free_substitute_car')}</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{t('professional_certification')}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-green-600 mb-2">{t('body_paint_title')}</h3>
              <p className="text-gray-500 text-sm mb-4">{t('body_paint_subtitle')}</p>
              <p className="text-gray-600 mb-4">
                {t('body_paint_description')}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">{t('high_quality_repair')}</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">{t('free_consultation')}</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">{t('value_maintenance')}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-purple-600 mb-2">{t('after_sales_title')}</h3>
              <p className="text-gray-500 text-sm mb-4">{t('after_sales_subtitle')}</p>
              <p className="text-gray-600 mb-4">
                {t('after_sales_description')}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">{t('regular_maintenance')}</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">{t('warranty_service')}</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">{t('24_hour_consultation')}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-orange-600 mb-2">{t('etc_install_title')}</h3>
              <p className="text-gray-500 text-sm mb-4">{t('etc_install_subtitle')}</p>
              <p className="text-gray-600 mb-4">
                {t('etc_install_description')}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">{t('professional_installation')}</span>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">{t('device_selection')}</span>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">{t('one_stop_service')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 收购服务特色 */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t('acquisition_features_title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('acquisition_features_subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">{t('fast_assessment_title')}</h3>
              <p className="text-gray-600">
                {t('fast_assessment_description')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold text-green-600 mb-4">{t('high_price_acquisition_title')}</h3>
              <p className="text-gray-600">
                {t('high_price_acquisition_description')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-purple-600 mb-4">{t('secure_transaction_title')}</h3>
              <p className="text-gray-600">
                {t('secure_transaction_description')}
              </p>
            </div>
          </div>
        </section>

        {/* 联系信息 */}
        <section className="bg-gray-50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t('contact_us_title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('contact_us_subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <span className="text-blue-600 text-xl mr-2">📞</span>
                <h3 className="text-xl font-semibold text-blue-600">{t('sales_maintenance_phone_title')}</h3>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-2">048-951-1089</p>
              <div className="flex items-center text-gray-600">
                <span className="mr-2">🕙</span>
                <span>{t('sales_maintenance_hours')}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <span className="text-green-600 text-xl mr-2">📞</span>
                <h3 className="text-xl font-semibold text-green-600">{t('rental_service_phone_title')}</h3>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-2">080-4612-0188</p>
              <div className="flex items-center text-gray-600">
                <span className="mr-2">🕗</span>
                <span>{t('rental_service_hours')}</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              {t('contact_form_info')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                {t('book_visit')}
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                {t('check_inventory_quote')}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 