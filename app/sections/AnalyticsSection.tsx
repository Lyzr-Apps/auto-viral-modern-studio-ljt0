'use client'

import React, { useState } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { FiBarChart2, FiTrendingUp, FiEye, FiClock, FiZap, FiTarget, FiArrowRight, FiArrowUp, FiArrowDown, FiRefreshCw, FiLayers, FiEdit3, FiHash, FiVideo } from 'react-icons/fi'

const AGENT_ID = '69a32706e7d556f541c6d6e5'

interface HookImprovement {
  original_hook?: string
  improved_hook?: string
  reasoning?: string
}

interface ABTest {
  hook_a?: string
  hook_b?: string
  test_rationale?: string
}

interface NextVideoSuggestion {
  topic?: string
  hook?: string
  rationale?: string
}

interface OptimizerData {
  performance_summary?: string
  improved_hooks?: HookImprovement[]
  ab_test_suggestions?: ABTest[]
  posting_recommendations?: string
  content_strategy?: string
  next_video_suggestions?: NextVideoSuggestion[]
}

function renderMarkdown(text: string) {
  if (!text) return null
  return (
    <div className="space-y-2">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('### ')) return <h4 key={i} className="font-semibold text-sm mt-3 mb-1">{line.slice(4)}</h4>
        if (line.startsWith('## ')) return <h3 key={i} className="font-semibold text-base mt-3 mb-1">{line.slice(3)}</h3>
        if (line.startsWith('# ')) return <h2 key={i} className="font-bold text-lg mt-4 mb-2">{line.slice(2)}</h2>
        if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 list-disc text-sm">{formatInline(line.slice(2))}</li>
        if (/^\d+\.\s/.test(line)) return <li key={i} className="ml-4 list-decimal text-sm">{formatInline(line.replace(/^\d+\.\s/, ''))}</li>
        if (!line.trim()) return <div key={i} className="h-1" />
        return <p key={i} className="text-sm">{formatInline(line)}</p>
      })}
    </div>
  )
}

function formatInline(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  if (parts.length === 1) return text
  return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part)
}

const MOCK_CHART_BARS = [
  { label: 'Mon', value: 65, views: '12.4K' },
  { label: 'Tue', value: 42, views: '8.1K' },
  { label: 'Wed', value: 78, views: '18.9K' },
  { label: 'Thu', value: 55, views: '10.5K' },
  { label: 'Fri', value: 90, views: '24.3K' },
  { label: 'Sat', value: 72, views: '16.2K' },
  { label: 'Sun', value: 48, views: '9.7K' },
]

const MOCK_NICHE_BARS = [
  { label: 'AI/Tech', value: 85, color: 'from-primary/60 to-primary', textColor: 'text-primary', icon: FiZap },
  { label: 'Motivation', value: 72, color: 'from-accent/60 to-accent', textColor: 'text-accent', icon: FiTrendingUp },
  { label: 'Fitness', value: 65, color: 'from-[hsl(191,97%,70%)]/60 to-[hsl(191,97%,70%)]', textColor: 'text-[hsl(191,97%,70%)]', icon: FiTarget },
  { label: 'Crypto', value: 45, color: 'from-[hsl(326,100%,68%)]/60 to-[hsl(326,100%,68%)]', textColor: 'text-[hsl(326,100%,68%)]', icon: FiBarChart2 },
  { label: 'Business', value: 58, color: 'from-[hsl(31,100%,65%)]/60 to-[hsl(31,100%,65%)]', textColor: 'text-[hsl(31,100%,65%)]', icon: FiLayers },
]

const MOCK_POSTING_TIMES = [
  { hour: '6AM', values: [15, 20, 10, 12, 18, 35, 22] },
  { hour: '9AM', values: [40, 55, 48, 42, 52, 30, 25] },
  { hour: '12PM', values: [55, 62, 70, 58, 65, 42, 38] },
  { hour: '3PM', values: [65, 58, 72, 60, 68, 55, 48] },
  { hour: '6PM', values: [90, 82, 85, 78, 95, 70, 62] },
  { hour: '9PM', values: [72, 68, 75, 70, 78, 85, 78] },
]

