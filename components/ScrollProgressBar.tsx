"use client"

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    // 直接监听滚动事件，不使用 requestAnimationFrame 来获得最即时的响应
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress(); // 初始化

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, [pathname]);

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-transparent">
      <div 
        className="h-0.5 bg-gradient-to-r from-blue-500 to-blue-600"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}; 