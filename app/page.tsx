'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { FiVideo, FiPlus, FiTrendingUp, FiCalendar, FiGrid, FiBarChart2, FiSettings, FiShield, FiCreditCard, FiUser, FiMenu, FiX } from 'react-icons/fi'

import DashboardSection from './sections/DashboardSection'
import CreateVideoSection from './sections/CreateVideoSection'
import NichesSection from './sections/NichesSection'
import SchedulerSection from './sections/SchedulerSection'
import LibrarySection from './sections/LibrarySection'
import AnalyticsSection from './sections/AnalyticsSection'
import SettingsSection from './sections/SettingsSection'
import AdminSection from './sections/AdminSection'

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4 text-sm">{this.state.error}</p>
            <button onClick={() => this.setState({ hasError: false, error: '' })} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

const AGENT_IDS = {
  scriptScenePlanner: '69a3270589a7585c80443946',
  trendTopic: '69a327053dad68d04a05e74f',
  captionHashtags: '69a32706931679f19b7d6d2b',
  hookOptimizer: '69a32706e7d556f541c6d6e5',
}

type TabId = 'dashboard' | 'create' | 'niches' | 'scheduler' | 'library' | 'analytics' | 'settings' | 'admin'

const NAV_ITEMS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
  { id: 'create', label: 'Create', icon: FiPlus },
  { id: 'niches', label: 'Niches', icon: FiTrendingUp },
  { id: 'scheduler', label: 'Scheduler', icon: FiCalendar },
  { id: 'library', label: 'Library', icon: FiVideo },
  { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
  { id: 'settings', label: 'Settings', icon: FiSettings },
  { id: 'admin', label: 'Admin', icon: FiShield },
]

const AGENTS_INFO = [
  { id: AGENT_IDS.scriptScenePlanner, name: 'Script & Scene Planner', purpose: 'Generates structured video scripts with scene breakdowns' },
  { id: AGENT_IDS.trendTopic, name: 'Trend & Topic', purpose: 'Researches trending topics and viral patterns' },
  { id: AGENT_IDS.captionHashtags, name: 'Caption & Hashtags', purpose: 'Creates platform-optimized captions and hashtag sets' },
  { id: AGENT_IDS.hookOptimizer, name: 'Hook Optimizer', purpose: 'Analyzes performance and improves hooks' },
]

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [prefillTopic, setPrefillTopic] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigateToTab = (tab: string) => {
    setActiveTab(tab as TabId)
    setMobileMenuOpen(false)
  }

  const navigateToCreate = (topic: string) => {
    setPrefillTopic(topic)
    setActiveTab('create')
  }

  function renderActiveSection() {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardSection onNavigateToTab={navigateToTab} />
      case 'create':
        return <CreateVideoSection onNavigateToTab={navigateToTab} prefillTopic={prefillTopic} />
      case 'niches':
        return <NichesSection onNavigateToCreate={navigateToCreate} />
      case 'scheduler':
        return <SchedulerSection />
      case 'library':
        return <LibrarySection />
      case 'analytics':
        return <AnalyticsSection />
      case 'settings':
        return <SettingsSection />
      case 'admin':
        return <AdminSection isAdmin={isAdmin} />
      default:
        return <DashboardSection onNavigateToTab={navigateToTab} />
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground font-sans">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiVideo className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground tracking-tight">AutoViral</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-foreground">
            {mobileMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm pt-16">
            <div className="p-4 space-y-2">
              {NAV_ITEMS.map(item => (
                <button key={item.id} onClick={() => navigateToTab(item.id)} className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${activeTab === item.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex min-h-screen">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex flex-col w-[220px] bg-card border-r border-border fixed top-0 left-0 h-full z-30">
            <div className="p-5 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                <FiVideo className="h-4 w-4 text-primary" />
              </div>
              <div>
                <span className="font-bold text-foreground text-sm tracking-tight">AutoViral</span>
                <span className="text-[10px] text-muted-foreground block -mt-0.5">Studio</span>
              </div>
            </div>

            <Separator className="bg-border" />

            <ScrollArea className="flex-1 px-3 py-4">
              <nav className="space-y-1">
                {NAV_ITEMS.map(item => (
                  <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-all ${activeTab === item.id ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              <Separator className="bg-border my-4" />

              <div className="px-3 space-y-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">AI Agents</p>
                {AGENTS_INFO.map(agent => (
                  <div key={agent.id} className="space-y-0.5">
                    <p className="text-xs font-medium text-foreground">{agent.name}</p>
                    <p className="text-[10px] text-muted-foreground leading-snug">{agent.purpose}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Admin Mode</span>
                <Switch checked={isAdmin} onCheckedChange={setIsAdmin} />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <FiUser className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">Alex Rivera</p>
                  <p className="text-[10px] text-muted-foreground truncate">alex@autoviral.studio</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 lg:ml-[220px]">
            {/* Desktop Top Bar */}
            <header className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-20">
              <div>
                <h2 className="text-lg font-semibold text-foreground tracking-tight">{NAV_ITEMS.find(n => n.id === activeTab)?.label ?? 'Dashboard'}</h2>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-border text-muted-foreground text-xs">
                  <FiCreditCard className="mr-1.5 h-3 w-3" /> 847 credits
                </Badge>
              </div>
            </header>

            {/* Content */}
            <div className="p-4 lg:p-6 pt-16 lg:pt-6">
              {renderActiveSection()}
            </div>
          </main>
        </div>

        {/* Mobile Bottom Tab Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
          <div className="flex justify-around py-2">
            {NAV_ITEMS.slice(0, 5).map(item => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }} className={`flex flex-col items-center gap-0.5 px-2 py-1 ${activeTab === item.id ? 'text-primary' : 'text-muted-foreground'}`}>
                <item.icon className="h-4 w-4" />
                <span className="text-[9px]">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
