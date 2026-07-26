'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  pageAnalytics,
  performanceMetrics,
  formSubmissions,
  clientData,
  siteVisits,
  deviceAnalytics,
  locationAnalytics,
  deploymentTracking,
  timeMetrics,
  utmTracking,
} from '@/lib/db/schema'
import { eq, desc, and, gte } from 'drizzle-orm'
import { headers } from 'next/headers'
import { TimeSpan, getDateRange } from '@/lib/analytics-timespan'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

// Analytics queries
export async function getPageAnalytics() {
  const userId = await getUserId()
  return db
    .select()
    .from(pageAnalytics)
    .where(eq(pageAnalytics.userId, userId))
    .orderBy(desc(pageAnalytics.views))
}

export async function getPerformanceMetrics(page?: string) {
  const userId = await getUserId()
  const query = db.select().from(performanceMetrics).where(eq(performanceMetrics.userId, userId))
  if (page) {
    return query.where(and(eq(performanceMetrics.userId, userId), eq(performanceMetrics.page, page)))
  }
  return query.orderBy(desc(performanceMetrics.createdAt))
}

// Form submissions
export async function getFormSubmissions() {
  const userId = await getUserId()
  return db
    .select()
    .from(formSubmissions)
    .where(eq(formSubmissions.userId, userId))
    .orderBy(desc(formSubmissions.createdAt))
}

export async function updateSubmissionStatus(id: number, status: string, notes?: string) {
  const userId = await getUserId()
  await db
    .update(formSubmissions)
    .set({ status, notes, updatedAt: new Date() })
    .where(and(eq(formSubmissions.id, id), eq(formSubmissions.userId, userId)))
}

// Client data
export async function getClients() {
  const userId = await getUserId()
  return db
    .select()
    .from(clientData)
    .where(eq(clientData.userId, userId))
    .orderBy(desc(clientData.createdAt))
}

export async function addClient(data: {
  clientName: string
  clientType: string
  email: string
  website?: string
  industry?: string
  projectName?: string
  projectStatus?: string
  budget?: number
  notes?: string
}) {
  const userId = await getUserId()
  await db.insert(clientData).values({
    userId,
    ...data,
  })
}

export async function updateClient(
  id: number,
  data: {
    clientName?: string
    clientType?: string
    email?: string
    website?: string
    industry?: string
    projectName?: string
    projectStatus?: string
    budget?: number
    notes?: string
  }
) {
  const userId = await getUserId()
  await db
    .update(clientData)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(clientData.id, id), eq(clientData.userId, userId)))
}

export async function deleteClient(id: number) {
  const userId = await getUserId()
  await db.delete(clientData).where(and(eq(clientData.id, id), eq(clientData.userId, userId)))
}

// Analytics summary
export async function getAnalyticsSummary() {
  const userId = await getUserId()
  const analytics = await db
    .select()
    .from(pageAnalytics)
    .where(eq(pageAnalytics.userId, userId))
  
  const totalViews = analytics.reduce((sum, a) => sum + a.views, 0)
  const totalUniqueVisitors = analytics.reduce((sum, a) => sum + a.uniqueVisitors, 0)
  const avgBounceRate =
    analytics.length > 0
      ? (analytics.reduce((sum, a) => sum + parseFloat(a.bounceRate.toString()), 0) / analytics.length).toFixed(2)
      : '0'

  return {
    totalViews,
    totalUniqueVisitors,
    avgBounceRate,
    topPages: analytics.slice(0, 5),
  }
}

export async function getPerformanceSummary() {
  const userId = await getUserId()
  const metrics = await db
    .select()
    .from(performanceMetrics)
    .where(eq(performanceMetrics.userId, userId))
    .orderBy(desc(performanceMetrics.createdAt))
    .limit(100)
  
  if (metrics.length === 0) return null

  const avgFCP = (metrics.reduce((sum, m) => sum + parseFloat(m.fcp.toString()), 0) / metrics.length).toFixed(2)
  const avgLCP = (metrics.reduce((sum, m) => sum + parseFloat(m.lcp.toString()), 0) / metrics.length).toFixed(2)
  const avgCLS = (metrics.reduce((sum, m) => sum + parseFloat(m.cls.toString()), 0) / metrics.length).toFixed(3)
  const avgTTFB = (metrics.reduce((sum, m) => sum + parseFloat(m.ttfb.toString()), 0) / metrics.length).toFixed(2)

  return {
    avgFCP,
    avgLCP,
    avgCLS,
    avgTTFB,
    recentMetrics: metrics.slice(0, 10),
  }
}

