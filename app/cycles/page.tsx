'use client'

import { useState, useEffect } from 'react'
import { Target, Plus, Trash2, Edit2, Calendar } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { LocalStorage } from '@/lib/storage'
import { CyclePhase } from '@/lib/types'

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export default function CyclesPage() {
  const [cycles, setCycles] = useState<CyclePhase[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    const saved = LocalStorage.getCycles()
    setCycles(saved)
  }, [])

  const handleAddCycle = (cycle: CyclePhase) => {
    const updated = [...cycles, cycle]
    LocalStorage.addCycle(cycle)
    setCycles(updated)
    setShowForm(false)
  }

  const handleUpdateCycle = (id: string, updates: Partial<CyclePhase>) => {
    const updated = LocalStorage.updateCycle(id, updates)
    setCycles(cycles.map(c => c.id === id ? { ...c, ...updates } : c))
    setEditingId(null)
    setShowForm(false)
  }

  const handleDeleteCycle = (id: string) => {
    if (confirm('Delete this cycle?')) {
      const updated = cycles.filter(c => c.id !== id)
      setCycles(updated)
      LocalStorage.getCycles().forEach(c => {
        if (c.id === id) {
          // Remove from storage by filtering
          const all = LocalStorage.getCycles()
          const filtered = all.filter(x => x.id !== id)
          localStorage.setItem('pinplan_cycles', JSON.stringify(filtered))
        }
      })
    }
  }

  const currentCycle = cycles.find(c => {
    const today = new Date().toISOString().split('T')[0]
    return c.startDate <= today && today <= c.endDate
  })

  const cycleTypes = [
    { value: 'bulking', label: 'Bulking 📈', description: 'Surplus calories for muscle gain' },
    { value: 'cutting', label: 'Cutting 📉', description: 'Deficit calories for fat loss' },
    { value: 'maintenance', label: 'Maintenance ⚖️', description: 'Maintain current weight' },
    { value: 'rest', label: 'Rest 😴', description: 'Deload and recovery' },
  ]

  return (
    <main className="min-h-screen bg-dark">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Training Cycles</h1>
            <p className="text-slate-400">Manage your training phases and goals</p>
          </div>
          <button
            onClick={() => {
              setEditingId(null)
              setShowForm(true)
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            New Cycle
          </button>
        </div>

        {/* Current Cycle */}
        {currentCycle && (
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-lg p-6 animate-pulse-glow">
            <div className="flex items-center gap-2 mb-2">
              <Target className="text-primary" />
              <h2 className="text-2xl font-bold">Active Cycle</h2>
            </div>
            <p className="text-lg font-semibold mb-2">{currentCycle.name}</p>
            <p className="text-slate-300 mb-3">{currentCycle.startDate} to {currentCycle.endDate}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Target Calories:</span>
                <p className="text-lg font-semibold">{currentCycle.targetCalories} kcal</p>
              </div>
              <div>
                <span className="text-slate-400">Target Protein:</span>
                <p className="text-lg font-semibold">{currentCycle.targetProtein}g</p>
              </div>
            </div>
          </div>
        )}

        {/* Cycles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cycles.length > 0 ? (
            cycles
              .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
              .map(cycle => {
                const typeInfo = cycleTypes.find(t => t.value === cycle.type)
                return (
                  <div
                    key={cycle.id}
                    className="card relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{cycle.name}</h3>
                        <p className="text-sm text-primary font-medium">{typeInfo?.label}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(cycle.id)
                            setShowForm(true)
                          }}
                          className="text-slate-400 hover:text-primary transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteCycle(cycle.id)}
                          className="text-danger hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <p className="text-slate-400 text-sm mb-4">{typeInfo?.description}</p>

                    <div className="space-y-3 mb-4 border-t border-slate-700 pt-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Start Date:</span>
                        <span className="font-medium">{cycle.startDate}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">End Date:</span>
                        <span className="font-medium">{cycle.endDate}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Target Calories:</span>
                        <span className="font-medium text-primary">{cycle.targetCalories} kcal</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Target Protein:</span>
                        <span className="font-medium text-success">{cycle.targetProtein}g</span>
                      </div>
                    </div>

                    {cycle.notes && (
                      <p className="text-sm text-slate-400 italic">"{cycle.notes}"</p>
                    )}
                  </div>
                )
              })
          ) : (
            <div className="col-span-full text-center py-12 text-slate-500">
              <Target size={48} className="mx-auto mb-4 opacity-50" />
              <p>No training cycles yet. Create your first cycle to get started!</p>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <CycleFormModal
          onClose={() => {
            setShowForm(false)
            setEditingId(null)
          }}
          onSave={editingId ? handleUpdateCycle : handleAddCycle}
          editingCycle={editingId ? cycles.find(c => c.id === editingId) : null}
          cycleTypes={cycleTypes}
        />
      )}
    </main>
  )
}

function CycleFormModal({ onClose, onSave, editingCycle, cycleTypes }: any) {
  const [form, setForm] = useState<Omit<CyclePhase, 'id'>>(
    editingCycle || {
      name: '',
      type: 'maintenance',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      targetCalories: 2500,
      targetProtein: 150,
      notes: '',
    }
  )

  const handleSubmit = () => {
    if (editingCycle) {
      onSave(editingCycle.id, form)
    } else {
      onSave({
        id: generateId(),
        ...form,
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-light border border-slate-700 rounded-lg p-6 max-w-md w-full animate-slide-up">
        <h2 className="text-2xl font-bold mb-6">{editingCycle ? 'Edit Cycle' : 'New Cycle'}</h2>

        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Cycle name (e.g., Summer Bulk)"
            className="input-field w-full"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <select
            className="input-field w-full"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as any })}
          >
            {cycleTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="input-field w-full"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />

          <input
            type="date"
            className="input-field w-full"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />

          <input
            type="number"
            placeholder="Target Calories"
            className="input-field w-full"
            value={form.targetCalories}
            onChange={(e) => setForm({ ...form, targetCalories: parseInt(e.target.value) })}
          />

          <input
            type="number"
            placeholder="Target Protein (g)"
            className="input-field w-full"
            value={form.targetProtein}
            onChange={(e) => setForm({ ...form, targetProtein: parseInt(e.target.value) })}
          />

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
            {editingCycle ? 'Update' : 'Create'} Cycle
          </button>
          <button className="btn-secondary flex-1" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