const DAYS_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function heatColor(value: number): string {
  if (value >= 85) return 'bg-primary glow-primary'
  if (value >= 70) return 'bg-primary/70'
  if (value >= 55) return 'bg-primary/45'
  if (value >= 40) return 'bg-primary/25'
  return 'bg-primary/10'
}

type TabKey = 'hooks' | 'ab' | 'strategy' | 'next'

interface AnalyticsSectionProps {
  onNavigateToCreate?: (topic: string) => void
}

export default function AnalyticsSection({ onNavigateToCreate }: AnalyticsSectionProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<OptimizerData | null>(null)
  const [activeResultTab, setActiveResultTab] = useState<TabKey>('hooks')

  const metrics = [
    { label: 'Total Views', value: '245.8K', change: '+18.2%', up: true, icon: FiEye, color: 'text-primary', bg: 'bg-gradient-primary' },
    { label: 'Avg Completion', value: '72%', change: '+5.3%', up: true, icon: FiBarChart2, color: 'text-accent', bg: 'bg-gradient-accent' },
    { label: 'Best Niche', value: 'AI/Tech', change: '#1 performer', up: true, icon: FiTarget, color: 'text-[hsl(191,97%,70%)]', bg: 'bg-[hsl(191,97%,70%)]/10' },
    { label: 'Best Post Time', value: '6:00 PM', change: '95% engagement', up: true, icon: FiClock, color: 'text-[hsl(326,100%,68%)]', bg: 'bg-[hsl(326,100%,68%)]/10' },
  ]

  const handleAnalyze = async () => {
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const message = `Analyze the following video performance data and provide optimization recommendations:\n\nVideo 1: "5 AI Tools You Need" - Niche: AI/Tech - Views: 45.2K - Completion Rate: 78% - Likes: 3.2K - Hook: "Stop scrolling, this will change everything"\nVideo 2: "Morning Routine for Success" - Niche: Motivation - Views: 23.1K - Completion Rate: 65% - Likes: 1.8K - Hook: "Most people waste their mornings"\nVideo 3: "Crypto Market Update" - Niche: Crypto - Views: 12.5K - Completion Rate: 45% - Likes: 890 - Hook: "Bitcoin just did something crazy"\n\nProvide improved hooks, A/B test suggestions, posting time recommendations, and content strategy insights.`
      const result = await callAIAgent(message, AGENT_ID)
      if (result.success && result?.response?.result) {
        setData(result.response.result as OptimizerData)
        setActiveResultTab('hooks')
      } else {
        setError(result?.error ?? 'Failed to analyze. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const improvedHooks = Array.isArray(data?.improved_hooks) ? data.improved_hooks : []
  const abTests = Array.isArray(data?.ab_test_suggestions) ? data.ab_test_suggestions : []
  const nextSuggestions = Array.isArray(data?.next_video_suggestions) ? data.next_video_suggestions : []

  const resultTabs: { key: TabKey; label: string; icon: React.ElementType; count?: number }[] = [
    { key: 'hooks', label: 'Hooks', icon: FiEdit3, count: improvedHooks.length },
    { key: 'ab', label: 'A/B Tests', icon: FiLayers, count: abTests.length },
    { key: 'strategy', label: 'Strategy', icon: FiTrendingUp },
    { key: 'next', label: 'Next Videos', icon: FiVideo, count: nextSuggestions.length },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Track performance and optimize your content strategy.</p>
        </div>
        <Button onClick={handleAnalyze} disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          {loading ? (
            <>
              <div className="relative">
                <div className="h-4 w-4 border-2 border-primary-foreground/30 rounded-full" />
                <div className="absolute inset-0 h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              </div>
              Analyzing...
            </>
          ) : (
            <><FiZap className="h-4 w-4" /> Analyze & Optimize</>
          )}
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {metrics.map(m => (
          <Card key={m.label} className="bg-card border-border card-elevated overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${m.bg} flex items-center justify-center`}>
                  <m.icon className={`h-4 w-4 ${m.color}`} />
                </div>
                <Badge variant="outline" className={`text-[10px] border-0 gap-0.5 ${m.up ? 'bg-accent/10 text-accent' : 'bg-destructive/10 text-destructive'}`}>
                  {m.up ? <FiArrowUp className="h-2.5 w-2.5" /> : <FiArrowDown className="h-2.5 w-2.5" />}
                  {m.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums">{m.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Views Chart - 2 col */}
        <Card className="bg-card border-border card-elevated lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <FiBarChart2 className="h-4 w-4 text-primary" /> Views This Week
              </CardTitle>
              <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">Last 7 days</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-[180px]">
              {MOCK_CHART_BARS.map((bar, idx) => (
                <div key={bar.label} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity font-medium">{bar.views}</span>
                  <div className="w-full relative">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-primary/40 to-primary transition-all duration-700 ease-out group-hover:from-primary/60 group-hover:to-primary"
                      style={{ height: `${bar.value * 1.6}px`, animationDelay: `${idx * 0.1}s` }}
                    />
                    {bar.value === Math.max(...MOCK_CHART_BARS.map(b => b.value)) && (
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary glow-primary" />
                    )}
                  </div>
                  <span className={`text-[10px] font-medium ${bar.value === Math.max(...MOCK_CHART_BARS.map(b => b.value)) ? 'text-primary' : 'text-muted-foreground'}`}>{bar.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Posting Heatmap */}
        <Card className="bg-card border-border card-elevated">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <FiClock className="h-4 w-4 text-[hsl(326,100%,68%)]" /> Best Times
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              <div className="flex gap-1.5 pl-10">
                {DAYS_SHORT.map((d, i) => (
                  <div key={i} className="flex-1 text-center text-[9px] text-muted-foreground font-medium">{d}</div>
                ))}
              </div>
              {MOCK_POSTING_TIMES.map((row) => (
                <div key={row.hour} className="flex items-center gap-1.5">
                  <span className="text-[9px] text-muted-foreground w-8 text-right flex-shrink-0">{row.hour}</span>
                  <div className="flex-1 flex gap-1.5">
                    {row.values.map((v, i) => (
                      <div key={i} className={`flex-1 aspect-square rounded-md ${heatColor(v)} transition-all hover:scale-110`} title={`${v}% engagement`} />
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-end gap-2 pt-2">
                <span className="text-[9px] text-muted-foreground">Low</span>
                <div className="flex gap-0.5">
                  {['bg-primary/10', 'bg-primary/25', 'bg-primary/45', 'bg-primary/70', 'bg-primary'].map((c, i) => (
                    <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
                  ))}
                </div>
                <span className="text-[9px] text-muted-foreground">High</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Niche Performance */}
      <Card className="bg-card border-border card-elevated">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <FiTarget className="h-4 w-4 text-[hsl(191,97%,70%)]" /> Niche Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_NICHE_BARS.map((bar, idx) => (
              <div key={bar.label} className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-28 flex-shrink-0">
                  <bar.icon className={`h-3.5 w-3.5 ${bar.textColor}`} />
                  <span className="text-sm text-foreground font-medium">{bar.label}</span>
                </div>
                <div className="flex-1 relative">
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${bar.color} rounded-full h-3 transition-all duration-1000 ease-out`}
                      style={{ width: `${bar.value}%`, animationDelay: `${idx * 0.15}s` }}
                    />
                  </div>
                </div>
                <span className={`text-sm font-bold tabular-nums w-10 text-right ${bar.textColor}`}>{bar.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="relative">
            <div className="h-12 w-12 border-3 border-primary/30 rounded-full" />
            <div className="absolute inset-0 h-12 w-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Analyzing your content performance</p>
            <p className="text-xs text-muted-foreground mt-1">Running hook optimization & A/B test generation...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <Card className="bg-destructive/5 border-destructive/20">
          <CardContent className="p-4 flex items-center justify-between">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="ghost" size="sm" onClick={handleAnalyze} className="text-destructive hover:text-destructive/80 gap-1">
              <FiRefreshCw className="h-3 w-3" /> Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* AI Results */}
      {data && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Performance Summary */}
          {data.performance_summary && (
            <Card className="bg-card border-border card-elevated border-l-4 border-l-primary">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FiZap className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">AI Performance Summary</h3>
                </div>
                <div className="text-foreground">{renderMarkdown(data.performance_summary)}</div>
              </CardContent>
            </Card>
          )}

          {/* Tabbed Results */}
          <div className="flex gap-1 p-1 bg-muted/30 rounded-xl">
            {resultTabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveResultTab(tab.key)} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-medium transition-all ${activeResultTab === tab.key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                <tab.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
                {(tab.count ?? 0) > 0 && (
                  <Badge className={`h-4 min-w-[16px] text-[9px] px-1 border-0 ${activeResultTab === tab.key ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>{tab.count}</Badge>
                )}
              </button>
            ))}
          </div>

          {/* Hooks Tab */}
          {activeResultTab === 'hooks' && improvedHooks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
              {improvedHooks.map((hook, idx) => (
                <Card key={idx} className="bg-card border-border card-interactive overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 bg-muted/20 border-b border-border">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Original</p>
                      <p className="text-sm text-muted-foreground italic leading-relaxed">&quot;{hook?.original_hook ?? ''}&quot;</p>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-accent mb-1.5">Improved</p>
                        <p className="text-sm text-foreground font-medium leading-relaxed">&quot;{hook?.improved_hook ?? ''}&quot;</p>
                      </div>
                      <Separator className="bg-border" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Why this works</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{hook?.reasoning ?? ''}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* A/B Tab */}
          {activeResultTab === 'ab' && abTests.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
              {abTests.map((test, idx) => (
                <Card key={idx} className="bg-card border-border card-interactive">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/15 text-primary text-[10px] border-0">Test {idx + 1}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                        <Badge className="bg-primary/20 text-primary text-[9px] border-0 mb-2">Hook A</Badge>
                        <p className="text-xs text-foreground leading-relaxed">&quot;{test?.hook_a ?? ''}&quot;</p>
                      </div>
                      <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                        <Badge className="bg-accent/20 text-accent text-[9px] border-0 mb-2">Hook B</Badge>
                        <p className="text-xs text-foreground leading-relaxed">&quot;{test?.hook_b ?? ''}&quot;</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{test?.test_rationale ?? ''}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Strategy Tab */}
          {activeResultTab === 'strategy' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.posting_recommendations && (
                <Card className="bg-card border-border card-elevated">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <FiClock className="h-4 w-4 text-[hsl(326,100%,68%)]" /> Posting Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-foreground">{renderMarkdown(data.posting_recommendations)}</CardContent>
                </Card>
              )}
              {data.content_strategy && (
                <Card className="bg-card border-border card-elevated">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <FiTrendingUp className="h-4 w-4 text-accent" /> Content Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-foreground">{renderMarkdown(data.content_strategy)}</CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Next Videos Tab */}
          {activeResultTab === 'next' && nextSuggestions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
              {nextSuggestions.map((s, idx) => (
                <Card key={idx} className="bg-card border-border card-interactive group">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FiVideo className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{s?.topic ?? ''}</p>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10">
                      <p className="text-[10px] uppercase tracking-wider text-primary mb-1">Suggested Hook</p>
                      <p className="text-xs text-foreground italic">&quot;{s?.hook ?? ''}&quot;</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s?.rationale ?? ''}</p>
                    <Button size="sm" onClick={() => onNavigateToCreate?.(s?.topic ?? '')} className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-xs h-8 transition-all gap-1 group-hover:bg-primary group-hover:text-primary-foreground">
                      Create This Video <FiArrowRight className="h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
