"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Loader2 } from "lucide-react";
import { NotificationRenderer } from './NotificationRenderer';
import Link from 'next/link';

interface NotificationCenterProps {
  className?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <NotificationRenderer pageSize={10}>
      {({ 
        notifications, 
        unreadCount, 
        isLoading, 
        hasMore, 
        loadMore, 
        markAsRead, 
        markAllAsRead, 
        refresh, 
        getNotificationIcon, 
        formatTime 
      }) => (
        <DropdownMenu open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (open) refresh(); // 打开时刷新数据
        }}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`!rounded-button relative hover:bg-blue-50 ${className}`}
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center min-w-[1.25rem] bg-red-500 hover:bg-red-600"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 md:w-96">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-base">通知中心</h3>
                  <p className="text-sm text-gray-500">
                    {unreadCount > 0 ? `您有 ${unreadCount} 条未读通知` : '暂无新通知'}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    全部已读
                  </Button>
                )}
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-6 text-center">
                  <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin text-gray-400" />
                  <p className="text-sm text-gray-500">加载中...</p>
                </div>
              ) : notifications.length > 0 ? (
                <>
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="p-0">
                      <div 
                        className={`w-full p-3 hover:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''}`}
                        onClick={() => !notification.isRead && markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                {notification.title}
                              </p>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            {notification.relatedOrder && (
                              <p className="text-xs text-blue-600 mt-1">
                                订单: {notification.relatedOrder.orderNumber} - {
                                  notification.relatedOrder.package?.name || 
                                  notification.relatedOrder.vehicle?.name || 
                                  '未知商品'
                                }
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              {formatTime(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  
                  {hasMore && (
                    <div className="p-3 text-center border-t">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={loadMore}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        加载更多
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">暂无通知</p>
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="p-3 border-t">
                <Link href="/notifications" className="block">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full !rounded-button text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    查看全部通知
                  </Button>
                </Link>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </NotificationRenderer>
  );
}; 