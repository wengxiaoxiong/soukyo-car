'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export const revalidate = 3600 * 24 // 每24小时重新生成一次

interface ChatwootWindow extends Window {
  chatwootSettings?: {
    hideMessageBubble?: boolean;
    position?: 'left' | 'right';
    locale?: string;
    type?: 'standard' | 'expanded_bubble';
    useBrowserLanguage?: boolean;
    darkMode?: 'light' | 'auto';
  };
  chatwootSDK?: {
    run: (config: { 
      websiteToken: string; 
      baseUrl: string;
    }) => void;
  };
  $chatwoot?: {
    setUser: (identifier: string, userInfo: {
      name?: string;
      email?: string;
      avatar_url?: string;
      phone_number?: string;
      description?: string;
      country_code?: string;
      city?: string;
      company_name?: string;
      social_profiles?: {
        twitter?: string;
        linkedin?: string;
        facebook?: string;
        github?: string;
      };
    }) => void;
    setCustomAttributes: (attributes: Record<string, string | number | boolean>) => void;
    reset: () => void;
    setLocale: (locale: string) => void;
  };
}

interface UserWithRole {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

declare const window: ChatwootWindow;

export const ChatwootWidget = () => {
  const { data: session, status } = useSession();

  


  useEffect(() => {
    // 如果还在加载用户信息，先不初始化Chatwoot
    if (status === 'loading') {
      return;
    }

    // 添加Chatwoot设置 - 根据官方文档
    window.chatwootSettings = {
      hideMessageBubble: false,
      position: 'right',
      locale: 'zh', // 设置为中文
      type: 'standard',
      useBrowserLanguage: false, // 使用指定语言而不是浏览器语言
      darkMode: 'auto', // 自动根据系统主题切换
    };

    // 加载Chatwoot脚本
    const script = document.createElement('script');
    const BASE_URL = 'https://app.chatwoot.com';
    
    script.src = `${BASE_URL}/packs/js/sdk.js`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      window.chatwootSDK?.run({
        websiteToken: 'cuEh9B38DLys6MNw3EWhEnG4',
        baseUrl: BASE_URL,
      });
    };

    document.head.appendChild(script);

    // 监听chatwoot:ready事件 - 官方推荐方式
    const handleChatwootReady = () => {
      console.log('Chatwoot SDK 已准备就绪');
      
      if (session?.user && window.$chatwoot) {
        const user = session.user as UserWithRole;
        
        // 打印调试信息
        console.log('设置Chatwoot用户信息:', {
          identifier: user.email || user.id || 'unknown',
          name: user.name,
          email: user.email,
          role: user.role,
        });

        // 确保identifier是字符串类型（官方要求）
        const identifier = String(user.email || user.id || 'unknown');

        const description = `系统内用户ID ${user.id || 'User'} 订单状态: 1个`;
        
        try {
          // 按照官方文档设置用户信息
          window.$chatwoot.setUser(identifier, {
            name: user.name || undefined,
            email: user.email || undefined,
            avatar_url: user.image || undefined,
            // TODO: 这里可以添加更多的信息，比如是否拥有订单
            description: description,
            company_name: 'Soukyo租车',
            // 可以根据需要添加更多字段
            // phone_number: user.phone || undefined,
            // country_code: 'JP', // 日本
            // city: user.city || undefined,
            // social_profiles: {
            //   github: user.github || undefined,
            // },
          });
          
          // 设置自定义属性 - 官方推荐方式
          window.$chatwoot.setCustomAttributes({
            role: user.role || 'user',
            login_source: 'website',
            user_id: user.id || identifier,
            registration_date: new Date().toISOString().split('T')[0], // 今日日期作为示例
          });
          
          console.log('Chatwoot用户信息设置成功');
        } catch (error) {
          console.error('设置Chatwoot用户信息失败:', error);
        }
      }
    };

    // 监听错误事件 - 官方推荐
    const handleChatwootError = (event: Event) => {
      console.error('Chatwoot错误:', event);
    };

    // 添加事件监听器
    window.addEventListener('chatwoot:ready', handleChatwootReady);
    window.addEventListener('chatwoot:error', handleChatwootError);

    // 清理函数
    return () => {
      // 移除脚本和事件监听器
      const existingScript = document.querySelector(`script[src="${BASE_URL}/packs/js/sdk.js"]`);
      if (existingScript) {
        existingScript.remove();
      }
      window.removeEventListener('chatwoot:ready', handleChatwootReady);
      window.removeEventListener('chatwoot:error', handleChatwootError);
    };
  }, [session, status]);

  // 处理用户登出 - 官方推荐在用户登出时重置session
  useEffect(() => {
    if (status === 'unauthenticated' && window.$chatwoot) {
      console.log('用户已登出，重置Chatwoot session');
      try {
        window.$chatwoot.reset();
      } catch (error) {
        console.error('重置Chatwoot session失败:', error);
      }
    }
  }, [status]);

  return null;
};

