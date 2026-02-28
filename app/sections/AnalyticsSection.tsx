'use client'

import React, { useState } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FiBarChart2, FiTrendingUp, FiEye, FiClock, FiZap, FiTarget, FiArrowRight } from 'react-icons/fi'

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
  { label: 'Mon', value: 65 },
  { label: 'Tue', value: 42 },
  { label: 'Wed', value: 78 },
  { label: 'Thu', value: 55 },
  { label: 'Fri', value: 90 },
  { label: 'Sat', value: 72 },
  { label: 'Sun', value: 48 },
]

const MOCK_NICHE_BARS = [
  { label: 'AI/Tech', value: 85, color: 'bg-primary' },
  { label: 'Motivation', value: 72, color: 'bg-accent' },
  { label: 'Fitness', value: 65, color: 'bg-[hsl(191,97%,70%)]' },
  { label: 'Crypto', value: 45, color: 'bg-[hsl(326,100%,68%)]' },
  { label: 'Business', value: 58, color: 'bg-[hsl(31,100%,65%)]' },
]

export default function AnalyticsSection() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<OptimizerData | null>(null)

  const metrics = [
    { label: 'Total Views', value: '245.8K', icon: FiEye, color: 'text-primary' },
    { label: 'Avg Completion', value: '72%', icon: FiBarChart2, color: 'text-accent' },
    { label: 'Best Niche', value: 'AI/Tech', icon: FiTarget, color: 'text-[hsl(191,97%,70%)]' },
    { label: 'Best Post Time', value: '6:00 PM', icon: FiClock, color: 'text-[hsl(326,100%,68%)]' },
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
      } else {
        setError(result?.error ?? 'Failed to analyze. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const improvedHooks = Array.isArray(data?.improved_hooks) ? data.improved_hooks : []
  const abTests = Array.isArray(data?.ab_test_suggestions) ? data.ab_test_suggestions : []
  const nextSuggestions = Array.isArray(data?.next_video_suggestions) ? data.next_video_suggestions : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Track performance and optimize your content strategy.</p>
        </div>
        <Button onClick={handleAnalyze} disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {loading ? <><div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" /> Analyzing...</> : <><FiZap className="mr-2 h-4 w-4" /> Analyze & Optimize</>}
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(m => (
          <Card key={m.label} className="bg-card border-border card-elevated">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{m.label}</span>
                <m.icon className={`h-5 w-5 ${m.color}`} />
              </div>
              <p className="text-2xl font-bold tracking-tight text-foreground">{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border card-elevated">
          <CardHeader><CardTitle className="text-base font-semibold text-foreground">Views Over Time</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-[160px]">
              {MOCK_CHART_BARS.map(bar => (
                <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-primary/60 to-primary transition-all" style={{ height: `${bar.value}%` }} />
                  <span className="text-[10px] text-muted-foreground">{bar.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border card-elevated">
          <CardHeader><CardTitle className="text-base font-semibold text-foreground">Niche Performance</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {MOCK_NICHE_BARS.map(bar => (
              <div key={bar.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-foreground">{bar.label}</span>
                  <span className="text-muted-foreground">{bar.value}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className={`${bar.color} rounded-full h-2 transition-all`} style={{ width: `${bar.value}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {error && (
        <Card className="bg-destructive/10 border-destructive/30">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="ghost" size="sm" onClick={handleAnalyze} className="mt-2 text-destructive hover:text-destructive/80">Retry</Button>
          </CardContent>
        </Card>
      )}

      {data && (
        <div className="space-y-6">
          {data.performance_summary && (
            <Card className="bg-card border-border card-elevated">
              <CardHeader><CardTitle className="text-base font-semibold text-foreground">Performance Summary</CardTitle></CardHeader>
              <CardContent className="text-foreground">{renderMarkdown(data.performance_summary)}</CardContent>
            </Card>
          )}

          {improvedHooks.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">Improved Hook Variations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {improvedHooks.map((hook, idx) => (
                  <Card key={idx} className="bg-card border-border card-elevated">
                    <CardContent className="p-5 space-y-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Original</p>
                        <p className="text-sm text-muted-foreground italic">&quot;{hook?.original_hook ?? ''}&quot;</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-accent mb-1">Improved</p>
                        <p className="text-sm text-foreground font-medium">&quot;{hook?.improved_hook ?? ''}&quot;</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Reasoning</p>
                        <p className="text-xs text-muted-foreground">{hook?.reasoning ?? ''}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {abTests.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">A/B Test Suggestions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {abTests.map((test, idx) => (
                  <Card key={idx} className="bg-card border-border card-elevated">
                    <CardContent className="p-5 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-primary/10">
                          <p className="text-[10px] uppercase tracking-wider text-primary mb-1">Hook A</p>
                          <p className="text-xs text-foreground">&quot;{test?.hook_a ?? ''}&quot;</p>
                        </div>
                        <div className="p-3 rounded-xl bg-accent/10">
                          <p className="text-[10px] uppercase tracking-wider text-accent mb-1">Hook B</p>
                          <p className="text-xs text-foreground">&quot;{test?.hook_b ?? ''}&quot;</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{test?.test_rationale ?? ''}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {(data.posting_recommendations || data.content_strategy) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.posting_recommendations && (
                <Card className="bg-card border-border card-elevated">
                  <CardHeader><CardTitle className="text-base font-semibold text-foreground">Posting Recommendations</CardTitle></CardHeader>
                  <CardContent className="text-foreground">{renderMarkdown(data.posting_recommendations)}</CardContent>
                </Card>
              )}
              {data.content_strategy && (
                <Card className="bg-card border-border card-elevated">
                  <CardHeader><CardTitle className="text-base font-semibold text-foreground">Content Strategy</CardTitle></CardHeader>
                  <CardContent className="text-foreground">{renderMarkdown(data.content_strategy)}</CardContent>
                </Card>
              )}
            </div>
          )}

          {nextSuggestions.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">Next Video Suggestions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {nextSuggestions.map((s, idx) => (
                  <Card key={idx} className="bg-card border-border card-elevated">
                    <CardContent className="p-5 space-y-2">
                      <p className="text-sm font-semibold text-foreground">{s?.topic ?? ''}</p>
                      <p className="text-xs text-primary italic">&quot;{s?.hook ?? ''}&quot;</p>
                      <p className="text-xs text-muted-foreground">{s?.rationale ?? ''}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
