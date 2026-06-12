import { DailyMetrics, CyclePhase, AIInsight, Goal, Statistics, Trend } from './types'

const STORAGE_KEYS = {
  DAILY_METRICS: 'pinplan_daily_metrics',
  CYCLES: 'pinplan_cycles',
  INSIGHTS: 'pinplan_insights',
  GOALS: 'pinplan_goals',
  APP_DATA: 'pinplan_app_data',
}

// Local Storage Manager
export const LocalStorage = {
  // Daily Metrics
  addMetric: (metric: DailyMetrics) => {
    const metrics = LocalStorage.getMetrics()
    metrics.push(metric)
    localStorage.setItem(STORAGE_KEYS.DAILY_METRICS, JSON.stringify(metrics))
    return metric
  },

  getMetrics: (): DailyMetrics[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_METRICS)
    return data ? JSON.parse(data) : []
  },

  updateMetric: (id: string, updates: Partial<DailyMetrics>) => {
    const metrics = LocalStorage.getMetrics()
    const index = metrics.findIndex(m => m.id === id)
    if (index !== -1) {
      metrics[index] = { ...metrics[index], ...updates }
      localStorage.setItem(STORAGE_KEYS.DAILY_METRICS, JSON.stringify(metrics))
    }
    return metrics[index]
  },

  deleteMetric: (id: string) => {
    const metrics = LocalStorage.getMetrics()
    const filtered = metrics.filter(m => m.id !== id)
    localStorage.setItem(STORAGE_KEYS.DAILY_METRICS, JSON.stringify(filtered))
  },

  getMetricsByDateRange: (startDate: string, endDate: string): DailyMetrics[] => {
    const metrics = LocalStorage.getMetrics()
    return metrics.filter(m => m.date >= startDate && m.date <= endDate)
  },

  // Cycles
  addCycle: (cycle: CyclePhase) => {
    const cycles = LocalStorage.getCycles()
    cycles.push(cycle)
    localStorage.setItem(STORAGE_KEYS.CYCLES, JSON.stringify(cycles))
    return cycle
  },

  getCycles: (): CyclePhase[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.CYCLES)
    return data ? JSON.parse(data) : []
  },

  updateCycle: (id: string, updates: Partial<CyclePhase>) => {
    const cycles = LocalStorage.getCycles()
    const index = cycles.findIndex(c => c.id === id)
    if (index !== -1) {
      cycles[index] = { ...cycles[index], ...updates }
      localStorage.setItem(STORAGE_KEYS.CYCLES, JSON.stringify(cycles))
    }
    return cycles[index]
  },

  getCurrentCycle: (): CyclePhase | null => {
    const cycles = LocalStorage.getCycles()
    const today = new Date().toISOString().split('T')[0]
    return cycles.find(c => c.startDate <= today && today <= c.endDate) || null
  },

  // Goals
  addGoal: (goal: Goal) => {
    const goals = LocalStorage.getGoals()
    goals.push(goal)
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals))
    return goal
  },

  getGoals: (): Goal[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.GOALS)
    return data ? JSON.parse(data) : []
  },

  updateGoal: (id: string, updates: Partial<Goal>) => {
    const goals = LocalStorage.getGoals()
    const index = goals.findIndex(g => g.id === id)
    if (index !== -1) {
      goals[index] = { ...goals[index], ...updates }
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals))
    }
    return goals[index]
  },

  // Clear all data
  clearAllData: () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
  },

  // Export data
  exportData: () => {
    return {
      metrics: LocalStorage.getMetrics(),
      cycles: LocalStorage.getCycles(),
      goals: LocalStorage.getGoals(),
      timestamp: new Date().toISOString(),
    }
  },

  // Import data
  importData: (data: any) => {
    if (data.metrics) localStorage.setItem(STORAGE_KEYS.DAILY_METRICS, JSON.stringify(data.metrics))
    if (data.cycles) localStorage.setItem(STORAGE_KEYS.CYCLES, JSON.stringify(data.cycles))
    if (data.goals) localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(data.goals))
  },
}

