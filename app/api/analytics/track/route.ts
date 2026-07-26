import { db } from '@/lib/db'
import { siteVisits, deviceAnalytics, locationAnalytics, timeMetrics, utmTracking, deploymentTracking } from '@/lib/db/schema'
import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      userId,
      sessionId,
      page,
      deploymentUrl,
      deviceType,
      osName,
      osVersion,
      browserName,
      browserVersion,
      userAgent,
      country,
      region,
      city,
      latitude,
      longitude,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      duration,
      timeSpent,
      scrollDepth,
    } = body

    // Create site visit record (core analytics)
    const visitRecord = await db.insert(siteVisits).values({
      userId: userId || 'anonymous',
      sessionId,
      deploymentUrl,
      page,
      referrer: referrer || null,
      duration: duration || 0,
    })
    
    console.log('[v0] Site visit recorded:', { page, deploymentUrl, sessionId })

    // Create device analytics record - only if we have valid device info
    if (deviceType && osName && browserName) {
      await db.insert(deviceAnalytics).values({
        userId: userId || 'anonymous',
        sessionId,
        deviceType,
        osName,
        osVersion: osVersion || null,
        browserName,
        browserVersion: browserVersion || null,
        userAgent: userAgent || null,
      })
    } else {
      console.log('[v0] Skipping device analytics - missing required fields:', { deviceType, osName, browserName })
    }

    // Create location analytics record if available
    if (country || city) {
      await db.insert(locationAnalytics).values({
        userId: userId || 'anonymous',
        sessionId,
        country: country || null,
        region: region || null,
        city: city || null,
        latitude: latitude ? parseFloat(latitude.toString()) : null,
        longitude: longitude ? parseFloat(longitude.toString()) : null,
      })
    }

    // Create time metrics record
    await db.insert(timeMetrics).values({
      userId: userId || 'anonymous',
      sessionId,
      page,
      timeSpent: timeSpent || 0,
      scrollDepth: scrollDepth ? parseFloat(scrollDepth.toString()) : 0,
    })

    // Create UTM tracking record if UTM params exist
    if (utmSource || utmMedium || utmCampaign) {
      await db.insert(utmTracking).values({
        userId: userId || 'anonymous',
        sessionId,
        source: utmSource || null,
        medium: utmMedium || null,
        campaign: utmCampaign || null,
        content: utmContent || null,
        term: utmTerm || null,
      })
    }

    // Update or create deployment tracking
    const existingDeployment = await db
      .select()
      .from(deploymentTracking)
      .where(eq(deploymentTracking.deploymentUrl, deploymentUrl))
      .limit(1)

    if (existingDeployment && existingDeployment.length > 0) {
      // Update existing deployment record
      const current = existingDeployment[0]
      await db
        .update(deploymentTracking)
        .set({
          visits: (current.visits || 0) + 1,
          lastSeen: new Date(),
        })
        .where(eq(deploymentTracking.deploymentUrl, deploymentUrl))
    } else {
      // Create new deployment record
      await db.insert(deploymentTracking).values({
        userId: userId || 'anonymous',
        deploymentUrl,
        environment: deploymentUrl.includes('localhost') ? 'development' : deploymentUrl.includes('vercel.app') ? 'preview' : 'production',
        visits: 1,
        uniqueVisitors: 1,
      })
    }

    console.log('[v0] Analytics tracked:', { page, deploymentUrl, sessionId, timestamp: new Date().toISOString() })

    return NextResponse.json({ success: true, sessionId })
  } catch (error) {
    console.error('[v0] Analytics tracking error:', error)
    return NextResponse.json({ success: false, error: 'Failed to track analytics' }, { status: 500 })
  }
}
