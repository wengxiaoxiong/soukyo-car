"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Loader2, RefreshCw, ArrowLeft } from "lucide-react";
import { NotificationRenderer } from '@/components/NotificationRenderer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const NotificationPage: React.FC = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="!rounded-button">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">通知中心</h1>
              <p className="text-gray-600 mt-1">查看您的所有通知消息</p>
            </div>
          </div>
        </div>

        {/* 通知列表 */}
        <NotificationRenderer pageSize={20} enableInfiniteScroll={true}>
          {({ 
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
          }) => (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    通知列表
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {unreadCount} 条未读
                      </span>
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={markAllAsRead}
                        className="!rounded-button"
                      >
                        全部已读
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={refresh}
                      className="!rounded-button"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {error && (
                  <div className="p-6 text-center text-red-500">
                    <p>{error}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={refresh}
                      className="mt-2 !rounded-button"
                    >
                      重试
                    </Button>
                  </div>
                )}

                {isLoading && notifications.length === 0 ? (
                  <div className="p-12 text-center">
                    <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-gray-400" />
                    <p className="text-gray-500">加载通知中...</p>
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`}
                        onClick={() => {
                          if (!notification.isRead) {
                            markAsRead(notification.id);
                          }
                          if (notification.link) {
                            router.push(notification.link);
                          }
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className={`text-lg font-medium ${
                                    !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                                  }`}>
                                    {notification.title}
                                  </h3>
                                  {!notification.isRead && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </div>
                                <p className="text-gray-600 mt-2 leading-relaxed">
                                  {notification.message}
                                </p>
                                {notification.relatedOrder && (
                                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-700">
                                      <strong>相关订单：</strong>
                                      {notification.relatedOrder.orderNumber} - {
                                        notification.relatedOrder.package?.name || 
                                        notification.relatedOrder.vehicle?.name || 
                                        '未知商品'
                                      }
                                    </p>
                                  </div>
                                )}
                              </div>
                              <div className="text-right ml-4">
                                <p className="text-sm text-gray-500">
                                  {formatTime(notification.createdAt)}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {notification.type}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* 加载更多按钮 */}
                    {hasMore && (
                      <div className="p-6 text-center border-t">
                        {isLoadingMore ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-gray-500">加载更多中...</span>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={loadMore}
                            className="!rounded-button"
                          >
                            加载更多通知
                          </Button>
                        )}
                      </div>
                    )}

                    {!hasMore && notifications.length > 10 && (
                      <div className="p-6 text-center text-gray-500 border-t">
                        <p className="text-sm">已显示全部通知</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-12 text-center text-gray-500">
                    <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">暂无通知</h3>
                    <p className="text-sm">您当前没有任何通知消息</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </NotificationRenderer>
      </div>
    </div>
  );
}; 