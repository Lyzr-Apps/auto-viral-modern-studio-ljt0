'use client'

import React, { useState } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { FiTrendingUp, FiZap, FiArrowRight, FiCpu, FiHeart, FiDollarSign, FiStar, FiGlobe, FiBookOpen, FiMusic, FiSmile, FiTarget, FiSun, FiActivity, FiSearch, FiRefreshCw } from 'react-icons/fi'

const AGENT_ID = '69a327053dad68d04a05e74f'

interface NichesSectionProps {
  onNavigateToCreate: (topic: string) => void
}

interface TopicItem {
  title?: string
  trend_velocity?: string
  rationale?: string
  content_angle?: string
  interest_level?: number
}

const NICHES = [
  { name: 'Motivation', icon: FiZap, color: 'text-[hsl(31,100%,65%)]', bg: 'bg-[hsl(31,100%,65%)]/10' },
  { name: 'Gym/Fitness', icon: FiActivity, color: 'text-accent', bg: 'bg-accent/10' },
  { name: 'Business', icon: FiDollarSign, color: 'text-[hsl(135,94%,60%)]', bg: 'bg-[hsl(135,94%,60%)]/10' },
  { name: 'AI/Tech', icon: FiCpu, color: 'text-primary', bg: 'bg-primary/10' },
  { name: 'Crypto', icon: FiTarget, color: 'text-[hsl(191,97%,70%)]', bg: 'bg-[hsl(191,97%,70%)]/10' },
  { name: 'Health', icon: FiHeart, color: 'text-[hsl(326,100%,68%)]', bg: 'bg-[hsl(326,100%,68%)]/10' },
  { name: 'Travel', icon: FiGlobe, color: 'text-[hsl(191,97%,70%)]', bg: 'bg-[hsl(191,97%,70%)]/10' },
  { name: 'Food', icon: FiSun, color: 'text-[hsl(31,100%,65%)]', bg: 'bg-[hsl(31,100%,65%)]/10' },
  { name: 'Fashion', icon: FiStar, color: 'text-[hsl(326,100%,68%)]', bg: 'bg-[hsl(326,100%,68%)]/10' },
  { name: 'Comedy', icon: FiSmile, color: 'text-[hsl(31,100%,65%)]', bg: 'bg-[hsl(31,100%,65%)]/10' },
  { name: 'Education', icon: FiBookOpen, color: 'text-primary', bg: 'bg-primary/10' },
  { name: 'Music', icon: FiMusic, color: 'text-accent', bg: 'bg-accent/10' },
  { name: 'Gaming', icon: FiTarget, color: 'text-[hsl(191,97%,70%)]', bg: 'bg-[hsl(191,97%,70%)]/10' },
  { name: 'Lifestyle', icon: FiHeart, color: 'text-[hsl(326,100%,68%)]', bg: 'bg-[hsl(326,100%,68%)]/10' },
]

function velocityBadge(velocity: string) {
  const v = (velocity ?? '').toLowerCase()
  if (v.includes('hot') || v.includes('viral') || v.includes('exploding'))
    return { className: 'bg-destructive/15 text-destructive border-destructive/30', icon: FiZap }
  if (v.includes('rising') || v.includes('growing'))
    return { className: 'bg-[hsl(31,100%,65%)]/15 text-[hsl(31,100%,65%)] border-[hsl(31,100%,65%)]/30', icon: FiTrendingUp }
  return { className: 'bg-[hsl(191,97%,70%)]/15 text-[hsl(191,97%,70%)] border-[hsl(191,97%,70%)]/30', icon: FiTrendingUp }
}

