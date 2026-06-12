export interface DailyMetrics {
  id: string
  date: string
  weight: number
  calories: number
  protein: number
  carbs: number
  fats: number
  exerciseMinutes: number
  exerciseType: string
  sleepHours: number
  mood: 'excellent' | 'good' | 'okay' | 'poor'
  notes: string
  cyclePhase: CyclePhase
}

export interface CyclePhase {
  id: string
  name: string
  type: 'bulking' | 'cutting' | 'maintenance' | 'rest'
  startDate: string
  endDate: string
  targetCalories: number
  targetProtein: number
  notes: string
}

export interface AIInsight {
  id: string
  type: 'warning' | 'achievement' | 'suggestion' | 'trend'
  title: string
  description: string
  metric: string
  timestamp: string
  dismissed: boolean
}

export interface TrainingSession {
  id: string
  date: string
  exerciseType: string
  duration: number
  intensity: 'light' | 'moderate' | 'intense'
  exercises: Exercise[]
  notes: string
}

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: number
  weight: number
  notes: string
}

export interface Statistics {
  averageCalories: number
  averageProtein: number
  averageWeight: number
  totalWorkouts: number
  currentStreak: number
  bestDay: string
  trends: Trend[]
}

export interface Trend {
  date: string
  value: number
  metric: string
}

export interface Goal {
  id: string
  name: string
  category: 'weight' | 'strength' | 'performance' | 'health'
  targetValue: number
  currentValue: number
  unit: string
  deadline: string
  progress: number
}
