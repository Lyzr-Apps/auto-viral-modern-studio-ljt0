'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { FiVideo, FiPlus, FiTrendingUp, FiCalendar, FiGrid, FiBarChart2, FiSettings, FiShield, FiCreditCard, FiUser, FiMenu, FiX, FiZap, FiBell, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

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
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <FiZap className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4 text-sm">{this.state.error}</p>
            <button onClick={() => this.setState({ hasError: false, error: '' })} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
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

const NAV_ITEMS: { id: TabId; label: string; icon: React.ElementType; section?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: FiGrid, section: 'Main' },
  { id: 'create', label: 'Create', icon: FiPlus, section: 'Main' },
  { id: 'niches', label: 'Niches', icon: FiTrendingUp, section: 'Main' },
  { id: 'scheduler', label: 'Scheduler', icon: FiCalendar, section: 'Manage' },
  { id: 'library', label: 'Library', icon: FiVideo, section: 'Manage' },
  { id: 'analytics', label: 'Analytics', icon: FiBarChart2, section: 'Manage' },
  { id: 'settings', label: 'Settings', icon: FiSettings, section: 'System' },
  { id: 'admin', label: 'Admin', icon: FiShield, section: 'System' },
]

const AGENTS_INFO = [
  { id: AGENT_IDS.scriptScenePlanner, name: 'Script & Scene', color: 'bg-primary' },
  { id: AGENT_IDS.trendTopic, name: 'Trend & Topic', color: 'bg-[hsl(191,97%,70%)]' },
  { id: AGENT_IDS.captionHashtags, name: 'Caption & Tags', color: 'bg-accent' },
  { id: AGENT_IDS.hookOptimizer, name: 'Hook Optimizer', color: 'bg-[hsl(326,100%,68%)]' },
]

