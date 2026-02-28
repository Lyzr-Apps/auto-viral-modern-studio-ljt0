'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { FiVideo, FiCalendar, FiTrendingUp, FiZap, FiCreditCard, FiChevronRight, FiPlay, FiArrowUpRight, FiArrowDownRight, FiClock, FiEye, FiPlus } from 'react-icons/fi'

interface DashboardSectionProps {
  onNavigateToTab: (tab: string) => void
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 80
  const h = 28
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ')
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ProgressRing({ value, max, size = 44, stroke = 3.5, color }: { value: number; max: number; size?: number; stroke?: number; color: string }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(value / max, 1)
  const offset = circumference * (1 - pct)
  return (
    <svg width={size} height={size} className="progress-ring">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(232 16% 28%)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
    </svg>
  )
}

const MOCK_VIDEOS = [
  { id: 1, title: '5 AI Tools You Need in 2025', niche: 'AI/Tech', status: 'Posted', date: 'Feb 26', views: '45.2K', trend: 'up' },
  { id: 2, title: 'Morning Routine for Success', niche: 'Motivation', status: 'Rendered', date: 'Feb 25', views: '--', trend: 'none' },
  { id: 3, title: 'Crypto Market Breakdown', niche: 'Crypto', status: 'Draft', date: 'Feb 25', views: '--', trend: 'none' },
  { id: 4, title: 'Full Body Home Workout', niche: 'Fitness', status: 'Posted', date: 'Feb 24', views: '31.7K', trend: 'up' },
  { id: 5, title: 'Budget Travel Hacks Europe', niche: 'Travel', status: 'Scheduled', date: 'Feb 24', views: '--', trend: 'none' },
  { id: 6, title: 'Side Hustle Ideas 2025', niche: 'Business', status: 'Posted', date: 'Feb 23', views: '12.5K', trend: 'down' },
]

const MOCK_SCHEDULE = [
  { id: 1, title: 'AI Productivity Tips', date: 'Feb 28', time: '6:00 PM', platform: 'Instagram', ready: true },
  { id: 2, title: 'Gym Motivation Reel', date: 'Mar 1', time: '8:00 AM', platform: 'TikTok', ready: true },
  { id: 3, title: 'Crypto Weekly Update', date: 'Mar 1', time: '12:00 PM', platform: 'YouTube', ready: false },
  { id: 4, title: 'Healthy Meal Prep Guide', date: 'Mar 2', time: '5:00 PM', platform: 'Instagram', ready: true },
]

function statusColor(status: string) {
  switch (status) {
    case 'Posted': return 'bg-accent/20 text-accent'
    case 'Rendered': return 'bg-primary/20 text-primary'
    case 'Draft': return 'bg-muted text-muted-foreground'
    case 'Scheduled': return 'bg-[hsl(191,97%,70%)]/20 text-[hsl(191,97%,70%)]'
    default: return 'bg-muted text-muted-foreground'
  }
}

export default function DashboardSection({ onNavigateToTab }: DashboardSectionProps) {
  const [animatedCredits, setAnimatedCredits] = useState(0)

  useEffect(() => {
    const target = 847
    let current = 0
    const step = Math.ceil(target / 30)
    const interval = setInterval(() => {
      current += step
      if (current >= target) { current = target; clearInterval(interval) }
      setAnimatedCredits(current)
    }, 30)
    return () => clearInterval(interval)
  }, [])

  const metrics = [
    { label: 'Credits Remaining', value: `${animatedCredits}`, sub: 'of 1,000', icon: FiCreditCard, color: 'text-primary', bgClass: 'bg-gradient-primary', sparkData: [800, 820, 790, 847, 900, 870, 847], sparkColor: 'hsl(265,89%,72%)', ring: { value: animatedCredits, max: 1000 }, ringColor: 'hsl(265,89%,72%)' },
    { label: 'Videos This Week', value: '12', sub: '+3 from last week', icon: FiVideo, color: 'text-accent', bgClass: 'bg-gradient-accent', sparkData: [4, 6, 8, 7, 10, 9, 12], sparkColor: 'hsl(135,94%,60%)', ring: { value: 12, max: 20 }, ringColor: 'hsl(135,94%,60%)' },
    { label: 'Scheduled Posts', value: '5', sub: 'Next: Today 6 PM', icon: FiCalendar, color: 'text-[hsl(191,97%,70%)]', bgClass: 'bg-gradient-primary', sparkData: [2, 3, 5, 4, 6, 5, 5], sparkColor: 'hsl(191,97%,70%)', ring: { value: 5, max: 10 }, ringColor: 'hsl(191,97%,70%)' },
    { label: 'Total Views', value: '245.8K', sub: '+18.2% this week', icon: FiEye, color: 'text-[hsl(326,100%,68%)]', bgClass: 'bg-gradient-warm', sparkData: [180, 195, 210, 205, 228, 240, 246], sparkColor: 'hsl(326,100%,68%)', ring: { value: 75, max: 100 }, ringColor: 'hsl(326,100%,68%)' },
  ]

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-hero border border-border p-6 lg:p-8">
        <div className="relative z-10">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            Welcome back, <span className="text-gradient-primary">Alex</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg">
            You have created 12 videos this week and have 5 posts scheduled. Your AI/Tech content is performing 23% above average.
          </p>
          <div className="flex gap-3 mt-5">
            <Button onClick={() => onNavigateToTab('create')} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <FiPlus className="h-4 w-4" /> Create Video
            </Button>
            <Button variant="outline" onClick={() => onNavigateToTab('niches')} className="border-border text-foreground hover:bg-muted gap-2">
              <FiTrendingUp className="h-4 w-4" /> Browse Niches
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {metrics.map((m) => (
          <Card key={m.label} className={`bg-card border-border card-elevated overflow-hidden`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-lg ${m.bgClass} flex items-center justify-center`}>
                      <m.icon className={`h-4 w-4 ${m.color}`} />
                    </div>
                    <span className="text-xs text-muted-foreground">{m.label}</span>
                  </div>
                  <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums">{m.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{m.sub}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <ProgressRing value={m.ring.value} max={m.ring.max} color={m.ringColor} />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/50">
                <MiniSparkline data={m.sparkData} color={m.sparkColor} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Videos - takes 2 cols */}
        <Card className="bg-card border-border card-elevated lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-foreground">Recent Videos</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onNavigateToTab('library')} className="text-muted-foreground hover:text-foreground text-xs gap-1">
                View All <FiChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {MOCK_VIDEOS.map((video) => (
                <div key={video.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all cursor-pointer group">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                    <FiPlay className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{video.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-muted-foreground">{video.niche}</span>
                      <span className="text-[11px] text-muted-foreground/50">|</span>
                      <span className="text-[11px] text-muted-foreground">{video.date}</span>
                    </div>
                  </div>
                  {video.views !== '--' && (
                    <div className="flex items-center gap-1 mr-2">
                      <span className="text-xs font-medium text-foreground tabular-nums">{video.views}</span>
                      {video.trend === 'up' && <FiArrowUpRight className="h-3 w-3 text-accent" />}
                      {video.trend === 'down' && <FiArrowDownRight className="h-3 w-3 text-destructive" />}
                    </div>
                  )}
                  <Badge className={`${statusColor(video.status)} text-[10px] border-0 flex-shrink-0`}>{video.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Schedule - right column */}
        <Card className="bg-card border-border card-elevated">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-foreground">Upcoming</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onNavigateToTab('scheduler')} className="text-muted-foreground hover:text-foreground text-xs gap-1">
                Manage <FiChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {MOCK_SCHEDULE.map((item, idx) => (
                <div key={item.id} className="relative pl-6">
                  {/* Timeline line */}
                  {idx < MOCK_SCHEDULE.length - 1 && (
                    <div className="absolute left-[7px] top-8 bottom-0 w-px bg-border" />
                  )}
                  {/* Timeline dot */}
                  <div className={`absolute left-0 top-2 w-[15px] h-[15px] rounded-full border-2 ${item.ready ? 'border-accent bg-accent/20' : 'border-muted-foreground bg-muted'}`}>
                    {item.ready && <div className="absolute inset-[3px] rounded-full bg-accent animate-live-pulse" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <FiClock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">{item.date} at {item.time}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] border-border text-muted-foreground mt-1.5">{item.platform}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Bar */}
      <Card className="bg-card border-border card-elevated">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FiTrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Top Niche</p>
                <p className="text-sm font-semibold text-foreground">AI/Tech</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <FiZap className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Completion</p>
                <p className="text-sm font-semibold text-foreground">72%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[hsl(191,97%,70%)]/10 flex items-center justify-center">
                <FiClock className="h-4 w-4 text-[hsl(191,97%,70%)]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Best Post Time</p>
                <p className="text-sm font-semibold text-foreground">6:00 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[hsl(326,100%,68%)]/10 flex items-center justify-center">
                <FiVideo className="h-4 w-4 text-[hsl(326,100%,68%)]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Videos</p>
                <p className="text-sm font-semibold text-foreground">127</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
