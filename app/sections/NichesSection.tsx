'use client'

import React, { useState } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FiTrendingUp, FiZap, FiArrowRight, FiCpu, FiHeart, FiDollarSign, FiStar, FiGlobe, FiBookOpen, FiMusic, FiSmile, FiTarget, FiSun, FiActivity } from 'react-icons/fi'

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
  { name: 'Motivation', icon: FiZap },
  { name: 'Gym/Fitness', icon: FiActivity },
  { name: 'Business', icon: FiDollarSign },
  { name: 'AI/Tech', icon: FiCpu },
  { name: 'Crypto', icon: FiTarget },
  { name: 'Health', icon: FiHeart },
  { name: 'Travel', icon: FiGlobe },
  { name: 'Food', icon: FiSun },
  { name: 'Fashion', icon: FiStar },
  { name: 'Comedy', icon: FiSmile },
  { name: 'Education', icon: FiBookOpen },
  { name: 'Music', icon: FiMusic },
  { name: 'Gaming', icon: FiTarget },
  { name: 'Lifestyle', icon: FiHeart },
]

function velocityColor(velocity: string) {
  const v = (velocity ?? '').toLowerCase()
  if (v.includes('hot') || v.includes('viral') || v.includes('exploding')) return 'bg-destructive/20 text-destructive'
  if (v.includes('rising') || v.includes('growing')) return 'bg-[hsl(31,100%,65%)]/20 text-[hsl(31,100%,65%)]'
  return 'bg-[hsl(191,97%,70%)]/20 text-[hsl(191,97%,70%)]'
}

function InterestDots({ level }: { level: number }) {
  const filled = Math.min(5, Math.max(0, Math.round(level ?? 0)))
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className={`w-2 h-2 rounded-full ${i <= filled ? 'bg-primary' : 'bg-muted'}`} />
      ))}
    </div>
  )
}

export default function NichesSection({ onNavigateToCreate }: NichesSectionProps) {
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [topics, setTopics] = useState<TopicItem[]>([])
  const [nicheLabel, setNicheLabel] = useState('')

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
        const topicsList = Array.isArray(data?.topics) ? data.topics : []
        setTopics(topicsList)
        setNicheLabel(data?.niche ?? selectedNiche)
      } else {
        setError(result?.error ?? 'Failed to fetch topics. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Niches & Trends</h1>
        <p className="text-sm text-muted-foreground mt-1">Select a niche to discover trending topics for your next video.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {NICHES.map(niche => (
          <button key={niche.name} onClick={() => { setSelectedNiche(niche.name); setTopics([]); setError(null); }} className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${selectedNiche === niche.name ? 'border-primary bg-primary/10 glow-border' : 'border-border bg-card hover:bg-muted/50'}`}>
            <niche.icon className={`h-6 w-6 ${selectedNiche === niche.name ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={`text-xs font-medium ${selectedNiche === niche.name ? 'text-primary' : 'text-foreground'}`}>{niche.name}</span>
          </button>
        ))}
      </div>

      {selectedNiche && topics.length === 0 && !loading && (
        <div className="flex justify-center">
          <Button onClick={handleSuggestTopics} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
            <FiTrendingUp className="mr-2 h-4 w-4" /> Suggest Topics for {selectedNiche}
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Analyzing trends for {selectedNiche}...</p>
        </div>
      )}

      {error && (
        <Card className="bg-destructive/10 border-destructive/30">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="ghost" size="sm" onClick={handleSuggestTopics} className="mt-2 text-destructive hover:text-destructive/80">Retry</Button>
          </CardContent>
        </Card>
      )}

      {topics.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FiTrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Trending in {nicheLabel}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic, idx) => (
              <Card key={idx} className="bg-card border-border card-elevated hover:glow-border transition-all">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground leading-snug">{topic?.title ?? 'Untitled Topic'}</h3>
                    <Badge className={`${velocityColor(topic?.trend_velocity ?? '')} text-[10px] border-0 flex-shrink-0`}>{topic?.trend_velocity ?? 'Steady'}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{topic?.rationale ?? ''}</p>
                  <div className="pt-1">
                    <p className="text-xs text-muted-foreground mb-1">Content Angle</p>
                    <p className="text-xs text-foreground">{topic?.content_angle ?? ''}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-1">Interest</p>
                      <InterestDots level={topic?.interest_level ?? 0} />
                    </div>
                    <Button size="sm" onClick={() => onNavigateToCreate(topic?.title ?? '')} className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8">
                      Use This <FiArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
