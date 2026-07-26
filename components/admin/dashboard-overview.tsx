'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getAnalyticsSummary, getPerformanceSummary } from '@/app/actions/admin'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function DashboardOverview() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [performance, setPerformance] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [analyticsData, performanceData] = await Promise.all([
          getAnalyticsSummary(),
          getPerformanceSummary(),
        ])
        setAnalytics(analyticsData)
        setPerformance(performanceData)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading analytics...</div>
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-6"
        >
          <p className="text-sm text-gray-400 mb-2">Total Views</p>
          <p className="text-3xl font-light">{analytics?.totalViews || 0}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-6"
        >
          <p className="text-sm text-gray-400 mb-2">Unique Visitors</p>
          <p className="text-3xl font-light">{analytics?.totalUniqueVisitors || 0}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-6"
        >
          <p className="text-sm text-gray-400 mb-2">Avg Bounce Rate</p>
          <p className="text-3xl font-light">{analytics?.avgBounceRate || '0'}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-6"
        >
          <p className="text-sm text-gray-400 mb-2">Total Pages</p>
          <p className="text-3xl font-light">{analytics?.topPages?.length || 0}</p>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      {performance && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-light mb-6">Web Vitals Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-2">FCP (ms)</p>
              <p className="text-2xl font-light">{performance.avgFCP}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">LCP (ms)</p>
              <p className="text-2xl font-light">{performance.avgLCP}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">CLS</p>
              <p className="text-2xl font-light">{performance.avgCLS}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">TTFB (ms)</p>
              <p className="text-2xl font-light">{performance.avgTTFB}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Top Pages */}
      {analytics?.topPages && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-light mb-6">Top Pages</h3>
          <div className="space-y-4">
            {analytics.topPages.map((page: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center pb-4 border-b border-gray-800 last:border-0">
                <p className="text-sm">{page.page}</p>
                <p className="text-gray-400">{page.views} views</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
