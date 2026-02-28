'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FiSearch, FiPlay, FiDownload, FiCopy, FiCheck, FiX } from 'react-icons/fi'

interface VideoItem {
  id: number
  title: string
  niche: string
  status: string
  date: string
  duration: string
  caption: string
}

const MOCK_VIDEOS: VideoItem[] = [
  { id: 1, title: '5 AI Tools You Need in 2025', niche: 'AI/Tech', status: 'Posted', date: 'Feb 26', duration: '45s', caption: 'These AI tools are changing the game. Which one is your favorite? #AI #Tech #Productivity' },
  { id: 2, title: 'Morning Routine for Success', niche: 'Motivation', status: 'Rendered', date: 'Feb 25', duration: '60s', caption: 'Start your day with intention. Here is a routine that transforms your mornings.' },
  { id: 3, title: 'Crypto Market Breakdown', niche: 'Crypto', status: 'Draft', date: 'Feb 25', duration: '30s', caption: 'Bitcoin is making moves. Here is what you need to know right now.' },
  { id: 4, title: 'Full Body Home Workout', niche: 'Fitness', status: 'Posted', date: 'Feb 24', duration: '45s', caption: 'No gym? No problem. 15 minutes is all you need for a full body burn.' },
  { id: 5, title: 'Budget Travel Hacks Europe', niche: 'Travel', status: 'Scheduled', date: 'Feb 24', duration: '60s', caption: 'Travel Europe on $50/day. These hacks will save you thousands.' },
  { id: 6, title: 'Healthy Meal Prep Sunday', niche: 'Food', status: 'Posted', date: 'Feb 23', duration: '45s', caption: 'Sunday meal prep done right. Save time, eat healthy all week.' },
  { id: 7, title: 'Side Hustle Ideas 2025', niche: 'Business', status: 'Rendered', date: 'Feb 22', duration: '60s', caption: 'These side hustles can earn you $5K+/month. Number 3 is underrated.' },
  { id: 8, title: 'Python in 60 Seconds', niche: 'AI/Tech', status: 'Posted', date: 'Feb 21', duration: '60s', caption: 'Learn Python basics in under a minute. Save this for later!' },
  { id: 9, title: 'Mindset Shift for Winners', niche: 'Motivation', status: 'Failed', date: 'Feb 20', duration: '30s', caption: 'Change your mindset, change your life. These principles are powerful.' },
  { id: 10, title: 'Street Style Lookbook', niche: 'Fashion', status: 'Draft', date: 'Feb 19', duration: '45s', caption: 'Street style fits for every season. Which look is your vibe?' },
  { id: 11, title: 'Gaming Setup Tour 2025', niche: 'Gaming', status: 'Posted', date: 'Feb 18', duration: '60s', caption: 'My gaming setup tour! Everything you see is linked in bio.' },
  { id: 12, title: 'Meditation for Beginners', niche: 'Health', status: 'Rendered', date: 'Feb 17', duration: '45s', caption: 'Start meditating today. Just 5 minutes can change everything.' },
]

function statusStyle(status: string) {
  switch (status) {
    case 'Posted': return 'bg-accent/20 text-accent'
    case 'Rendered': return 'bg-primary/20 text-primary'
    case 'Draft': return 'bg-muted text-muted-foreground'
    case 'Scheduled': return 'bg-[hsl(191,97%,70%)]/20 text-[hsl(191,97%,70%)]'
    case 'Failed': return 'bg-destructive/20 text-destructive'
    default: return 'bg-muted text-muted-foreground'
  }
}

export default function LibrarySection() {
  const [search, setSearch] = useState('')
  const [nicheFilter, setNicheFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const filtered = MOCK_VIDEOS.filter(v => {
    const matchesSearch = !search || v.title.toLowerCase().includes(search.toLowerCase())
    const matchesNiche = nicheFilter === 'all' || v.niche === nicheFilter
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter
    return matchesSearch && matchesNiche && matchesStatus
  })

  const niches = Array.from(new Set(MOCK_VIDEOS.map(v => v.niche)))
  const statuses = Array.from(new Set(MOCK_VIDEOS.map(v => v.status)))

  const handleCopy = (video: VideoItem) => {
    navigator.clipboard.writeText(video.caption).catch(() => {})
    setCopiedId(video.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Video Library</h1>
        <p className="text-sm text-muted-foreground mt-1">Browse and manage all your created videos.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search videos..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-input border-border text-foreground pl-9" />
        </div>
        <Select value={nicheFilter} onValueChange={setNicheFilter}>
          <SelectTrigger className="bg-input border-border text-foreground w-[140px]"><SelectValue placeholder="Niche" /></SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">All Niches</SelectItem>
            {niches.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-input border-border text-foreground w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">All Status</SelectItem>
            {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(video => (
          <Card key={video.id} className="bg-card border-border card-elevated hover:glow-border transition-all cursor-pointer group" onClick={() => setSelectedVideo(video)}>
            <CardContent className="p-0">
              <div className="aspect-[9/16] max-h-[180px] bg-secondary rounded-t-xl flex items-center justify-center relative overflow-hidden">
                <FiPlay className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                <Badge className={`${statusStyle(video.status)} text-[10px] border-0 absolute top-2 right-2`}>{video.status}</Badge>
                <span className="absolute bottom-2 right-2 text-[10px] text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded">{video.duration}</span>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-foreground truncate">{video.title}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">{video.niche}</Badge>
                  <span className="text-[10px] text-muted-foreground">{video.date}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm text-muted-foreground">No videos match your filters.</p>
        </div>
      )}

      <Dialog open={selectedVideo !== null} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="bg-card border-border text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">{selectedVideo?.title ?? 'Video Details'}</DialogTitle>
          </DialogHeader>
          {selectedVideo && (
            <div className="space-y-4">
              <div className="aspect-video bg-secondary rounded-xl flex items-center justify-center">
                <FiPlay className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge className={`${statusStyle(selectedVideo.status)} text-xs border-0`}>{selectedVideo.status}</Badge>
                <Badge variant="outline" className="text-xs border-border text-muted-foreground">{selectedVideo.niche}</Badge>
                <Badge variant="outline" className="text-xs border-border text-muted-foreground">{selectedVideo.duration}</Badge>
                <Badge variant="outline" className="text-xs border-border text-muted-foreground">{selectedVideo.date}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Caption</p>
                <div className="p-3 rounded-xl bg-muted/40 text-sm text-foreground">{selectedVideo.caption}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-muted" onClick={() => handleCopy(selectedVideo)}>
                  {copiedId === selectedVideo.id ? <><FiCheck className="mr-2 h-4 w-4" /> Copied!</> : <><FiCopy className="mr-2 h-4 w-4" /> Copy Caption</>}
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <FiDownload className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
