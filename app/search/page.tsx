import React, { Suspense } from 'react';
import { SearchResults } from './SearchResults';
import { Car } from "lucide-react";

// 加载状态组件
function SearchLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center py-12">
          <Car className="w-12 h-12 mx-auto mb-4 animate-bounce text-blue-600" />
          <h2 className="text-xl font-semibold mb-2">正在加载搜索结果...</h2>
          <p className="text-gray-600">请稍等片刻</p>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchResults />
    </Suspense>
  );
} 