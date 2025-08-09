import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// 支持的语言列表（包含别名）
export const locales = ['zh', 'en', 'ja', 'jp'] as const;
export type Locale = (typeof locales)[number];

// 语言代码映射 - 将别名映射到实际的语言文件
const localeMapping: Record<string, string> = {
  'jp': 'ja', // jp映射到ja
  'ja': 'ja',
  'zh': 'zh',
  'en': 'en'
};

export default getRequestConfig(async ({requestLocale}) => {
  // 等待requestLocale解析
  const requestedLocale = await requestLocale;
  
  // 如果没有请求的locale，使用默认的ja
  const locale = requestedLocale || 'ja';
  
  // 验证传入的语言是否支持
  if (!locales.includes(locale as Locale)) notFound();

  // 获取实际的消息文件语言代码
  const messageLocale = localeMapping[locale] || locale;

  return {
    locale,
    messages: (await import(`./messages/${messageLocale}.json`)).default
  };
});