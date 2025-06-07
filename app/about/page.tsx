import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            关于SOUKYO汽车
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            您信赖的汽车伙伴，专业可靠的一站式汽车服务
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-black bg-opacity-20 px-4 py-2 rounded-full text-lg *:">
              🛡️ 信赖
            </span>
            <span className="bg-black bg-opacity-20 px-4 py-2 rounded-full text-lg">
              ⭐ 安心
            </span>
            <span className="bg-black bg-opacity-20 px-4 py-2 rounded-full text-lg">
              ⚡ 高品质
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* 公司理念 */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              公司理念
            </h2>
            <p className="text-lg text-gray-600">
              以客户为中心，提供优质的汽车服务体验
            </p>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg p-8">
                          <blockquote className="text-lg text-gray-700 leading-relaxed text-center italic">
                &ldquo;汽车不仅仅是交通工具，更是丰富生活的重要伙伴。我们秉承&lsquo;客户第一&rsquo;的理念，
                通过中古车销售、收购、整备等服务，致力于为您提供安心、舒适的汽车生活。
                我们相信，真诚的服务和专业的技术是赢得客户信赖的根本。&rdquo;
              </blockquote>
            <div className="text-center mt-6">
              <p className="text-gray-600 font-medium">—— SOUKYO汽车 代表致辞</p>
            </div>
          </div>
        </section>

        {/* 业务介绍 */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              业务介绍
            </h2>
            <p className="text-lg text-gray-600">
              为您的汽车生活提供全方位支持
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  🚗
                </div>
                <h3 className="text-xl font-semibold text-blue-600">中古车买卖</h3>
              </div>
              <p className="text-gray-600">
                基于市场价值提供公正价格收购中古车，精选优质车辆为客户提供服务。我们承诺高价收购、快速评估、安心交易。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  🚙
                </div>
                <h3 className="text-xl font-semibold text-green-600">租车服务</h3>
              </div>
              <p className="text-gray-600">
                从短期到长期，我们提供适合各种用途的车辆，价格合理，满足您不同的出行需求。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  🔧
                </div>
                <h3 className="text-xl font-semibold text-purple-600">维修保养</h3>
              </div>
              <p className="text-gray-600">
                经验丰富的专业技师团队，为您的爱车提供细致的整备维修，确保您的舒适驾驶体验。
              </p>
            </div>
          </div>
        </section>

        {/* 专业服务 */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              专业服务
            </h2>
            <p className="text-lg text-gray-600">
              专业技术，贴心服务
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">车检整备</h3>
              <p className="text-gray-500 text-sm mb-4">自社认证工厂，专业技师服务</p>
              <p className="text-gray-600 mb-4">
                在我们的自有认证工厂，专业技师为您提供全面的车检整备服务。
                我们会根据客户的不同需求，提供从高标准整备到经济型整备的多种选择。
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">免费评估</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">免费代车</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">专业认证</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-green-600 mb-2">钣金喷漆</h3>
              <p className="text-gray-500 text-sm mb-4">恢复爱车原有光彩</p>
              <p className="text-gray-600 mb-4">
                钣金喷漆是修复汽车划痕和凹痕，通过喷漆恢复原有美观状态的专业服务。
                从小划痕到大面积损伤，我们都能提供高品质的修复服务，守护您爱车的价值。
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">高品质修复</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">免费咨询</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">保值维护</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-purple-600 mb-2">售后服务</h3>
              <p className="text-gray-500 text-sm mb-4">购车后的贴心保障</p>
              <p className="text-gray-600 mb-4">
                购车后我们提供安心的售后服务保障。定期检查、机油更换、保修服务等，
                全面支持您的汽车生活。车检和故障时也可随时咨询。
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">定期维护</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">保修服务</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">24小时咨询</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-orange-600 mb-2">ETC安装</h3>
              <p className="text-gray-500 text-sm mb-4">ETC车载器专业安装</p>
              <p className="text-gray-600 mb-4">
                我们提供ETC车载器的专业安装服务。从选择适合您车辆的ETC设备到安装、
                注册等一站式服务，让您的出行更加便捷。
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">专业安装</span>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">设备选择</span>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">一站式服务</span>
              </div>
            </div>
          </div>
        </section>

        {/* 收购服务特色 */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              收购服务特色
            </h2>
            <p className="text-lg text-gray-600">
              高价收购，快速评估，安心交易
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">快速评估</h3>
              <p className="text-gray-600">
                最快几分钟完成评估，当场提供收购价格。
                必要资料齐全的话，当天即可现金化。
                预约无需等待，流程顺畅无压力。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold text-green-600 mb-4">高价收购</h3>
              <p className="text-gray-600">
                因为珍视您的爱车，我们会最大化评估其价值。
                基于市场数据，提供公正价格，绝不输给同行的高价收购。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-purple-600 mb-4">安心交易</h3>
              <p className="text-gray-600">
                完善的交易流程，透明的价格评估，
                让您放心地将爱车托付给我们。
                专业团队确保每一步都安全可靠。
              </p>
            </div>
          </div>
        </section>

        {/* 联系信息 */}
        <section className="bg-gray-50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              联系我们
            </h2>
            <p className="text-lg text-gray-600">
              欢迎随时咨询，我们将竭诚为您服务
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <span className="text-blue-600 text-xl mr-2">📞</span>
                <h3 className="text-xl font-semibold text-blue-600">中古车销售・整备</h3>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-2">048-951-1089</p>
              <div className="flex items-center text-gray-600">
                <span className="mr-2">🕙</span>
                <span>受理时间：10:00～19:00</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <span className="text-green-600 text-xl mr-2">📞</span>
                <h3 className="text-xl font-semibold text-green-600">租车服务</h3>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-2">080-4612-0188</p>
              <div className="flex items-center text-gray-600">
                <span className="mr-2">🕗</span>
                <span>受理时间：8:00～20:00</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              也可通过电话和专用表单接受咨询
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                来店预约
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                库存确认・估价咨询
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 