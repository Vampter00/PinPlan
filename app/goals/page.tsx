'use client'

import { useState, useEffect } from 'react'
import { Target, Plus, Trash2, CheckCircle2 } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { LocalStorage } from '@/lib/storage'
import { Goal } from '@/lib/types'

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const saved = LocalStorage.getGoals()
    setGoals(saved)
  }, [])

  const handleAddGoal = (goal: Goal) => {
    LocalStorage.addGoal(goal)
    setGoals([...goals, goal])
    setShowForm(false)
  }

  const handleUpdateGoal = (id: string, updates: Partial<Goal>) => {
    LocalStorage.updateGoal(id, updates)
    setGoals(goals.map(g => g.id === id ? { ...g, ...updates } : g))
  }

  const handleDeleteGoal = (id: string) => {
    if (confirm('Delete this goal?')) {
      const updated = goals.filter(g => g.id !== id)
      setGoals(updated)
      // Update localStorage
      const allGoals = LocalStorage.getGoals()
      const filtered = allGoals.filter(g => g.id !== id)
      localStorage.setItem('pinplan_goals', JSON.stringify(filtered))
    }
  }

  const categories = [
    { value: 'weight', label: 'Weight', emoji: '⚖️' },
    { value: 'strength', label: 'Strength', emoji: '💪' },
    { value: 'performance', label: 'Performance', emoji: '⚡' },
    { value: 'health', label: 'Health', emoji: '❤️' },
  ]

  const completedGoals = goals.filter(g => g.progress === 100)
  const activeGoals = goals.filter(g => g.progress < 100)

  return (
    <main className="min-h-screen bg-dark">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Goals</h1>
            <p className="text-slate-400">Track your fitness and health goals</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            New Goal
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stat-box">
            <Target className="text-primary mb-2" size={24} />
            <div className="text-2xl font-bold">{goals.length}</div>
            <div className="text-sm text-slate-400">Total Goals</div>
          </div>
          <div className="stat-box">
            <div className="text-primary mb-2" style={{ fontSize: '24px' }}>🎯</div>
            <div className="text-2xl font-bold">{activeGoals.length}</div>
            <div className="text-sm text-slate-400">Active Goals</div>
          </div>
          <div className="stat-box">
            <CheckCircle2 className="text-success mb-2" size={24} />
            <div className="text-2xl font-bold">{completedGoals.length}</div>
            <div className="text-sm text-slate-400">Completed</div>
          </div>
        </div>

        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Active Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeGoals.map(goal => {
                const category = categories.find(c => c.value === goal.category)
                const progressPercent = Math.min((goal.currentValue / goal.targetValue) * 100, 100)
                
                return (
                  <div key={goal.id} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{goal.name}</h3>
                        <span className="text-sm text-primary">{category?.emoji} {category?.label}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-danger hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-400">Progress</span>
                        <span className="font-semibold text-primary">{progressPercent.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-dark rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Goal Details */}
                    <div className="space-y-2 mb-4 text-sm border-t border-slate-700 pt-4">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Current:</span>
                        <span className="font-semibold">{goal.currentValue} {goal.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Target:</span>
                        <span className="font-semibold text-primary">{goal.targetValue} {goal.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Deadline:</span>
                        <span className="font-semibold">{goal.deadline}</span>
                      </div>
                    </div>

                    {/* Update Button */}
                    <button
                      onClick={() => {
                        const newValue = prompt(`Update ${goal.name} (current: ${goal.currentValue} ${goal.unit}):`, goal.currentValue.toString())
                        if (newValue !== null) {
                          const updated = {
                            ...goal,
                            currentValue: parseFloat(newValue),
                            progress: Math.min((parseFloat(newValue) / goal.targetValue) * 100, 100),
                          }
                          handleUpdateGoal(goal.id, updated)
                        }
                      }}
                      className="btn-secondary w-full text-sm"
                    >
                      Update Value
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <CheckCircle2 className="text-success" />
              Completed Goals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedGoals.map(goal => {
                const category = categories.find(c => c.value === goal.category)
                
                return (
                  <div key={goal.id} className="card border-l-4 border-l-success opacity-75">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1 line-through">{goal.name}</h3>
                        <span className="text-sm text-success">{category?.emoji} {category?.label}</span>
                      </div>
                      <CheckCircle2 className="text-success" size={24} />
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Achieved:</span>
                        <span className="font-semibold text-success">{goal.currentValue} {goal.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Target:</span>
                        <span className="font-semibold">{goal.targetValue} {goal.unit}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="btn-secondary w-full text-sm mt-4"
                    >
                      Remove
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {goals.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Target size={48} className="mx-auto mb-4 opacity-50" />
            <p>No goals yet. Set your first goal to get started!</p>
          </div>
        )}
      </div>

      {showForm && (
        <GoalFormModal
          onClose={() => setShowForm(false)}
          onSave={handleAddGoal}
          categories={categories}
        />
      )}
    </main>
  )
}

function GoalFormModal({ onClose, onSave, categories }: any) {
  const [form, setForm] = useState({
    name: '',
    category: 'strength' as const,
    targetValue: 0,
    currentValue: 0,
    unit: '',
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  })

  const handleSubmit = () => {
    onSave({
      id: generateId(),
      ...form,
      progress: (form.currentValue / form.targetValue) * 100,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-light border border-slate-700 rounded-lg p-6 max-w-md w-full animate-slide-up">
        <h2 className="text-2xl font-bold mb-6">Set a New Goal</h2>

        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Goal name (e.g., Bench Press 315lbs)"
            className="input-field w-full"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <select
            className="input-field w-full"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as any })}
          >
            {categories.map((cat: any) => (
              <option key={cat.value} value={cat.value}>
                {cat.emoji} {cat.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Unit (e.g., lbs, kg, miles)"
            className="input-field w-full"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
          />

          <input
            type="number"
            placeholder="Current value"
            className="input-field w-full"
            value={form.currentValue}
            onChange={(e) => setForm({ ...form, currentValue: parseFloat(e.target.value) })}
          />

          <input
            type="number"
            placeholder="Target value"
            className="input-field w-full"
            value={form.targetValue}
            onChange={(e) => setForm({ ...form, targetValue: parseFloat(e.target.value) })}
          />

          <input
            type="date"
            className="input-field w-full"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
        </div>

        <div className="flex gap-3">
          <button className="btn-primary flex-1" onClick={handleSubmit}>
            Create Goal
          </button>
          <button className="btn-secondary flex-1" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
