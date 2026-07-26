import { UAParser } from 'ua-parser-js'

export interface AnalyticsData {
  sessionId: string
  page: string
  deploymentUrl: string
  deviceType: string
  osName: string
  osVersion?: string
  browserName: string
  browserVersion?: string
  userAgent: string
  country?: string
  region?: string
  city?: string
  latitude?: number
  longitude?: number
  referrer?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  duration: number
  timeSpent: number
  scrollDepth: number
}

export function parseUserAgent(userAgent: string) {
  const parser = new UAParser(userAgent)
  const result = parser.getResult()

  return {
    deviceType: result.device.type || 'desktop',
    osName: result.os.name || 'Unknown',
    osVersion: result.os.version,
    browserName: result.browser.name || 'Unknown',
    browserVersion: result.browser.version,
  }
}

export function getDeploymentUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
}

export function getUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {}

  const params = new URLSearchParams(window.location.search)
  return {
    utmSource: params.get('utm_source') || '',
    utmMedium: params.get('utm_medium') || '',
    utmCampaign: params.get('utm_campaign') || '',
    utmContent: params.get('utm_content') || '',
    utmTerm: params.get('utm_term') || '',
  }
}

export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export async function fetchLocationData(): Promise<{ country?: string; region?: string; city?: string; latitude?: number; longitude?: number }> {
  try {
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    return {
      country: data.country_name,
      region: data.region,
      city: data.city,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
    }
  } catch (error) {
    console.error('[v0] Failed to fetch location data:', error)
    return {}
  }
}
