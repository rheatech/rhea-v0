'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { pageAnalytics, performanceMetrics, formSubmissions, clientData } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { headers } from 'next/headers'

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
