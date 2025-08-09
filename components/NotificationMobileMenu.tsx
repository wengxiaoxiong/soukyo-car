"use client"

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { NotificationRenderer } from './NotificationRenderer';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface NotificationMobileMenuProps {
  className?: string;
}

export const NotificationMobileMenu: React.FC<NotificationMobileMenuProps> = ({ className }) => {
  const locale = useLocale();
  return (
    <NotificationRenderer pageSize={1}>
      {({ unreadCount }) => (
        <Link href={`/${locale}/notifications`} className={`flex items-center gap-2 ${className}`}>
          <div className="relative">
            <Bell className="w-4 h-4 text-gray-600" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs flex items-center justify-center min-w-[1rem] bg-red-500"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </div>
        </Link>
      )}
    </NotificationRenderer>
  );
}; 