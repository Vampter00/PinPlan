'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { Activity, TrendingUp, Zap, Target, Calendar, Plus, Flame, Heart, Dumbbell, Gauge, ArrowUp, Clock } from 'lucide-react'
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
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  const last30Days = metrics.slice(-30)
  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#fbbf24']

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark via-dark-light to-dark">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* HERO SECTION */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/10 border border-primary/30 p-8 md:p-12 shadow-2xl shadow-primary/20 group hover:shadow-primary/40 transition-all duration-500">
          <div className="absolute inset-0 bg-grid-pattern opacity-5 group-hover:opacity-10 transition-opacity"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Flame className="text-secondary" size={24} />
              </div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Welcome Back, Athlete</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent leading-tight">
              Ready to Crush It?
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-2xl">
              {currentCycle ? (
                <>
                  Current Phase: <span className="font-bold text-secondary">{currentCycle.name}</span> • 
                  Target: <span className="font-bold text-accent">{currentCycle.targetCalories} kcal/day</span>
                </>
              ) : 'No active cycle. Start a new training phase to supercharge your progress!'}
            </p>
            
            <button
              onClick={() => setShowMetricsForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-dark font-bold rounded-xl flex items-center gap-3 hover:scale-105 hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 text-lg"
            >
              <Plus size={24} />
              Log Today's Metrics
            </button>
          </div>
          
          <div className="absolute -right-20 -top-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* KEY STATS - PREMIUM CARDS */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PremiumStatCard
              icon={<Flame size={28} className="text-orange-500" />}
              label="Avg Calories"
              value={stats.averageCalories}
              unit="kcal"
              trend={8.5}
              color="from-orange-500/20 to-red-500/20"
            />
            <PremiumStatCard
              icon={<Dumbbell size={28} className="text-green-500" />}
              label="Avg Protein"
              value={stats.averageProtein}
              unit="g"
              trend={5.2}
              color="from-green-500/20 to-emerald-500/20"
            />
            <PremiumStatCard
              icon={<Activity size={28} className="text-cyan-500" />}
              label="Workouts"
              value={stats.totalWorkouts}
              unit="sessions"
              trend={12.3}
              color="from-cyan-500/20 to-blue-500/20"
            />
            <PremiumStatCard
              icon={<Clock size={28} className="text-amber-500" />}
              label="Streak"
              value={stats.currentStreak}
              unit="days"
              trend={100}
              color="from-amber-500/20 to-yellow-500/20"
            />
          </div>
        )}

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weight Trend */}
          <div className="group rounded-2xl overflow-hidden border border-slate-700 bg-dark-light/50 backdrop-blur hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/20">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <TrendingUp className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Weight Progress</h3>
                    <p className="text-sm text-slate-400">Last 30 days trend</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              {last30Days.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={last30Days}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '2px solid #0ea5e9', borderRadius: '10px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="weight" stroke="#fbbf24" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-72 flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <Scale className="mx-auto mb-3 opacity-50" size={48} />
                    <p>Start logging weight data</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Calorie Intake */}
          <div className="group rounded-2xl overflow-hidden border border-slate-700 bg-dark-light/50 backdrop-blur hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/20">
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-500/20 rounded-lg">
                    <Flame className="text-orange-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Calorie Intake</h3>
                    <p className="text-sm text-slate-400">Daily consumption</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              {last30Days.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={last30Days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '2px solid #f59e0b', borderRadius: '10px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="calories" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-72 flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <Flame className="mx-auto mb-3 opacity-50" size={48} />
                    <p>Start logging calories</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* WORKOUT & MACRO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Workout Activity */}
          <div className="group rounded-2xl overflow-hidden border border-slate-700 bg-dark-light/50 backdrop-blur hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/20">
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-slate-700 p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-500/20 rounded-lg">
                  <Dumbbell className="text-cyan-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Workout Activity</h3>
                  <p className="text-sm text-slate-400">Minutes per session</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              {last30Days.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={last30Days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '2px solid #06b6d4', borderRadius: '10px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="exerciseMinutes" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-72 flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <Activity className="mx-auto mb-3 opacity-50" size={48} />
                    <p>Log your first workout</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Macro Distribution */}
          <div className="group rounded-2xl overflow-hidden border border-slate-700 bg-dark-light/50 backdrop-blur hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/20">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-slate-700 p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Gauge className="text-green-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Macro Balance</h3>
                  <p className="text-sm text-slate-400">Nutritional distribution</p>
                </div>
              </div>
            </div>
            <div className="p-6 flex items-center justify-center">
              {stats && (stats.averageProtein > 0) ? (
                <div>
                  <ResponsiveContainer width={280} height={280}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Protein', value: stats.averageProtein },
                          { name: 'Carbs', value: stats.averageProtein * 2 },
                          { name: 'Fats', value: stats.averageProtein * 0.8 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '2px solid #0ea5e9', borderRadius: '10px' }}
                        labelStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-6 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Protein</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span>Carbs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>Fats</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <Gauge className="mx-auto mb-3 opacity-50" size={48} />
                  <p>Log metrics to see macro breakdown</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* INSIGHTS SECTION */}
        <div className="rounded-2xl overflow-hidden border border-slate-700 bg-dark-light/50 backdrop-blur shadow-lg">
          <div className="bg-gradient-to-r from-secondary/10 to-accent/10 border-b border-slate-700 p-6">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Heart className="text-secondary" size={28} />
              AI Insights
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {Analytics.generateInsights().slice(0, 2).map(insight => (
              <div
                key={insight.id}
                className="p-5 rounded-xl border-l-4 border-l-secondary bg-gradient-to-br from-secondary/10 to-transparent hover:shadow-lg hover:shadow-secondary/20 transition-all duration-300"
              >
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                  {insight.type === 'achievement' && '🎯'}
                  {insight.type === 'suggestion' && '💡'}
                  {insight.type === 'trend' && '📈'}
                  {insight.type === 'warning' && '⚠️'}
                  {insight.title}
                </h4>
                <p className="text-slate-300 text-sm mb-3">{insight.description}</p>
                <span className="inline-block px-3 py-1 bg-secondary/20 text-secondary text-xs font-semibold rounded-lg uppercase">
                  {insight.type}
                </span>
              </div>
            ))}
          </div>
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

function PremiumStatCard({ icon, label, value, unit, trend, color }: any) {
  return (
    <div className={`group relative rounded-2xl overflow-hidden border border-slate-700 bg-gradient-to-br ${color} backdrop-blur p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-105`}>
      <div className="absolute inset-0 bg-grid-pattern opacity-0 group-hover:opacity-5 transition-opacity"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/10 rounded-lg group-hover:scale-110 transition-transform">
            {icon}
          </div>
          {trend > 0 && (
            <div className="flex items-center gap-1 text-green-400 text-sm font-bold">
              <ArrowUp size={16} />
              {trend}%
            </div>
          )}
        </div>
        
        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">{label}</p>
        <p className="text-4xl font-black mb-1">{value.toLocaleString()}</p>
        <p className="text-slate-500 text-sm">{unit}</p>
      </div>
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-dark-light to-dark border border-primary/30 rounded-2xl p-8 max-w-2xl w-full max-h-screen overflow-y-auto animate-slide-up shadow-2xl shadow-primary/20">
        <h2 className="text-3xl font-black mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          📊 Log Your Metrics
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Weight (lbs)</label>
            <input
              type="number"
              placeholder="0"
              className="input-field w-full"
              onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Calories</label>
            <input
              type="number"
              placeholder="2500"
              className="input-field w-full"
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Protein (g)</label>
            <input
              type="number"
              placeholder="150"
              className="input-field w-full"
              value={formData.protein}
              onChange={(e) => setFormData({ ...formData, protein: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Exercise (min)</label>
            <input
              type="number"
              placeholder="0"
              className="input-field w-full"
              onChange={(e) => setFormData({ ...formData, exerciseMinutes: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Sleep Hours</label>
            <input
              type="number"
              placeholder="8"
              className="input-field w-full"
              value={formData.sleepHours}
              onChange={(e) => setFormData({ ...formData, sleepHours: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Mood</label>
            <select className="input-field w-full" onChange={(e) => setFormData({ ...formData, mood: e.target.value as any })}>
              <option value="excellent">Excellent 😄</option>
              <option value="good" selected>Good 😊</option>
              <option value="okay">Okay 😐</option>
              <option value="poor">Poor 😞</option>
            </select>
          </div>
        </div>

        <textarea
          placeholder="Notes about your day..."
          className="input-field w-full mb-6"
          rows={3}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />

        <div className="flex gap-3">
          <button className="btn-primary flex-1 text-lg py-3 rounded-xl font-bold" onClick={handleSubmit}>
            💾 Save Metrics
          </button>
          <button className="btn-secondary flex-1 text-lg py-3 rounded-xl font-bold" onClick={onClose}>
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// Import missing icon
import { Scale } from 'lucide-react'
