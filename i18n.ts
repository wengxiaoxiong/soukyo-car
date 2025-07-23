import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// 支持的语言列表
export const locales = ['zh', 'en', 'ja'] as const;

export default getRequestConfig(async ({locale}) => {
  // 验证传入的语言是否支持
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});