// Advanced Analytics - Time-span based
export async function getAnalyticsOverview(timeSpan: TimeSpan) {
  const userId = await getUserId()
  const { startDate } = getDateRange(timeSpan)

  const visits = await db
    .select()
    .from(siteVisits)
    .where(and(eq(siteVisits.userId, userId), gte(siteVisits.createdAt, startDate)))

  const uniqueVisitors = new Set(visits.map((v) => v.sessionId)).size
  const totalViews = visits.length
  const avgDuration = visits.length > 0 ? Math.round(visits.reduce((sum, v) => sum + v.duration, 0) / visits.length) : 0

  // Group by date for trends
  const trends: Record<string, { date: string; visitors: number; pageViews: number }> = {}
  visits.forEach((visit) => {
    const date = visit.createdAt?.toISOString().split('T')[0] || 'Unknown'
    if (!trends[date]) {
      trends[date] = { date, visitors: 0, pageViews: 0 }
    }
    trends[date].pageViews += 1
  })

  const uniqueByDate: Record<string, Set<string>> = {}
  visits.forEach((visit) => {
    const date = visit.createdAt?.toISOString().split('T')[0] || 'Unknown'
    if (!uniqueByDate[date]) uniqueByDate[date] = new Set()
    uniqueByDate[date].add(visit.sessionId)
  })

  Object.entries(uniqueByDate).forEach(([date, sessions]) => {
    if (trends[date]) trends[date].visitors = sessions.size
  })

  return {
    totalVisitors: uniqueVisitors,
    totalPageViews: totalViews,
    avgSessionDuration: avgDuration,
    trends: Object.values(trends).sort((a, b) => a.date.localeCompare(b.date)),
  }
}

export async function getDeviceBreakdown(timeSpan: TimeSpan) {
  const userId = await getUserId()
  const { startDate } = getDateRange(timeSpan)

  const devices = await db
    .select()
    .from(deviceAnalytics)
    .where(and(eq(deviceAnalytics.userId, userId), gte(deviceAnalytics.createdAt, startDate)))

  const deviceCounts: Record<string, number> = {}
  const osCounts: Record<string, number> = {}

  devices.forEach((d) => {
    deviceCounts[d.deviceType] = (deviceCounts[d.deviceType] || 0) + 1
    osCounts[d.osName] = (osCounts[d.osName] || 0) + 1
  })

  return {
    devices: Object.entries(deviceCounts).map(([name, value]) => ({ name, value })),
    os: Object.entries(osCounts).map(([name, value]) => ({ name, value })),
  }
}

export async function getLocationBreakdown(timeSpan: TimeSpan) {
  const userId = await getUserId()
  const { startDate } = getDateRange(timeSpan)

  const locations = await db
    .select()
    .from(locationAnalytics)
    .where(and(eq(locationAnalytics.userId, userId), gte(locationAnalytics.createdAt, startDate)))

  const locationCounts: Record<string, { country?: string; region?: string; city?: string; visitors: number }> = {}

  locations.forEach((loc) => {
    const key = `${loc.country || 'Unknown'}-${loc.region || 'N/A'}-${loc.city || 'N/A'}`
    if (!locationCounts[key]) {
      locationCounts[key] = {
        country: loc.country || undefined,
        region: loc.region || undefined,
        city: loc.city || undefined,
        visitors: 0,
      }
    }
    locationCounts[key].visitors += 1
  })

  return {
    locations: Object.values(locationCounts)
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10),
  }
}

export async function getDeploymentStats(timeSpan: TimeSpan) {
  const userId = await getUserId()
  const { startDate } = getDateRange(timeSpan)

  const deployments = await db
    .select()
    .from(deploymentTracking)
    .where(and(eq(deploymentTracking.userId, userId), gte(deploymentTracking.lastSeen, startDate)))

  return {
    deployments: deployments.map((d) => ({
      url: d.deploymentUrl,
      environment: d.environment,
      visits: d.visits || 0,
      uniqueVisitors: d.uniqueVisitors || 0,
    })),
  }
}

export async function getUtmPerformance(timeSpan: TimeSpan) {
  const userId = await getUserId()
  const { startDate } = getDateRange(timeSpan)

  const utm = await db
    .select()
    .from(utmTracking)
    .where(and(eq(utmTracking.userId, userId), gte(utmTracking.createdAt, startDate)))

  const campaignStats: Record<string, { campaign?: string; source?: string; medium?: string; visitors: number; conversions: number; revenue: number }> = {}

  utm.forEach((u) => {
    const key = u.campaign || 'Direct'
    if (!campaignStats[key]) {
      campaignStats[key] = {
        campaign: u.campaign || 'Direct',
        source: u.source,
        medium: u.medium,
        visitors: 0,
        conversions: 0,
        revenue: 0,
      }
    }
    campaignStats[key].visitors += 1
    campaignStats[key].conversions += u.conversions || 0
    campaignStats[key].revenue += parseFloat(u.revenue?.toString() || '0')
  })

  return {
    campaigns: Object.values(campaignStats).sort((a, b) => b.conversions - a.conversions),
  }
}
