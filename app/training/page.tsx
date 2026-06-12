'use client'

import { useState, useEffect } from 'react'
import { Dumbbell, Plus, Trash2, Calendar, Clock } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { LocalStorage } from '@/lib/storage'
import { DailyMetrics } from '@/lib/types'

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

interface WorkoutLog {
  id: string
  date: string
  exerciseType: string
  duration: number
  exercises: ExerciseLog[]
  notes: string
  intensity: 'light' | 'moderate' | 'intense'
}

interface ExerciseLog {
  name: string
  sets: number
  reps: number
  weight: number
}

export default function TrainingPage() {
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([])
  const [showForm, setShowForm] = useState(false)
  const [metrics, setMetrics] = useState<DailyMetrics[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('pinplan_workouts')
    if (saved) setWorkouts(JSON.parse(saved))
    setMetrics(LocalStorage.getMetrics())
  }, [])

  const handleAddWorkout = (workout: WorkoutLog) => {
    const updated = [...workouts, workout]
    setWorkouts(updated)
    localStorage.setItem('pinplan_workouts', JSON.stringify(updated))
    setShowForm(false)
  }

  const handleDeleteWorkout = (id: string) => {
    if (confirm('Delete this workout?')) {
      const updated = workouts.filter(w => w.id !== id)
      setWorkouts(updated)
      localStorage.setItem('pinplan_workouts', JSON.stringify(updated))
    }
  }

  const totalVolume = workouts.reduce((sum, w) => sum + w.exercises.reduce((s, e) => s + e.sets * e.reps * e.weight, 0), 0)

  return (
    <main className="min-h-screen bg-dark">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Training Tracker</h1>
            <p className="text-slate-400">Log your workouts and track performance</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Log Workout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stat-box">
            <Dumbbell className="text-primary mb-2" />
            <div className="text-2xl font-bold">{workouts.length}</div>
            <div className="text-sm text-slate-400">Total Workouts</div>
          </div>
          <div className="stat-box">
            <Clock className="text-accent mb-2" />
            <div className="text-2xl font-bold">{workouts.reduce((sum, w) => sum + w.duration, 0)}</div>
            <div className="text-sm text-slate-400">Total Minutes</div>
          </div>
          <div className="stat-box">
            <Dumbbell className="text-success mb-2" />
            <div className="text-2xl font-bold">{(totalVolume / 1000).toFixed(1)}k</div>
            <div className="text-sm text-slate-400">Total Volume (lbs)</div>
          </div>
        </div>

        {/* Workout List */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Recent Workouts</h2>
          <div className="space-y-4">
            {workouts.length > 0 ? (
              workouts
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(workout => (
                  <div key={workout.id} className="border border-slate-700 rounded-lg p-4 hover:border-primary/50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar size={18} className="text-primary" />
                          <span className="font-semibold">{workout.date}</span>
                        </div>
                        <p className="text-sm text-slate-400">{workout.exerciseType}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteWorkout(workout.id)}
                        className="text-danger hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    {/* Exercise Details */}
                    <div className="bg-dark/50 rounded p-3 mb-3">
                      <p className="text-sm font-medium text-slate-300 mb-2">Exercises:</p>
                      <div className="space-y-1 text-sm">
                        {workout.exercises.map((ex, i) => (
                          <p key={i} className="text-slate-400">
                            {ex.name}: {ex.sets}x{ex.reps} @ {ex.weight}lbs
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">{workout.duration} minutes • Intensity: <span className="badge">{workout.intensity}</span></span>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Dumbbell size={48} className="mx-auto mb-4 opacity-50" />
                <p>No workouts logged yet. Start training!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <WorkoutFormModal
          onClose={() => setShowForm(false)}
          onSave={handleAddWorkout}
        />
      )}
    </main>
  )
}

function WorkoutFormModal({ onClose, onSave }: any) {
  const [form, setForm] = useState<Omit<WorkoutLog, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    exerciseType: 'strength',
    duration: 60,
    intensity: 'moderate',
    exercises: [{ name: '', sets: 3, reps: 10, weight: 0 }],
    notes: '',
  })

  const handleAddExercise = () => {
    setForm({
      ...form,
      exercises: [...form.exercises, { name: '', sets: 3, reps: 10, weight: 0 }],
    })
  }

  const handleUpdateExercise = (index: number, updates: Partial<ExerciseLog>) => {
    const updated = [...form.exercises]
    updated[index] = { ...updated[index], ...updates }
    setForm({ ...form, exercises: updated })
  }

  const handleRemoveExercise = (index: number) => {
    const updated = form.exercises.filter((_, i) => i !== index)
    setForm({ ...form, exercises: updated })
  }

  const handleSubmit = () => {
    onSave({
      id: generateId(),
      ...form,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-dark-light border border-slate-700 rounded-lg p-6 max-w-2xl w-full my-8 animate-slide-up">
        <h2 className="text-2xl font-bold mb-6">Log Workout</h2>

        <div className="space-y-4 mb-6">
          <input
            type="date"
            className="input-field w-full"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          
          <select
            className="input-field w-full"
            value={form.exerciseType}
            onChange={(e) => setForm({ ...form, exerciseType: e.target.value })}
          >
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="flexibility">Flexibility</option>
            <option value="mixed">Mixed</option>
          </select>

          <input
            type="number"
            placeholder="Duration (minutes)"
            className="input-field w-full"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
          />

          <select
            className="input-field w-full"
            value={form.intensity}
            onChange={(e) => setForm({ ...form, intensity: e.target.value as any })}
          >
            <option value="light">Light</option>
            <option value="moderate" selected>Moderate</option>
            <option value="intense">Intense</option>
          </select>

          {/* Exercises */}
          <div className="border-t border-slate-700 pt-4">
            <h3 className="font-semibold mb-3">Exercises</h3>
            <div className="space-y-3 mb-3">
              {form.exercises.map((ex, i) => (
                <div key={i} className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  <input
                    type="text"
                    placeholder="Exercise name"
                    className="input-field"
                    value={ex.name}
                    onChange={(e) => handleUpdateExercise(i, { name: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Sets"
                    className="input-field"
                    value={ex.sets}
                    onChange={(e) => handleUpdateExercise(i, { sets: parseInt(e.target.value) })}
                  />
                  <input
                    type="number"
                    placeholder="Reps"
                    className="input-field"
                    value={ex.reps}
                    onChange={(e) => handleUpdateExercise(i, { reps: parseInt(e.target.value) })}
                  />
                  <input
                    type="number"
                    placeholder="Weight"
                    className="input-field"
                    value={ex.weight}
                    onChange={(e) => handleUpdateExercise(i, { weight: parseFloat(e.target.value) })}
                  />
                  <button
                    onClick={() => handleRemoveExercise(i)}
                    className="text-danger hover:text-red-400"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddExercise}
              className="btn-secondary w-full text-sm"
            >
              <Plus size={16} className="inline mr-1" />
              Add Exercise
            </button>
          </div>

          <textarea
            placeholder="Notes..."
            className="input-field w-full"
            rows={2}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <div className="flex gap-3">
          <button className="btn-primary flex-1" onClick={handleSubmit}>
            Save Workout
          </button>
          <button className="btn-secondary flex-1" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
