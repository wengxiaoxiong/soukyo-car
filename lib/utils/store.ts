export interface OpeningHours {
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
}

export function formatOpeningHours(openingHours: OpeningHours | null): string {
  if (!openingHours) return '营业时间未设置'
  
  // 假设营业时间是每天相同的
  const firstDay = Object.values(openingHours)[0] as string
  return firstDay || '营业时间未设置'
} 