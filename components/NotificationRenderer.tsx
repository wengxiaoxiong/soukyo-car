"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Car, Package, Settings, AlertTriangle } from "lucide-react";
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/app/actions/notifications';
import { NotificationType } from '@prisma/client';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  readAt: Date | null;
  relatedOrderId: string | null;
  link?: string | null;
  createdAt: Date;
  relatedOrder?: {
    orderNumber: string;
    vehicle: {
      name: string;
    } | null;
    package: {
      name: string;
    } | null;
  } | null;
}

interface NotificationRendererProps {
  pageSize?: number;
  enableInfiniteScroll?: boolean;
  children: (props: {
    notifications: NotificationItem[];
    unreadCount: number;
    isLoading: boolean;
    isLoadingMore: boolean;
    hasMore: boolean;
    error: string | null;
    loadMore: () => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    refresh: () => void;
    getNotificationIcon: (type: NotificationType) => React.ReactNode;
    formatTime: (date: Date) => string;
  }) => React.ReactNode;
}

export const NotificationRenderer: React.FC<NotificationRendererProps> = ({
  pageSize = 20,
  enableInfiniteScroll = false,
  children
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  // 获取通知数据
  const fetchNotifications = useCallback(async (offset: number = 0, append: boolean = false) => {
    try {
      if (!append) setIsLoading(true);
      else setIsLoadingMore(true);
      
      setError(null);
      
      const result = await getUserNotifications(pageSize, offset);
      
      if (result.success && result.data) {
        const newNotifications = result.data.notifications;
        
        if (append) {
          setNotifications(prev => [...prev, ...newNotifications]);
        } else {
          setNotifications(newNotifications);
          setUnreadCount(result.data.unreadCount);
        }
        
        // 检查是否还有更多数据
        setHasMore(newNotifications.length === pageSize);
      } else {
        setError(result.error || '获取通知失败');
      }
    } catch (error) {
      console.error('获取通知失败:', error);
      setError('获取通知失败');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [pageSize]);

  // 加载更多
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage * pageSize, true);
  }, [page, pageSize, fetchNotifications, isLoadingMore, hasMore]);

  // 刷新
  const refresh = useCallback(() => {
    setPage(0);
    fetchNotifications(0, false);
  }, [fetchNotifications]);

  // 前端事件驱动刷新 + 轮询刷新 + 焦点恢复刷新
  useEffect(() => {
    const handleCustomRefresh = () => refresh();
    const handleFocus = () => refresh();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refresh();
    };

    window.addEventListener('soukyo:notifications:refresh', handleCustomRefresh);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    const intervalId = window.setInterval(() => {
      // 定时拉取，确保无需手动点击也能看到最新通知
      refresh();
    }, 5000);

    return () => {
      window.removeEventListener('soukyo:notifications:refresh', handleCustomRefresh);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.clearInterval(intervalId);
    };
  }, [refresh]);

  // 标记单个通知为已读
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const result = await markNotificationAsRead(notificationId);
      
      if (result.success) {
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId 
              ? { ...n, isRead: true, readAt: new Date() }
              : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('标记已读失败:', error);
    }
  }, []);

  // 标记所有通知为已读
  const markAllAsRead = useCallback(async () => {
    try {
      const result = await markAllNotificationsAsRead();
      
      if (result.success) {
        setNotifications(prev => 
          prev.map(n => ({ ...n, isRead: true, readAt: new Date() }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('标记全部已读失败:', error);
    }
  }, []);

  // 获取通知图标
  const getNotificationIcon = useCallback((type: NotificationType) => {
    switch (type) {
      case 'ORDER':
        return <Car className="w-4 h-4 text-blue-500" />;
      case 'SYSTEM':
        return <Settings className="w-4 h-4 text-gray-500" />;
      case 'PROMOTION':
        return <Package className="w-4 h-4 text-green-500" />;
      case 'MAINTENANCE':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  }, []);

  // 格式化时间
  const formatTime = useCallback((date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    
    return new Date(date).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
    });
  }, []);

  // 无限滚动监听
  useEffect(() => {
    if (!enableInfiniteScroll) return;

    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enableInfiniteScroll, loadMore]);

  // 初始加载
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <>
      {children({
        notifications,
        unreadCount,
        isLoading,
        isLoadingMore,
        hasMore,
        error,
        loadMore,
        markAsRead,
        markAllAsRead,
        refresh,
        getNotificationIcon,
        formatTime
      })}
    </>
  );
}; 