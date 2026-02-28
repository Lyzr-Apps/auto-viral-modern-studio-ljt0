'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { FiCalendar, FiClock, FiCheck, FiRefreshCw, FiPlus, FiMinus, FiAlertCircle, FiChevronRight } from 'react-icons/fi'
import { SiInstagram, SiTiktok, SiYoutube, SiFacebook } from 'react-icons/si'

const DAYS = [
  { key: 'Mon', label: 'M' },
  { key: 'Tue', label: 'T' },
  { key: 'Wed', label: 'W' },
  { key: 'Thu', label: 'T' },
  { key: 'Fri', label: 'F' },
  { key: 'Sat', label: 'S' },
  { key: 'Sun', label: 'S' },
]

const NICHES = ['AI/Tech', 'Motivation', 'Fitness', 'Business', 'Crypto', 'Health', 'Travel', 'Food']

const PLATFORMS = [
  { key: 'instagram', label: 'Instagram', icon: SiInstagram, color: 'text-[hsl(326,100%,68%)]' },
  { key: 'tiktok', label: 'TikTok', icon: SiTiktok, color: 'text-foreground' },
  { key: 'youtube', label: 'YouTube', icon: SiYoutube, color: 'text-destructive' },
  { key: 'facebook', label: 'Facebook', icon: SiFacebook, color: 'text-[hsl(191,97%,70%)]' },
]

const MOCK_QUEUE = [
  { id: 1, title: 'AI Productivity Tips', platform: 'Instagram', scheduledTime: 'Feb 28, 6:00 PM', status: 'Ready', type: 'auto' },
  { id: 2, title: 'Gym Motivation Reel', platform: 'TikTok', scheduledTime: 'Mar 1, 8:00 AM', status: 'Ready', type: 'auto' },
  { id: 3, title: 'Crypto Weekly Update', platform: 'YouTube', scheduledTime: 'Mar 1, 12:00 PM', status: 'Generating', type: 'auto' },
  { id: 4, title: 'Failed Social Post', platform: 'Instagram', scheduledTime: 'Feb 25, 3:00 PM', status: 'Failed', type: 'manual' },
  { id: 5, title: 'Healthy Meal Prep Guide', platform: 'Instagram', scheduledTime: 'Mar 2, 5:00 PM', status: 'Ready', type: 'auto' },
  { id: 6, title: 'Side Hustle Ideas 2025', platform: 'TikTok', scheduledTime: 'Mar 3, 7:00 PM', status: 'Ready', type: 'auto' },
]

const MOCK_CALENDAR = [
  { day: 'Mon', slots: [{ title: 'AI Tips', time: '6PM', platform: 'IG' }] },
  { day: 'Tue', slots: [] },
  { day: 'Wed', slots: [{ title: 'Fitness Reel', time: '8AM', platform: 'TT' }, { title: 'Crypto', time: '12PM', platform: 'YT' }] },
  { day: 'Thu', slots: [] },
  { day: 'Fri', slots: [{ title: 'Meal Prep', time: '5PM', platform: 'IG' }] },
  { day: 'Sat', slots: [{ title: 'Hustle Ideas', time: '7PM', platform: 'TT' }] },
  { day: 'Sun', slots: [] },
]

function queueStatusStyle(status: string) {
  if (status === 'Failed') return 'bg-destructive/15 text-destructive'
  if (status === 'Generating') return 'bg-[hsl(31,100%,65%)]/15 text-[hsl(31,100%,65%)]'
  return 'bg-accent/15 text-accent'
}

function queueIcon(status: string) {
  if (status === 'Failed') return FiAlertCircle
  if (status === 'Generating') return FiClock
  return FiCheck
}

interface QueueItem {
  id: number
  title: string
  platform: string
  scheduledTime: string
  status: string
  type: string
}

