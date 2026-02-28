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
import { FiCalendar, FiClock, FiCheck, FiRefreshCw, FiPlus, FiMinus } from 'react-icons/fi'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const NICHES = ['AI/Tech', 'Motivation', 'Fitness', 'Business', 'Crypto', 'Health', 'Travel', 'Food']

const MOCK_QUEUE = [
  { id: 1, title: 'AI Productivity Tips', platform: 'Instagram', scheduledTime: 'Feb 28, 6:00 PM', status: 'Pending' },
  { id: 2, title: 'Gym Motivation Reel', platform: 'TikTok', scheduledTime: 'Mar 1, 8:00 AM', status: 'Pending' },
  { id: 3, title: 'Crypto Weekly Update', platform: 'YouTube', scheduledTime: 'Mar 1, 12:00 PM', status: 'Pending' },
  { id: 4, title: 'Failed Social Post', platform: 'Instagram', scheduledTime: 'Feb 25, 3:00 PM', status: 'Failed' },
  { id: 5, title: 'Healthy Meal Prep Guide', platform: 'Instagram', scheduledTime: 'Mar 2, 5:00 PM', status: 'Pending' },
  { id: 6, title: 'Side Hustle Ideas 2025', platform: 'TikTok', scheduledTime: 'Mar 3, 7:00 PM', status: 'Pending' },
]

const MOCK_CALENDAR = [
  { day: 'Mon', slots: ['AI Tips - 6PM'] },
  { day: 'Tue', slots: [] },
  { day: 'Wed', slots: ['Fitness Reel - 8AM', 'Crypto - 12PM'] },
  { day: 'Thu', slots: [] },
  { day: 'Fri', slots: ['Meal Prep - 5PM'] },
  { day: 'Sat', slots: ['Hustle Ideas - 7PM'] },
  { day: 'Sun', slots: [] },
]

function queueStatusStyle(status: string) {
  if (status === 'Failed') return 'bg-destructive/20 text-destructive'
  return 'bg-accent/20 text-accent'
}

export default function SchedulerSection() {
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Wed', 'Fri'])
  const [postTime, setPostTime] = useState('18:00')
  const [selectedNiche, setSelectedNiche] = useState('AI/Tech')
  const [videosPerDay, setVideosPerDay] = useState(2)
  const [platformToggles, setPlatformToggles] = useState({ instagram: true, tiktok: true, youtube: false, facebook: false })
  const [saved, setSaved] = useState(false)

  const toggleDay = (day: string) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Scheduler</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your automated posting schedule.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border card-elevated">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <FiClock className="h-4 w-4 text-primary" /> Schedule Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Platforms</Label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(platformToggles).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                    <span className="text-sm text-foreground capitalize">{key}</span>
                    <Switch checked={val} onCheckedChange={(c) => setPlatformToggles(prev => ({ ...prev, [key]: c }))} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Posting Days</Label>
              <div className="flex gap-2">
                {DAYS.map(day => (
                  <button key={day} onClick={() => toggleDay(day)} className={`w-10 h-10 rounded-xl text-xs font-medium transition-all ${selectedDays.includes(day) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                    {day.charAt(0)}
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
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => setVideosPerDay(Math.max(1, videosPerDay - 1))} className="border-border text-foreground h-9 w-9 p-0">
                  <FiMinus className="h-3 w-3" />
                </Button>
                <span className="text-lg font-bold text-foreground w-8 text-center">{videosPerDay}</span>
                <Button variant="outline" size="sm" onClick={() => setVideosPerDay(Math.min(10, videosPerDay + 1))} className="border-border text-foreground h-9 w-9 p-0">
                  <FiPlus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {saved ? <><FiCheck className="mr-2 h-4 w-4" /> Saved!</> : 'Save Schedule'}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border card-elevated">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <FiCalendar className="h-4 w-4 text-primary" /> Weekly Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {MOCK_CALENDAR.map(day => (
                <div key={day.day} className="text-center">
                  <p className={`text-xs font-medium mb-2 ${selectedDays.includes(day.day) ? 'text-primary' : 'text-muted-foreground'}`}>{day.day}</p>
                  <div className={`min-h-[120px] rounded-xl p-2 space-y-1 ${selectedDays.includes(day.day) ? 'bg-primary/5 border border-primary/20' : 'bg-muted/30'}`}>
                    {day.slots.map((slot, i) => (
                      <div key={i} className="text-[10px] bg-primary/15 text-primary rounded-lg px-1.5 py-1 leading-tight">{slot}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border card-elevated">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">Post Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[260px]">
            <div className="space-y-2">
              {MOCK_QUEUE.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.platform} &middot; {item.scheduledTime}</p>
                  </div>
                  <Badge className={`${queueStatusStyle(item.status)} text-xs border-0`}>{item.status}</Badge>
                  {item.status === 'Failed' && (
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 w-8 p-0">
                      <FiRefreshCw className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
