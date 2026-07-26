'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getFormSubmissions, updateSubmissionStatus } from '@/app/actions/admin'

export function FormSubmissionsManager() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    loadSubmissions()
  }, [])

  async function loadSubmissions() {
    try {
      setLoading(true)
      const data = await getFormSubmissions()
      setSubmissions(data)
    } catch (error) {
      console.error('Failed to load submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(id: number, status: string) {
    try {
      await updateSubmissionStatus(id, status, notes)
      setNotes('')
      setSelectedId(null)
      await loadSubmissions()
    } catch (error) {
      console.error('Failed to update submission:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/20 text-blue-400'
      case 'reviewed':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'contacted':
        return 'bg-green-500/20 text-green-400'
      case 'closed':
        return 'bg-gray-500/20 text-gray-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading submissions...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-light">Form Submissions</h2>
        <span className="text-sm text-gray-400">{submissions.length} total</span>
      </div>

      <div className="space-y-4">
        {submissions.length === 0 ? (
          <p className="text-gray-400 p-8 text-center">No form submissions yet</p>
        ) : (
          submissions.map((submission, idx) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Name</p>
                  <p className="font-light">{submission.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="font-light text-sm">{submission.email}</p>
                </div>
                {submission.phone && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="font-light text-sm">{submission.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Form Type</p>
                  <p className="font-light text-sm capitalize">{submission.formType}</p>
                </div>
              </div>

              {submission.subject && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Subject</p>
                  <p className="font-light">{submission.subject}</p>
                </div>
              )}

              {submission.message && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Message</p>
                  <p className="font-light text-sm line-clamp-3">{submission.message}</p>
                </div>
              )}

              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2 items-center">
                  <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(submission.status)}`}>
                    {submission.status}
                  </span>
                  <p className="text-xs text-gray-500">
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {selectedId === submission.id ? (
                  <div className="flex gap-2">
                    <select
                      className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs"
                      defaultValue={submission.status}
                      onChange={(e) =>
                        handleStatusChange(submission.id, e.target.value)
                      }
                    >
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button
                      onClick={() => setSelectedId(null)}
                      className="text-xs px-3 py-1 rounded border border-gray-600 hover:border-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedId(submission.id)}
                    className="text-xs px-3 py-1 rounded border border-gray-600 hover:border-gray-400 transition"
                  >
                    Update Status
                  </button>
                )}
              </div>

              {submission.notes && (
                <div className="text-xs text-gray-500 italic">
                  Notes: {submission.notes}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
