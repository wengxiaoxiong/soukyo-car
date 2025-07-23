import React, { Suspense } from 'react'

import { Loader2 } from 'lucide-react'
import { VehicleContent } from './VehicleContent'

// 加载状态组件
function VehicleLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">全部车型</h1>
          <p className="text-gray-600">正在加载车辆信息...</p>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">正在加载车辆信息...</span>
        </div>
      </div>
    </div>
  )
}

export default function VehiclePage() {
  return (
    <Suspense fallback={<VehicleLoading />}>
      <VehicleContent />
    </Suspense>
  )
} 