// Analytics Engine
export const Analytics = {
  getStatistics: (days: number = 30): Statistics => {
    const metrics = LocalStorage.getMetrics()
    const now = new Date()
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]

    const relevantMetrics = metrics.filter(m => m.date >= startDate)

    if (relevantMetrics.length === 0) {
      return {
        averageCalories: 0,
        averageProtein: 0,
        averageWeight: 0,
        totalWorkouts: 0,
        currentStreak: 0,
        bestDay: '',
        trends: [],
      }
    }

    const avgCalories =
      relevantMetrics.reduce((sum, m) => sum + m.calories, 0) / relevantMetrics.length
    const avgProtein =
      relevantMetrics.reduce((sum, m) => sum + m.protein, 0) / relevantMetrics.length
    const avgWeight =
      relevantMetrics.reduce((sum, m) => sum + m.weight, 0) / relevantMetrics.length
    const totalWorkouts = relevantMetrics.filter(m => m.exerciseMinutes > 0).length

    const trends: Trend[] = relevantMetrics.map(m => ({
      date: m.date,
      value: m.weight,
      metric: 'weight',
    }))

    return {
      averageCalories: Math.round(avgCalories),
      averageProtein: Math.round(avgProtein),
      averageWeight: Math.round(avgWeight * 10) / 10,
      totalWorkouts,
      currentStreak: calculateStreak(relevantMetrics),
      bestDay: findBestDay(relevantMetrics),
      trends,
    }
  },

  generateInsights: (): AIInsight[] => {
    const metrics = LocalStorage.getMetrics()
    const stats = Analytics.getStatistics(30)
    const insights: AIInsight[] = []

    if (stats.totalWorkouts > 20) {
      insights.push({
        id: `insight_${Date.now()}`,
        type: 'achievement',
        title: 'Consistency Champ! 🔥',
        description: `You've logged ${stats.totalWorkouts} workouts in the last 30 days. Keep crushing it!`,
        metric: 'workouts',
        timestamp: new Date().toISOString(),
        dismissed: false,
      })
    }

    // Protein intake insight
    if (stats.averageProtein < 100) {
      insights.push({
        id: `insight_${Date.now()}_protein`,
        type: 'suggestion',
        title: 'Increase Protein Intake',
        description: `Your average protein intake is ${stats.averageProtein}g. Aim for 0.8-1g per lb of body weight for muscle gain.`,
        metric: 'protein',
        timestamp: new Date().toISOString(),
        dismissed: false,
      })
    }

    // Weight trend
    if (metrics.length > 7) {
      const last7 = metrics.slice(-7)
      const weightTrend =
        last7[last7.length - 1].weight - last7[0].weight
      if (weightTrend > 1) {
        insights.push({
          id: `insight_${Date.now()}_weight`,
          type: 'trend',
          title: 'Weight Trending Up',
          description: `Your weight has increased by ${weightTrend.toFixed(1)}lbs in the last week. Monitor calorie intake.`,
          metric: 'weight',
          timestamp: new Date().toISOString(),
          dismissed: false,
        })
      }
    }

    return insights
  },
}

// Helper functions
function calculateStreak(metrics: DailyMetrics[]): number {
  if (metrics.length === 0) return 0

  let streak = 0
  const sortedMetrics = [...metrics].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  for (let i = 0; i < sortedMetrics.length; i++) {
    const currentDate = new Date(sortedMetrics[i].date)
    if (i === 0) {
      streak = 1
    } else {
      const prevDate = new Date(sortedMetrics[i - 1].date)
      const dayDiff =
        (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      if (Math.abs(dayDiff - 1) < 0.1) {
        streak++
      } else {
        break
      }
    }
  }

  return streak
}

function findBestDay(metrics: DailyMetrics[]): string {
  if (metrics.length === 0) return ''

  const bestMetric = metrics.reduce((best, current) =>
    current.exerciseMinutes > best.exerciseMinutes ? current : best
  )

  return bestMetric.date
}
