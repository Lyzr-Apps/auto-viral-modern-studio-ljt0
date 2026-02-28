'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FiVideo, FiCalendar, FiTrendingUp, FiZap, FiCreditCard, FiChevronRight, FiPlay } from 'react-icons/fi'

interface DashboardSectionProps {
  onNavigateToTab: (tab: string) => void
}

const MOCK_VIDEOS = [
  { id: 1, title: '5 AI Tools You Need in 2025', niche: 'AI/Tech', status: 'Posted', date: 'Feb 26' },
  { id: 2, title: 'Morning Routine for Success', niche: 'Motivation', status: 'Rendered', date: 'Feb 25' },
  { id: 3, title: 'Crypto Market Breakdown', niche: 'Crypto', status: 'Draft', date: 'Feb 25' },
  { id: 4, title: 'Full Body Home Workout', niche: 'Fitness', status: 'Posted', date: 'Feb 24' },
  { id: 5, title: 'Budget Travel Hacks Europe', niche: 'Travel', status: 'Scheduled', date: 'Feb 24' },
]

const MOCK_SCHEDULE = [
  { id: 1, title: 'AI Productivity Tips', date: 'Feb 28 - 6:00 PM', platform: 'Instagram' },
  { id: 2, title: 'Gym Motivation Reel', date: 'Mar 1 - 8:00 AM', platform: 'TikTok' },
  { id: 3, title: 'Crypto Weekly Update', date: 'Mar 1 - 12:00 PM', platform: 'YouTube' },
  { id: 4, title: 'Healthy Meal Prep Guide', date: 'Mar 2 - 5:00 PM', platform: 'Instagram' },
  { id: 5, title: 'Side Hustle Ideas 2025', date: 'Mar 3 - 7:00 PM', platform: 'TikTok' },
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
  const metrics = [
    { label: 'Credits Remaining', value: '847 / 1,000', icon: FiCreditCard, color: 'text-primary' },
    { label: 'Videos This Week', value: '12', icon: FiVideo, color: 'text-accent' },
    { label: 'Scheduled Posts', value: '5', icon: FiCalendar, color: 'text-[hsl(191,97%,70%)]' },
    { label: 'Top Niche', value: 'AI/Tech', icon: FiTrendingUp, color: 'text-[hsl(326,100%,68%)]' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back. Here is your content overview.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => onNavigateToTab('create')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <FiZap className="mr-2 h-4 w-4" /> Create Video
          </Button>
          <Button variant="outline" onClick={() => onNavigateToTab('niches')} className="border-border text-foreground hover:bg-muted">
            <FiTrendingUp className="mr-2 h-4 w-4" /> Browse Niches
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
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
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-foreground">Recent Videos</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onNavigateToTab('library')} className="text-muted-foreground hover:text-foreground text-xs">
                View All <FiChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-[280px]">
              <div className="space-y-3">
                {MOCK_VIDEOS.map((video) => (
                  <div key={video.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors cursor-pointer">
                    <div className="w-14 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <FiPlay className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{video.title}</p>
                      <p className="text-xs text-muted-foreground">{video.niche} &middot; {video.date}</p>
                    </div>
                    <Badge className={`${statusColor(video.status)} text-xs border-0`}>{video.status}</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="bg-card border-border card-elevated">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-foreground">Upcoming Schedule</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onNavigateToTab('scheduler')} className="text-muted-foreground hover:text-foreground text-xs">
                Manage <FiChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-[280px]">
              <div className="space-y-3">
                {MOCK_SCHEDULE.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FiCalendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                    <Badge variant="outline" className="text-xs border-border text-muted-foreground">{item.platform}</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
