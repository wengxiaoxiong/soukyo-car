export function getFromAddress({ forProd }: { forProd: boolean }): string {
  const prodFrom = process.env.RESEND_FROM_PROD; // 例如 no-reply@yourdomain.com（需在 Resend 验证域名）
  const testFrom = process.env.RESEND_FROM_TEST || 'onboarding@resend.dev';
  return forProd && prodFrom ? prodFrom : testFrom;
}

export function isResendTestFrom(from: string): boolean {
  return /@resend\.dev$/i.test(from) || from.toLowerCase() === 'onboarding@resend.dev';
}

export const allowedTestTo: string | undefined = process.env.RESEND_ALLOWED_TEST_TO; // 例如你的账户邮箱






