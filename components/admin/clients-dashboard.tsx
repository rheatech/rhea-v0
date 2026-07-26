'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getClients, addClient, updateClient, deleteClient } from '@/app/actions/admin'

export function ClientsDashboard() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    clientName: '',
    clientType: 'individual',
    email: '',
    website: '',
    industry: '',
    projectName: '',
    projectStatus: 'active',
    budget: '',
    notes: '',
  })

  useEffect(() => {
    loadClients()
  }, [])

  async function loadClients() {
    try {
      setLoading(true)
      const data = await getClients()
      setClients(data)
    } catch (error) {
      console.error('Failed to load clients:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (editingId) {
        await updateClient(editingId, {
          ...formData,
          budget: formData.budget ? parseFloat(formData.budget) : undefined,
        })
      } else {
        await addClient({
          ...formData,
          budget: formData.budget ? parseFloat(formData.budget) : undefined,
        })
      }
      setFormData({
        clientName: '',
        clientType: 'individual',
        email: '',
        website: '',
        industry: '',
        projectName: '',
        projectStatus: 'active',
        budget: '',
        notes: '',
      })
      setShowForm(false)
      setEditingId(null)
      await loadClients()
    } catch (error) {
      console.error('Failed to save client:', error)
    }
  }

  async function handleDelete(id: number) {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClient(id)
        await loadClients()
      } catch (error) {
        console.error('Failed to delete client:', error)
      }
    }
  }

  const handleEdit = (client: any) => {
    setFormData({
      clientName: client.clientName,
      clientType: client.clientType,
      email: client.email,
      website: client.website || '',
      industry: client.industry || '',
      projectName: client.projectName || '',
      projectStatus: client.projectStatus,
      budget: client.budget ? client.budget.toString() : '',
      notes: client.notes || '',
    })
    setEditingId(client.id)
    setShowForm(true)
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading clients...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-light">Clients</h2>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({
              clientName: '',
              clientType: 'individual',
              email: '',
              website: '',
              industry: '',
              projectName: '',
              projectStatus: 'active',
              budget: '',
              notes: '',
            })
          }}
          className="px-4 py-2 bg-white text-black rounded-lg font-light hover:bg-gray-100 transition"
        >
          {showForm ? 'Cancel' : 'Add Client'}
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Client Name"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
              required
            />
            <select
              value={formData.clientType}
              onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
            >
              <option value="individual">Individual</option>
              <option value="startup">Startup</option>
              <option value="enterprise">Enterprise</option>
              <option value="government">Government</option>
              <option value="ngo">NGO</option>
            </select>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
              required
            />
            <input
              type="text"
              placeholder="Website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Project Name"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
            />
            <select
              value={formData.projectStatus}
              onChange={(e) => setFormData({ ...formData, projectStatus: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
            >
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
            <input
              type="number"
              placeholder="Budget"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
            />
          </div>
          <textarea
            placeholder="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm w-full h-24"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-white text-black rounded-lg font-light hover:bg-gray-100 transition"
          >
            {editingId ? 'Update Client' : 'Add Client'}
          </button>
        </motion.form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clients.length === 0 ? (
          <p className="text-gray-400 col-span-full p-8 text-center">No clients added yet</p>
        ) : (
          clients.map((client, idx) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-light text-lg">{client.clientName}</h3>
                  <p className="text-xs text-gray-500 capitalize">{client.clientType}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(client)}
                    className="text-xs px-2 py-1 rounded border border-gray-600 hover:border-gray-400 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="text-xs px-2 py-1 rounded border border-red-600 hover:border-red-400 transition text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-gray-400">
                  <span className="text-gray-500">Email:</span> {client.email}
                </p>
                {client.projectName && (
                  <p className="text-gray-400">
                    <span className="text-gray-500">Project:</span> {client.projectName}
                  </p>
                )}
                {client.projectStatus && (
                  <p className="text-gray-400">
                    <span className="text-gray-500">Status:</span>{' '}
                    <span className="capitalize">{client.projectStatus}</span>
                  </p>
                )}
                {client.budget && (
                  <p className="text-gray-400">
                    <span className="text-gray-500">Budget:</span> ${parseFloat(client.budget).toFixed(2)}
                  </p>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