const NOTIFICATIONS = [
  { id: 1, text: 'AI/Tech video hit 45K views', time: '2h ago', type: 'success' },
  { id: 2, text: 'Scheduled post ready for review', time: '4h ago', type: 'info' },
  { id: 3, text: 'New trending topic in Crypto', time: '6h ago', type: 'trend' },
]

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [prefillTopic, setPrefillTopic] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

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

  const sidebarWidth = sidebarCollapsed ? 'w-[68px]' : 'w-[240px]'
  const mainMargin = sidebarCollapsed ? 'lg:ml-[68px]' : 'lg:ml-[240px]'

  const sections = Array.from(new Set(NAV_ITEMS.map(n => n.section)))

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground font-sans">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <FiVideo className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-foreground text-sm tracking-tight">AutoViral</span>
              <span className="text-[9px] text-primary block -mt-0.5 font-medium">STUDIO</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <FiBell className="h-4.5 w-4.5" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive animate-live-pulse" />
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-foreground">
              {mobileMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-background/98 backdrop-blur-sm pt-16 animate-fade-in-up">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-1">
                {NAV_ITEMS.map(item => (
                  <button key={item.id} onClick={() => navigateToTab(item.id)} className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all ${activeTab === item.id ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent'}`}>
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                    {activeTab === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                  </button>
                ))}
                <Separator className="bg-border my-3" />
                <div className="flex items-center justify-between p-3">
                  <span className="text-xs text-muted-foreground">Admin Mode</span>
                  <Switch checked={isAdmin} onCheckedChange={setIsAdmin} />
                </div>
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Notification Panel */}
        {showNotifications && (
          <div className="fixed top-14 lg:top-16 right-4 z-50 w-80 bg-card border border-border rounded-xl shadow-xl animate-fade-in-up">
            <div className="p-3 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
              <Badge className="bg-destructive/15 text-destructive text-[10px] border-0">{NOTIFICATIONS.length} new</Badge>
            </div>
            <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
              {NOTIFICATIONS.map(n => (
                <div key={n.id} className="p-2.5 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                  <p className="text-xs text-foreground">{n.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-border">
              <button onClick={() => setShowNotifications(false)} className="w-full text-center text-xs text-primary py-1.5 hover:bg-primary/5 rounded-lg transition-colors">
                Close
              </button>
            </div>
          </div>
        )}

        <div className="flex min-h-screen">
          {/* Desktop Sidebar */}
          <aside className={`hidden lg:flex flex-col ${sidebarWidth} bg-card border-r border-border fixed top-0 left-0 h-full z-30 transition-all duration-300`}>
            {/* Logo */}
            <div className={`p-4 flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
                <FiVideo className="h-4.5 w-4.5 text-primary-foreground" />
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <span className="font-bold text-foreground text-sm tracking-tight block">AutoViral</span>
                  <span className="text-[9px] text-primary font-semibold tracking-widest block -mt-0.5">STUDIO</span>
                </div>
              )}
            </div>

            <Separator className="bg-border" />

            {/* Navigation */}
            <ScrollArea className="flex-1 px-2.5 py-3">
              <nav className="space-y-0.5">
                {sections.map(section => (
                  <React.Fragment key={section}>
                    {!sidebarCollapsed && (
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground/60 px-3 pt-4 pb-1.5 font-semibold">{section}</p>
                    )}
                    {NAV_ITEMS.filter(n => n.section === section).map(item => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        title={sidebarCollapsed ? item.label : undefined}
                        className={`w-full flex items-center gap-3 ${sidebarCollapsed ? 'justify-center px-2' : 'px-3'} py-2.5 rounded-xl text-left text-sm transition-all group relative ${
                          activeTab === item.id
                            ? 'bg-primary text-primary-foreground font-medium glow-primary'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                        }`}
                      >
                        <item.icon className={`h-4 w-4 flex-shrink-0 ${activeTab === item.id ? '' : 'group-hover:scale-110 transition-transform'}`} />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                        {activeTab === item.id && !sidebarCollapsed && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground/60" />
                        )}
                      </button>
                    ))}
                  </React.Fragment>
                ))}
              </nav>

              {!sidebarCollapsed && (
                <>
                  <Separator className="bg-border my-4" />
                  <div className="px-3 space-y-2.5">
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground/60 font-semibold">AI Agents</p>
                    {AGENTS_INFO.map(agent => (
                      <div key={agent.id} className="flex items-center gap-2.5 py-1">
                        <div className={`w-2 h-2 rounded-full ${agent.color} flex-shrink-0`} />
                        <span className="text-[11px] text-muted-foreground truncate">{agent.name}</span>
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent/60 animate-live-pulse flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </ScrollArea>

            {/* Sidebar Footer */}
            <div className={`border-t border-border ${sidebarCollapsed ? 'p-2' : 'p-3'} space-y-3`}>
              {/* Collapse Toggle */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-full flex items-center justify-center p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              >
                {sidebarCollapsed ? <FiChevronRight className="h-4 w-4" /> : <FiChevronLeft className="h-4 w-4" />}
              </button>

              {!sidebarCollapsed && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">Admin Mode</span>
                    <Switch checked={isAdmin} onCheckedChange={setIsAdmin} />
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">A</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">Alex Rivera</p>
                      <p className="text-[10px] text-muted-foreground truncate">Pro Plan</p>
                    </div>
                  </div>
                </>
              )}

              {sidebarCollapsed && (
                <div className="flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-xs font-bold text-white">A</span>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content Area */}
          <main className={`flex-1 ${mainMargin} transition-all duration-300`}>
            {/* Desktop Top Bar */}
            <header className="hidden lg:flex items-center justify-between px-6 py-3.5 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground tracking-tight">{NAV_ITEMS.find(n => n.id === activeTab)?.label ?? 'Dashboard'}</h2>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-border text-muted-foreground text-xs gap-1.5 px-3 py-1">
                  <FiCreditCard className="h-3 w-3" /> 847 credits
                </Badge>
                <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                  <FiBell className="h-4 w-4" />
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive animate-live-pulse" />
                </button>
              </div>
            </header>

            {/* Content */}
            <div className="p-4 lg:p-6 pt-16 lg:pt-6 pb-20 lg:pb-6">
              {renderActiveSection()}
            </div>
          </main>
        </div>

        {/* Mobile Bottom Tab Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border">
          <div className="flex justify-around py-1.5">
            {NAV_ITEMS.slice(0, 5).map(item => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }} className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all ${activeTab === item.id ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`p-1 rounded-lg ${activeTab === item.id ? 'bg-primary/15' : ''}`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <span className={`text-[9px] ${activeTab === item.id ? 'font-semibold' : ''}`}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Click outside to close notifications */}
        {showNotifications && (
          <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
        )}
      </div>
    </ErrorBoundary>
  )
}
