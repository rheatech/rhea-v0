export type TimeSpan = 'day' | 'week' | 'month' | '2months' | '6months'

export interface TimeSpanConfig {
  label: string
  days: number
  format: string
}

export const TIME_SPANS: Record<TimeSpan, TimeSpanConfig> = {
  day: {
    label: 'Last 24 Hours',
    days: 1,
    format: 'HH:mm',
  },
  week: {
    label: 'Last 7 Days',
    days: 7,
    format: 'MMM D',
  },
  month: {
    label: 'Last 30 Days',
    days: 30,
    format: 'MMM D',
  },
  '2months': {
    label: 'Last 2 Months',
    days: 60,
    format: 'MMM D',
  },
  '6months': {
    label: 'Last 6 Months',
    days: 180,
    format: 'MMM YYYY',
  },
}

export function getDateRange(timeSpan: TimeSpan): { startDate: Date; endDate: Date } {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - TIME_SPANS[timeSpan].days)

  return { startDate, endDate }
}

export function formatDate(date: Date, format: string): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  let result = format
  result = result.replace('YYYY', date.getFullYear().toString())
  result = result.replace('MMM', months[date.getMonth()])
  result = result.replace('DD', date.getDate().toString().padStart(2, '0'))
  result = result.replace('D', date.getDate().toString())
  result = result.replace('HH', date.getHours().toString().padStart(2, '0'))
  result = result.replace('mm', date.getMinutes().toString().padStart(2, '0'))
  result = result.replace('ddd', days[date.getDay()])

  return result
}

export function groupAnalyticsByTimeSpan(
  data: Array<{ createdAt: Date; value: number }>,
  timeSpan: TimeSpan
): Array<{ date: string; value: number }> {
  const grouped: Record<string, number> = {}

  const { startDate, endDate } = getDateRange(timeSpan)
  const config = TIME_SPANS[timeSpan]

  // Initialize all dates in range
  const current = new Date(startDate)
  while (current <= endDate) {
    const key = formatDate(new Date(current), config.format)
    if (!grouped[key]) grouped[key] = 0
    current.setDate(current.getDate() + 1)
  }

  // Group data
  data.forEach((item) => {
    if (item.createdAt >= startDate && item.createdAt <= endDate) {
      const key = formatDate(item.createdAt, config.format)
      grouped[key] = (grouped[key] || 0) + item.value
    }
  })

  return Object.entries(grouped).map(([date, value]) => ({ date, value }))
}
