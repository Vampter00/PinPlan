'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Activity, TrendingUp, Zap, Target, Calendar, Plus, Settings, Menu } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { LocalStorage, Analytics } from '@/lib/storage'
import { DailyMetrics, CyclePhase } from '@/lib/types'

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DailyMetrics[]>([])
  const [stats, setStats] = useState<any>(null)
  const [currentCycle, setCurrentCycle] = useState<CyclePhase | null>(null)
  const [showMetricsForm, setShowMetricsForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load data from localStorage
    const savedMetrics = LocalStorage.getMetrics()
    setMetrics(savedMetrics)
    setStats(Analytics.getStatistics(30))
    setCurrentCycle(LocalStorage.getCurrentCycle())
    setIsLoading(false)
  }, [])

  const handleAddMetric = (newMetric: DailyMetrics) => {
    LocalStorage.addMetric(newMetric)
    setMetrics(LocalStorage.getMetrics())
    setStats(Analytics.getStatistics(30))
    setShowMetricsForm(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    )
  }

  const last30Days = metrics.slice(-30)
  const macroData = stats ? [
    { name: 'Protein', value: stats.averageProtein, fill: '#10b981' },
    { name: 'Carbs', value: stats.averageProtein * 2, fill: '#f59e0b' },
    { name: 'Fats', value: stats.averageProtein * 0.8, fill: '#ef4444' },
  ] : []

  return (
    <main className="min-h-screen bg-dark">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 p-8 md:p-12">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">Welcome Back</h1>
            <p className="text-lg text-slate-300 mb-6">
              {currentCycle ? `Current Phase: ${currentCycle.name}` : 'No active cycle. Start a new phase to track your progress.'}
            </p>
            <button
              onClick={() => setShowMetricsForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Log Today's Metrics
            </button>
          </div>
          <div className="absolute right-0 top-0 opacity-10">
            <Activity size={300} />
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<TrendingUp size={24} className="text-success" />}
              label="Avg Calories"
              value={stats.averageCalories}
              unit="kcal"
              trend="up"
            />
            <StatCard
              icon={<Zap size={24} className="text-warning" />}
              label="Avg Protein"
              value={stats.averageProtein}
              unit="g"
              trend="stable"
            />
            <StatCard
              icon={<Target size={24} className="text-primary" />}
              label="Workouts"
              value={stats.totalWorkouts}
              unit="sessions"
              trend="up"
            />
            <StatCard
              icon={<Calendar size={24} className="text-accent" />}
              label="Current Streak"
              value={stats.currentStreak}
              unit="days"
              trend="up"
            />
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weight Trend */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="text-primary" />
              Weight Trend
            </h2>
            {last30Days.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={last30Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #0ea5e9' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{ fill: '#fbbf24', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center text-slate-500">
                No data yet. Start logging metrics!
              </div>
            )}
          </div>

          {/* Calorie Distribution */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="text-warning" />
              Macro Balance
            </h2>
            {macroData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value.toFixed(0)}g`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #0ea5e9' }}
                    labelStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center text-slate-500">
                No data yet
              </div>
            )}
          </div>
        </div>

        {/* Workout Activity */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="text-primary" />
            Workout Activity (Last 30 Days)
          </h2>
          {last30Days.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={last30Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #0ea5e9' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="exerciseMinutes" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-slate-500">
              No workout data yet
            </div>
          )}
        </div>

        {/* Recent Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Analytics.generateInsights().slice(0, 2).map(insight => (
            <div key={insight.id} className="card border-l-4 border-l-primary">
              <h3 className="font-semibold text-lg mb-2">{insight.title}</h3>
              <p className="text-slate-400 text-sm">{insight.description}</p>
              <span className="inline-block mt-3 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                {insight.type.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {showMetricsForm && (
        <MetricsModal
          onClose={() => setShowMetricsForm(false)}
          onSave={handleAddMetric}
          currentCycle={currentCycle}
        />
      )}
    </main>
  )
}

function StatCard({ icon, label, value, unit, trend }: any) {
  return (
    <div className="stat-box animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400 text-sm font-medium">{label}</span>
        {icon}
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-500 mt-2">{unit}</div>
    </div>
  )
}

function MetricsModal({ onClose, onSave, currentCycle }: any) {
  const [formData, setFormData] = useState({
    weight: 0,
    calories: 2500,
    protein: 150,
    carbs: 250,
    fats: 80,
    exerciseMinutes: 0,
    exerciseType: 'strength',
    sleepHours: 8,
    mood: 'good',
    notes: '',
  })

  const handleSubmit = () => {
    const newMetric: DailyMetrics = {
      id: generateId(),
      date: new Date().toISOString().split('T')[0],
      ...formData,
      cyclePhase: currentCycle || { id: '', name: '', type: 'maintenance', startDate: '', endDate: '', targetCalories: 2500, targetProtein: 150, notes: '' },
    }
    onSave(newMetric)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-light border border-slate-700 rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto animate-slide-up">
        <h2 className="text-2xl font-bold mb-6">Log Today's Metrics</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <input
            type="number"
            placeholder="Weight (lbs)"
            className="input-field"
            onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
          />
          <input
            type="number"
            placeholder="Calories"
            className="input-field"
            value={formData.calories}
            onChange={(e) => setFormData({ ...formData, calories: parseFloat(e.target.value) })}
          />
          <input
            type="number"
            placeholder="Protein (g)"
            className="input-field"
            value={formData.protein}
            onChange={(e) => setFormData({ ...formData, protein: parseFloat(e.target.value) })}
          />
          <input
            type="number"
            placeholder="Exercise Minutes"
            className="input-field"
            onChange={(e) => setFormData({ ...formData, exerciseMinutes: parseFloat(e.target.value) })}
          />
          <input
            type="number"
            placeholder="Sleep Hours"
            className="input-field"
            value={formData.sleepHours}
            onChange={(e) => setFormData({ ...formData, sleepHours: parseFloat(e.target.value) })}
          />
          <select className="input-field" onChange={(e) => setFormData({ ...formData, mood: e.target.value as any })}>
            <option value="excellent">Excellent</option>
            <option value="good" selected>Good</option>
            <option value="okay">Okay</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        <textarea
          placeholder="Notes..."
          className="input-field w-full mb-6"
          rows={3}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />

        <div className="flex gap-3">
          <button className="btn-primary flex-1" onClick={handleSubmit}>
            Save Metrics
          </button>
          <button className="btn-secondary flex-1" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
