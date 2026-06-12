'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Trash2, Edit2, Plus } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { LocalStorage } from '@/lib/storage'
import { DailyMetrics } from '@/lib/types'

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<DailyMetrics[]>([])
  const [filteredMetrics, setFilteredMetrics] = useState<DailyMetrics[]>([])
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('30')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    const all = LocalStorage.getMetrics()
    setMetrics(all)
    filterMetrics(all, timeRange)
  }, [])

  const filterMetrics = (data: DailyMetrics[], days: string) => {
    const now = new Date()
    const startDate = new Date(now.getTime() - parseInt(days) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]

    const filtered = data.filter(m => m.date >= startDate)
    setFilteredMetrics(filtered)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this metric entry?')) {
      LocalStorage.deleteMetric(id)
      const updated = metrics.filter(m => m.id !== id)
      setMetrics(updated)
      filterMetrics(updated, timeRange)
    }
  }

  const handleTimeRangeChange = (range: '7' | '30' | '90') => {
    setTimeRange(range)
    filterMetrics(metrics, range)
  }

  return (
    <main className="min-h-screen bg-dark">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Metrics Dashboard</h1>
            <p className="text-slate-400">Track your nutrition and performance</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            New Entry
          </button>
        </div>

        {/* Time Range Filter */}
        <div className="flex gap-3">
          {(['7', '30', '90'] as const).map(range => (
            <button
              key={range}
              onClick={() => handleTimeRangeChange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === range
                  ? 'bg-primary text-dark'
                  : 'bg-dark-light text-slate-300 hover:text-white'
              }`}
            >
              Last {range} Days
            </button>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calories Chart */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Calorie Intake</h2>
            {filteredMetrics.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #0ea5e9' }} />
                  <Bar dataKey="calories" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center text-slate-500">No data</div>
            )}
          </div>

          {/* Weight Trend */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Weight Progress</h2>
            {filteredMetrics.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #0ea5e9' }} />
                  <Line type="monotone" dataKey="weight" stroke="#fbbf24" strokeWidth={2} dot={{ fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center text-slate-500">No data</div>
            )}
          </div>
        </div>

        {/* Macro Breakdown */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Protein Intake Trend</h2>
          {filteredMetrics.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #0ea5e9' }} />
                <Legend />
                <Line type="monotone" dataKey="protein" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-slate-500">No data</div>
          )}
        </div>

        {/* Metrics Table */}
        <div className="card overflow-hidden">
          <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Date</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">Weight</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">Calories</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">Protein</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">Exercise</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMetrics.length > 0 ? (
                  filteredMetrics
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(metric => (
                      <tr key={metric.id} className="border-b border-slate-700 hover:bg-dark-light/50 transition-colors">
                        <td className="px-4 py-3 text-sm">{metric.date}</td>
                        <td className="px-4 py-3 text-sm text-right">{metric.weight}lbs</td>
                        <td className="px-4 py-3 text-sm text-right">{metric.calories}kcal</td>
                        <td className="px-4 py-3 text-sm text-right">{metric.protein}g</td>
                        <td className="px-4 py-3 text-sm text-right">{metric.exerciseMinutes}min</td>
                        <td className="px-4 py-3 text-sm text-right space-x-2">
                          <button
                            onClick={() => handleDelete(metric.id)}
                            className="text-danger hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      No metrics recorded yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showForm && (
        <MetricsFormModal
          onClose={() => setShowForm(false)}
          onSave={() => {
            setShowForm(false)
            window.location.reload()
          }}
        />
      )}
    </main>
  )
}

function MetricsFormModal({ onClose, onSave }: any) {
  const [form, setForm] = useState({
    weight: 0,
    calories: 2500,
    protein: 150,
    carbs: 250,
    fats: 80,
    exerciseMinutes: 0,
    exerciseType: 'strength',
    sleepHours: 8,
    mood: 'good' as const,
  })

  const handleSubmit = () => {
    const metric: DailyMetrics = {
      id: generateId(),
      date: new Date().toISOString().split('T')[0],
      ...form,
      notes: '',
      cyclePhase: { id: '', name: '', type: 'maintenance', startDate: '', endDate: '', targetCalories: 0, targetProtein: 0, notes: '' },
    }
    LocalStorage.addMetric(metric)
    onSave()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-light border border-slate-700 rounded-lg p-6 max-w-md w-full animate-slide-up">
        <h2 className="text-2xl font-bold mb-6">Log Metrics</h2>
        
        <div className="space-y-4 mb-6">
          <input type="number" placeholder="Weight (lbs)" className="input-field w-full" onChange={(e) => setForm({ ...form, weight: parseFloat(e.target.value) })} />
          <input type="number" placeholder="Calories" className="input-field w-full" value={form.calories} onChange={(e) => setForm({ ...form, calories: parseFloat(e.target.value) })} />
          <input type="number" placeholder="Protein (g)" className="input-field w-full" value={form.protein} onChange={(e) => setForm({ ...form, protein: parseFloat(e.target.value) })} />
          <input type="number" placeholder="Exercise Minutes" className="input-field w-full" onChange={(e) => setForm({ ...form, exerciseMinutes: parseFloat(e.target.value) })} />
          <input type="number" placeholder="Sleep Hours" className="input-field w-full" value={form.sleepHours} onChange={(e) => setForm({ ...form, sleepHours: parseFloat(e.target.value) })} />
        </div>

        <div className="flex gap-3">
          <button className="btn-primary flex-1" onClick={handleSubmit}>Save</button>
          <button className="btn-secondary flex-1" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
