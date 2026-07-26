'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardOverview } from '@/components/admin/dashboard-overview'
import { FormSubmissionsManager } from '@/components/admin/form-submissions-manager'
import { ClientsDashboard } from '@/components/admin/clients-dashboard'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'clients'>('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'submissions', label: 'Form Submissions', icon: '📝' },
    { id: 'clients', label: 'Clients', icon: '👥' },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#050505] pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-8 md:px-12">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-5xl md:text-6xl font-light mb-4">Admin Dashboard</h1>
            <p className="text-gray-400 font-mono text-sm">
              Monitor site performance, manage form submissions, and track clients
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-4 mb-8 border-b border-gray-800 overflow-x-auto"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 px-4 font-light transition-colors whitespace-nowrap text-sm md:text-base ${
                  activeTab === tab.id
                    ? 'border-b-2 border-white text-white'
                    : 'border-b-2 border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && <DashboardOverview />}
            {activeTab === 'submissions' && <FormSubmissionsManager />}
            {activeTab === 'clients' && <ClientsDashboard />}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