function InterestBar({ level }: { level: number }) {
  const pct = Math.min(10, Math.max(0, level ?? 0)) * 10
  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] mb-1">
        <span className="text-muted-foreground">Interest</span>
        <span className="text-foreground font-medium">{level}/10</span>
      </div>
      <div className="w-full bg-muted rounded-full h-1.5">
        <div className="bg-primary rounded-full h-1.5 transition-all duration-700 ease-out" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function NichesSection({ onNavigateToCreate }: NichesSectionProps) {
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [topics, setTopics] = useState<TopicItem[]>([])
  const [nicheLabel, setNicheLabel] = useState('')
  const [search, setSearch] = useState('')

  const filteredNiches = NICHES.filter(n => !search || n.name.toLowerCase().includes(search.toLowerCase()))

  const handleSuggestTopics = async () => {
    if (!selectedNiche) return
    setLoading(true)
    setError(null)
    setTopics([])
    try {
      const message = `Research current trending topics in the ${selectedNiche} niche for short-form vertical video content. Provide 5 trending topic suggestions.`
      const result = await callAIAgent(message, AGENT_ID)
      if (result.success && result?.response?.result) {
        const data = result.response.result
        setTopics(Array.isArray(data?.topics) ? data.topics : [])
        setNicheLabel(data?.niche ?? selectedNiche)
      } else {
        setError(result?.error ?? 'Failed to fetch topics. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Niches & Trends</h1>
          <p className="text-sm text-muted-foreground mt-1">Select a niche to discover trending topics for your next video.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Filter niches..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-input border-border text-foreground pl-9 h-9" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 stagger-children">
        {filteredNiches.map(niche => (
          <button
            key={niche.name}
            onClick={() => { setSelectedNiche(niche.name); setTopics([]); setError(null); }}
            className={`relative flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all group ${
              selectedNiche === niche.name
                ? 'border-primary bg-primary/10 glow-border'
                : 'border-border bg-card hover:border-primary/30 card-interactive'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl ${selectedNiche === niche.name ? 'bg-primary/20' : niche.bg} flex items-center justify-center transition-colors group-hover:scale-110 duration-200`}>
              <niche.icon className={`h-5 w-5 ${selectedNiche === niche.name ? 'text-primary' : niche.color} transition-colors`} />
            </div>
            <span className={`text-xs font-medium ${selectedNiche === niche.name ? 'text-primary' : 'text-foreground'}`}>{niche.name}</span>
            {selectedNiche === niche.name && (
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary animate-live-pulse" />
            )}
          </button>
        ))}
      </div>

      {selectedNiche && topics.length === 0 && !loading && (
        <div className="flex justify-center py-4">
          <Button onClick={handleSuggestTopics} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 gap-2 h-11">
            <FiTrendingUp className="h-4 w-4" /> Suggest Topics for {selectedNiche}
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="relative">
            <div className="h-12 w-12 border-3 border-primary/30 rounded-full" />
            <div className="absolute inset-0 h-12 w-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Analyzing trends for {selectedNiche}</p>
            <p className="text-xs text-muted-foreground mt-1">Searching real-time data with Perplexity AI...</p>
          </div>
        </div>
      )}

      {error && (
        <Card className="bg-destructive/5 border-destructive/20">
          <CardContent className="p-4 flex items-center justify-between">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="ghost" size="sm" onClick={handleSuggestTopics} className="text-destructive hover:text-destructive/80 gap-1">
              <FiRefreshCw className="h-3 w-3" /> Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {topics.length > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="flex items-center gap-2">
            <FiTrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Trending in {nicheLabel}</h2>
            <Badge variant="outline" className="border-border text-muted-foreground text-[10px]">{topics.length} results</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
            {topics.map((topic, idx) => {
              const badge = velocityBadge(topic?.trend_velocity ?? '')
              return (
                <Card key={idx} className="bg-card border-border card-interactive group overflow-hidden">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground/60">#{idx + 1}</span>
                        <h3 className="text-sm font-semibold text-foreground leading-snug">{topic?.title ?? 'Untitled Topic'}</h3>
                      </div>
                      <Badge className={`${badge.className} text-[10px] border flex-shrink-0 gap-1`}>
                        <badge.icon className="h-2.5 w-2.5" />
                        {topic?.trend_velocity ?? 'Steady'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{topic?.rationale ?? ''}</p>
                    <div className="p-2.5 rounded-lg bg-muted/30">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Content Angle</p>
                      <p className="text-xs text-foreground">{topic?.content_angle ?? ''}</p>
                    </div>
                    <InterestBar level={topic?.interest_level ?? 0} />
                    <Button size="sm" onClick={() => onNavigateToCreate(topic?.title ?? '')} className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-xs h-9 transition-all gap-1 group-hover:bg-primary group-hover:text-primary-foreground">
                      Use This Topic <FiArrowRight className="h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
