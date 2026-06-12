'use client'

import { useState } from 'react'
import { Menu, X, Home, BarChart3, Dumbbell, Target, Settings, Download, Upload } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LocalStorage } from '@/lib/storage'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: '/', icon: Home, label: 'Dashboard' },
    { href: '/metrics', icon: BarChart3, label: 'Metrics' },
    { href: '/training', icon: Dumbbell, label: 'Training' },
    { href: '/cycles', icon: Target, label: 'Cycles' },
    { href: '/goals', icon: Target, label: 'Goals' },
  ]

  const handleExport = () => {
    const data = LocalStorage.exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pinplan-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event: any) => {
        try {
          const data = JSON.parse(event.target.result)
          LocalStorage.importData(data)
          alert('Data imported successfully!')
          window.location.reload()
        } catch (error) {
          alert('Error importing data. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-dark-light/95 backdrop-blur border-b border-slate-700 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center font-bold text-white">
              PP
            </div>
            <span className="font-bold text-xl hidden sm:inline">Pin Plan</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary text-dark font-medium'
                      : 'text-slate-300 hover:bg-dark hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Settings Menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-dark transition-all"
              title="Export data"
            >
              <Download size={18} />
            </button>
            <button
              onClick={handleImport}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-dark transition-all"
              title="Import data"
            >
              <Upload size={18} />
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-dark rounded-lg"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-700 bg-dark-light/95">
            <div className="px-4 py-4 space-y-2">
              {navItems.map(item => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-primary text-dark font-medium'
                        : 'text-slate-300 hover:bg-dark hover:text-white'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <button
                onClick={handleExport}
                className="w-full flex items-center gap-2 px-4 py-3 text-slate-300 hover:bg-dark rounded-lg transition-all"
              >
                <Download size={20} />
                Export Data
              </button>
              <button
                onClick={handleImport}
                className="w-full flex items-center gap-2 px-4 py-3 text-slate-300 hover:bg-dark rounded-lg transition-all"
              >
                <Upload size={20} />
                Import Data
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-16" />
    </>
  )
}