export default function SchedulerSection() {
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Wed', 'Fri'])
  const [postTime, setPostTime] = useState('18:00')
  const [selectedNiche, setSelectedNiche] = useState('AI/Tech')
  const [queueItems, setQueueItems] = useState<QueueItem[]>(MOCK_QUEUE)
  const [videosPerDay, setVideosPerDay] = useState(2)
  const [platformToggles, setPlatformToggles] = useState<Record<string, boolean>>({ instagram: true, tiktok: true, youtube: false, facebook: false })
  const [saved, setSaved] = useState(false)

  const toggleDay = (day: string) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleRetryPost = (id: number) => {
    setQueueItems(prev => prev.map(item =>
      item.id === id ? { ...item, status: 'Generating' } : item
    ))
    setTimeout(() => {
      setQueueItems(prev => prev.map(item =>
        item.id === id ? { ...item, status: 'Ready' } : item
      ))
    }, 2500)
  }

  const activePlatformCount = Object.values(platformToggles).filter(Boolean).length
  const totalWeeklyVideos = selectedDays.length * videosPerDay

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Scheduler</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure your automated posting schedule.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-border text-muted-foreground text-xs gap-1">
            <FiCalendar className="h-3 w-3" /> {totalWeeklyVideos} videos/week
          </Badge>
          <Badge variant="outline" className="border-border text-muted-foreground text-xs gap-1">
            {activePlatformCount} platforms
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schedule Config */}
        <Card className="bg-card border-border card-elevated">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <FiClock className="h-4 w-4 text-primary" /> Schedule Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label className="text-sm text-muted-foreground mb-2.5 block">Platforms</Label>
              <div className="grid grid-cols-2 gap-2.5">
                {PLATFORMS.map(p => (
                  <div key={p.key} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${platformToggles[p.key] ? 'border-primary/30 bg-primary/5' : 'border-border bg-muted/30'}`}>
                    <div className="flex items-center gap-2.5">
                      <p.icon className={`h-4 w-4 ${platformToggles[p.key] ? p.color : 'text-muted-foreground'}`} />
                      <span className={`text-sm ${platformToggles[p.key] ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{p.label}</span>
                    </div>
                    <Switch checked={platformToggles[p.key]} onCheckedChange={(c) => setPlatformToggles(prev => ({ ...prev, [p.key]: c }))} />
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-border" />

            <div>
              <Label className="text-sm text-muted-foreground mb-2.5 block">Posting Days</Label>
              <div className="flex gap-2">
                {DAYS.map(day => (
                  <button key={day.key} onClick={() => toggleDay(day.key)} className={`flex-1 aspect-square max-w-[44px] rounded-xl text-xs font-semibold transition-all flex items-center justify-center ${selectedDays.includes(day.key) ? 'bg-primary text-primary-foreground glow-primary' : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'}`}>
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Post Time</Label>
                <Input type="time" value={postTime} onChange={(e) => setPostTime(e.target.value)} className="bg-input border-border text-foreground" />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Niche</Label>
                <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                  <SelectTrigger className="bg-input border-border text-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {NICHES.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Videos Per Day</Label>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => setVideosPerDay(Math.max(1, videosPerDay - 1))} className="border-border text-foreground h-9 w-9 p-0">
                  <FiMinus className="h-3 w-3" />
                </Button>
                <div className="flex-1 bg-muted rounded-xl h-9 flex items-center justify-center">
                  <span className="text-lg font-bold text-foreground tabular-nums">{videosPerDay}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => setVideosPerDay(Math.min(10, videosPerDay + 1))} className="border-border text-foreground h-9 w-9 p-0">
                  <FiPlus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <Button onClick={handleSave} className={`w-full transition-all ${saved ? 'bg-accent text-accent-foreground' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}>
              {saved ? <><FiCheck className="mr-2 h-4 w-4" /> Schedule Saved</> : 'Save Schedule'}
            </Button>
          </CardContent>
        </Card>

        {/* Weekly Calendar */}
        <Card className="bg-card border-border card-elevated">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <FiCalendar className="h-4 w-4 text-primary" /> This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1.5">
              {MOCK_CALENDAR.map(day => (
                <div key={day.day} className="text-center">
                  <p className={`text-[10px] font-semibold mb-2 ${selectedDays.includes(day.day) ? 'text-primary' : 'text-muted-foreground'}`}>{day.day}</p>
                  <div className={`min-h-[140px] rounded-xl p-1.5 space-y-1 transition-colors ${selectedDays.includes(day.day) ? 'bg-primary/5 border border-primary/20' : 'bg-muted/20 border border-transparent'}`}>
                    {day.slots.map((slot, i) => (
                      <div key={i} className="text-[9px] bg-primary/15 text-primary rounded-lg px-1 py-1.5 leading-tight space-y-0.5">
                        <p className="font-medium truncate">{slot.title}</p>
                        <p className="text-primary/70">{slot.time}</p>
                        <Badge className="h-3 text-[7px] px-1 bg-primary/20 text-primary border-0">{slot.platform}</Badge>
                      </div>
                    ))}
                    {day.slots.length === 0 && selectedDays.includes(day.day) && (
                      <div className="flex items-center justify-center h-full min-h-[60px]">
                        <FiPlus className="h-3 w-3 text-primary/40" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Post Queue */}
      <Card className="bg-card border-border card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-foreground">Post Queue</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] border-accent/30 text-accent">{queueItems.filter(q => q.status === 'Ready').length} ready</Badge>
              {queueItems.some(q => q.status === 'Failed') && (
                <Badge variant="outline" className="text-[10px] border-destructive/30 text-destructive">{queueItems.filter(q => q.status === 'Failed').length} failed</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[280px]">
            <div className="space-y-2">
              {queueItems.map(item => {
                const StatusIcon = queueIcon(item.status)
                return (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all group">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.status === 'Failed' ? 'bg-destructive/10' : item.status === 'Generating' ? 'bg-[hsl(31,100%,65%)]/10' : 'bg-accent/10'}`}>
                      <StatusIcon className={`h-3.5 w-3.5 ${item.status === 'Failed' ? 'text-destructive' : item.status === 'Generating' ? 'text-[hsl(31,100%,65%)] animate-spin-slow' : 'text-accent'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground">{item.platform} -- {item.scheduledTime}</p>
                    </div>
                    <Badge className={`${queueStatusStyle(item.status)} text-[10px] border-0`}>{item.status}</Badge>
                    {item.status === 'Failed' && (
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleRetryPost(item.id); }} className="text-muted-foreground hover:text-foreground h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity" title="Retry posting">
                        <FiRefreshCw className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
