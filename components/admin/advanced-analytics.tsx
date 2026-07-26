'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getAnalyticsOverview, getDeviceBreakdown, getLocationBreakdown, getDeploymentStats, getUtmPerformance } from '@/app/actions/admin'
import { TimeSpan, TIME_SPANS } from '@/lib/analytics-timespan'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export function AdvancedAnalytics() {
  const [timeSpan, setTimeSpan] = useState<TimeSpan>('month')
  const [overview, setOverview] = useState<any>(null)
  const [deviceBreakdown, setDeviceBreakdown] = useState<any>(null)
  const [locationBreakdown, setLocationBreakdown] = useState<any>(null)
  const [deploymentStats, setDeploymentStats] = useState<any>(null)
  const [utmPerformance, setUtmPerformance] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [overview, devices, locations, deployments, utm] = await Promise.all([
          getAnalyticsOverview(timeSpan),
          getDeviceBreakdown(timeSpan),
          getLocationBreakdown(timeSpan),
          getDeploymentStats(timeSpan),
          getUtmPerformance(timeSpan),
        ])

        setOverview(overview)
        setDeviceBreakdown(devices)
        setLocationBreakdown(locations)
        setDeploymentStats(deployments)
        setUtmPerformance(utm)
      } catch (error) {
        console.error('[v0] Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeSpan])

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  return (
    <div className="space-y-8">
      {/* Time Span Filter */}
      <div className="flex gap-2 flex-wrap">
        {(Object.entries(TIME_SPANS) as Array<[TimeSpan, any]>).map(([span, config]) => (
          <button
            key={span}
            onClick={() => setTimeSpan(span)}
            className={`px-4 py-2 rounded border transition-all ${
              timeSpan === span
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-700 text-gray-300 hover:border-gray-500'
            }`}
          >
            {config.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Visitor Trends */}
          {overview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-700 rounded-lg p-6 bg-gray-900/50"
            >
              <h3 className="text-xl font-semibold mb-4">Visitor Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={overview.trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#e5e7eb' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="pageViews" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-800/50 rounded p-4">
                  <p className="text-gray-400 text-sm">Total Visitors</p>
                  <p className="text-2xl font-bold mt-1">{overview.totalVisitors?.toLocaleString() || '0'}</p>
                </div>
                <div className="bg-gray-800/50 rounded p-4">
                  <p className="text-gray-400 text-sm">Total Page Views</p>
                  <p className="text-2xl font-bold mt-1">{overview.totalPageViews?.toLocaleString() || '0'}</p>
                </div>
                <div className="bg-gray-800/50 rounded p-4">
                  <p className="text-gray-400 text-sm">Avg. Session Duration</p>
                  <p className="text-2xl font-bold mt-1">{overview.avgSessionDuration ? `${overview.avgSessionDuration}s` : '0s'}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Device & OS Breakdown */}
          {deviceBreakdown && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <div className="border border-gray-700 rounded-lg p-6 bg-gray-900/50">
                <h3 className="text-xl font-semibold mb-4">Device Types</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={deviceBreakdown.devices} cx="50%" cy="50%" labelLine={false} label outerRadius={80} fill="#8884d8" dataKey="value">
                      {deviceBreakdown.devices.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="border border-gray-700 rounded-lg p-6 bg-gray-900/50">
                <h3 className="text-xl font-semibold mb-4">Operating Systems</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={deviceBreakdown.os}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* Location Breakdown */}
          {locationBreakdown && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border border-gray-700 rounded-lg p-6 bg-gray-900/50"
            >
              <h3 className="text-xl font-semibold mb-4">Top Locations</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 px-4 text-gray-400">Country</th>
                      <th className="text-left py-2 px-4 text-gray-400">Region</th>
                      <th className="text-left py-2 px-4 text-gray-400">City</th>
                      <th className="text-right py-2 px-4 text-gray-400">Visitors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locationBreakdown.locations?.map((loc: any, idx: number) => (
                      <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="py-2 px-4">{loc.country || 'Unknown'}</td>
                        <td className="py-2 px-4">{loc.region || '-'}</td>
                        <td className="py-2 px-4">{loc.city || '-'}</td>
                        <td className="text-right py-2 px-4 font-semibold">{loc.visitors}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Deployment Tracking */}
          {deploymentStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border border-gray-700 rounded-lg p-6 bg-gray-900/50"
            >
              <h3 className="text-xl font-semibold mb-4">Deployment Performance</h3>
              <div className="space-y-3">
                {deploymentStats.deployments?.map((dep: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                    <div>
                      <p className="font-medium">{dep.url}</p>
                      <p className="text-sm text-gray-400">{dep.environment}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{dep.visits} visits</p>
                      <p className="text-sm text-gray-400">{dep.uniqueVisitors} unique</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* UTM Campaign Performance */}
          {utmPerformance && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="border border-gray-700 rounded-lg p-6 bg-gray-900/50"
            >
              <h3 className="text-xl font-semibold mb-4">UTM Campaign Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 px-4 text-gray-400">Campaign</th>
                      <th className="text-left py-2 px-4 text-gray-400">Source</th>
                      <th className="text-left py-2 px-4 text-gray-400">Medium</th>
                      <th className="text-right py-2 px-4 text-gray-400">Visitors</th>
                      <th className="text-right py-2 px-4 text-gray-400">Conversions</th>
                      <th className="text-right py-2 px-4 text-gray-400">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {utmPerformance.campaigns?.map((campaign: any, idx: number) => (
                      <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="py-2 px-4">{campaign.campaign || '-'}</td>
                        <td className="py-2 px-4">{campaign.source || '-'}</td>
                        <td className="py-2 px-4">{campaign.medium || '-'}</td>
                        <td className="text-right py-2 px-4">{campaign.visitors}</td>
                        <td className="text-right py-2 px-4 font-semibold text-green-400">{campaign.conversions}</td>
                        <td className="text-right py-2 px-4 font-semibold text-green-400">${campaign.revenue?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
