'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
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
  const lastPathRef = useRef<string>('')
  const pathname = usePathname()

  const trackPageView = async (page: string) => {
    try {
      console.log('[v0] Tracking page view:', page)
      
      const userAgent = navigator.userAgent
      const { deviceType, osName, osVersion, browserName, browserVersion } = parseUserAgent(userAgent)
      const deploymentUrl = getDeploymentUrl()
      const utmParams = getUtmParams()
      const locationData = await fetchLocationData()

      const duration = Math.round((Date.now() - startTimeRef.current) / 1000)
      const scrollDepth = maxScrollRef.current > 0 
        ? (maxScrollRef.current / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)) * 100 
        : 0

      const payload = {
        sessionId: sessionIdRef.current,
        page,
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
        scrollDepth: Math.round(scrollDepth),
      }

      console.log('[v0] Sending analytics payload:', payload)

      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      })

      if (!response.ok) {
        console.error('[v0] Analytics tracking failed:', response.statusText)
      } else {
        console.log('[v0] Analytics tracked successfully')
      }
    } catch (error) {
      console.error('[v0] Failed to track page view:', error)
    }
  }

  useEffect(() => {
    // Generate session ID on first mount
    if (!sessionIdRef.current) {
      sessionIdRef.current = generateSessionId()
      console.log('[v0] Generated session ID:', sessionIdRef.current)
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = (scrollTop / docHeight) * 100
      maxScrollRef.current = Math.max(maxScrollRef.current, scrolled)
    }

    window.addEventListener('scroll', handleScroll)

    // Track page view on mount and pathname changes
    if (pathname !== lastPathRef.current) {
      lastPathRef.current = pathname
      startTimeRef.current = Date.now()
      maxScrollRef.current = 0
      
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        trackPageView(pathname)
      }, 100)
    }

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [pathname])

  // Track page view before unload (for single page views)
  useEffect(() => {
    const handleBeforeUnload = () => {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000)
      const scrollDepth = maxScrollRef.current > 0 
        ? (maxScrollRef.current / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)) * 100 
        : 0

      navigator.sendBeacon('/api/analytics/track', JSON.stringify({
        sessionId: sessionIdRef.current,
        page: pathname,
        deploymentUrl: getDeploymentUrl(),
        duration,
        timeSpent: duration,
        scrollDepth: Math.round(scrollDepth),
      }))
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [pathname])
}
