import { useEffect, useRef } from 'react'
import {
  parseUserAgent,
  getDeploymentUrl,
  getUtmParams,
  generateSessionId,
  fetchLocationData,
} from '@/lib/analytics-tracker'

export function useAnalytics() {
  const sessionIdRef = useRef<string | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const maxScrollRef = useRef<number>(0)

  useEffect(() => {
    // Generate session ID on mount
    if (!sessionIdRef.current) {
      sessionIdRef.current = generateSessionId()
    }

    const trackPageView = async () => {
      try {
        const userAgent = navigator.userAgent
        const { deviceType, osName, osVersion, browserName, browserVersion } = parseUserAgent(userAgent)
        const deploymentUrl = getDeploymentUrl()
        const utmParams = getUtmParams()
        const locationData = await fetchLocationData()

        const duration = Math.round((Date.now() - startTimeRef.current) / 1000)
        const scrollDepth = (maxScrollRef.current / (document.documentElement.scrollHeight - window.innerHeight)) * 100

        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            page: window.location.pathname,
            deploymentUrl,
            deviceType,
            osName,
            osVersion,
            browserName,
            browserVersion,
            userAgent,
            country: locationData.country,
            region: locationData.region,
            city: locationData.city,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            referrer: document.referrer,
            utmSource: utmParams.utmSource,
            utmMedium: utmParams.utmMedium,
            utmCampaign: utmParams.utmCampaign,
            utmContent: utmParams.utmContent,
            utmTerm: utmParams.utmTerm,
            duration,
            timeSpent: duration,
            scrollDepth,
          }),
        })
      } catch (error) {
        console.error('[v0] Failed to track page view:', error)
      }
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = (scrollTop / docHeight) * 100
      maxScrollRef.current = Math.max(maxScrollRef.current, scrolled)
    }

    window.addEventListener('scroll', handleScroll)

    // Track on page view
    trackPageView()

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
}
