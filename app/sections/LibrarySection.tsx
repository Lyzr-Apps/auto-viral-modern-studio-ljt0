'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { FiSearch, FiPlay, FiDownload, FiCopy, FiCheck, FiGrid, FiList, FiCalendar, FiEye, FiHeart, FiShare2, FiTrash2, FiMoreVertical } from 'react-icons/fi'

interface VideoItem {
  id: number
  title: string
  niche: string
  status: string
  date: string
  duration: string
  caption: string
  views: string
  likes: string
  shares: string
}

const MOCK_VIDEOS: VideoItem[] = [
  { id: 1, title: '5 AI Tools You Need in 2025', niche: 'AI/Tech', status: 'Posted', date: 'Feb 26', duration: '45s', caption: 'These AI tools are changing the game. Which one is your favorite? #AI #Tech #Productivity', views: '45.2K', likes: '3.2K', shares: '892' },
  { id: 2, title: 'Morning Routine for Success', niche: 'Motivation', status: 'Rendered', date: 'Feb 25', duration: '60s', caption: 'Start your day with intention. Here is a routine that transforms your mornings.', views: '--', likes: '--', shares: '--' },
  { id: 3, title: 'Crypto Market Breakdown', niche: 'Crypto', status: 'Draft', date: 'Feb 25', duration: '30s', caption: 'Bitcoin is making moves. Here is what you need to know right now.', views: '--', likes: '--', shares: '--' },
  { id: 4, title: 'Full Body Home Workout', niche: 'Fitness', status: 'Posted', date: 'Feb 24', duration: '45s', caption: 'No gym? No problem. 15 minutes is all you need for a full body burn.', views: '31.7K', likes: '2.1K', shares: '645' },
  { id: 5, title: 'Budget Travel Hacks Europe', niche: 'Travel', status: 'Scheduled', date: 'Feb 24', duration: '60s', caption: 'Travel Europe on $50/day. These hacks will save you thousands.', views: '--', likes: '--', shares: '--' },
  { id: 6, title: 'Healthy Meal Prep Sunday', niche: 'Food', status: 'Posted', date: 'Feb 23', duration: '45s', caption: 'Sunday meal prep done right. Save time, eat healthy all week.', views: '18.9K', likes: '1.4K', shares: '423' },
  { id: 7, title: 'Side Hustle Ideas 2025', niche: 'Business', status: 'Rendered', date: 'Feb 22', duration: '60s', caption: 'These side hustles can earn you $5K+/month. Number 3 is underrated.', views: '--', likes: '--', shares: '--' },
  { id: 8, title: 'Python in 60 Seconds', niche: 'AI/Tech', status: 'Posted', date: 'Feb 21', duration: '60s', caption: 'Learn Python basics in under a minute. Save this for later!', views: '52.3K', likes: '4.8K', shares: '1.2K' },
  { id: 9, title: 'Mindset Shift for Winners', niche: 'Motivation', status: 'Failed', date: 'Feb 20', duration: '30s', caption: 'Change your mindset, change your life. These principles are powerful.', views: '--', likes: '--', shares: '--' },
  { id: 10, title: 'Street Style Lookbook', niche: 'Fashion', status: 'Draft', date: 'Feb 19', duration: '45s', caption: 'Street style fits for every season. Which look is your vibe?', views: '--', likes: '--', shares: '--' },
  { id: 11, title: 'Gaming Setup Tour 2025', niche: 'Gaming', status: 'Posted', date: 'Feb 18', duration: '60s', caption: 'My gaming setup tour! Everything you see is linked in bio.', views: '28.5K', likes: '2.3K', shares: '567' },
  { id: 12, title: 'Meditation for Beginners', niche: 'Health', status: 'Rendered', date: 'Feb 17', duration: '45s', caption: 'Start meditating today. Just 5 minutes can change everything.', views: '--', likes: '--', shares: '--' },
]

function statusStyle(status: string) {
  switch (status) {
    case 'Posted': return 'bg-accent/15 text-accent'
    case 'Rendered': return 'bg-primary/15 text-primary'
    case 'Draft': return 'bg-muted text-muted-foreground'
    case 'Scheduled': return 'bg-[hsl(191,97%,70%)]/15 text-[hsl(191,97%,70%)]'
    case 'Failed': return 'bg-destructive/15 text-destructive'
    default: return 'bg-muted text-muted-foreground'
  }
}

export default function LibrarySection() {
  const [search, setSearch] = useState('')
  const [nicheFilter, setNicheFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
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

  const statusCounts = {
    all: MOCK_VIDEOS.length,
    Posted: MOCK_VIDEOS.filter(v => v.status === 'Posted').length,
    Rendered: MOCK_VIDEOS.filter(v => v.status === 'Rendered').length,
    Draft: MOCK_VIDEOS.filter(v => v.status === 'Draft').length,
    Scheduled: MOCK_VIDEOS.filter(v => v.status === 'Scheduled').length,
    Failed: MOCK_VIDEOS.filter(v => v.status === 'Failed').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Video Library</h1>
          <p className="text-sm text-muted-foreground mt-1">{MOCK_VIDEOS.length} total videos | {statusCounts.Posted} posted</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'border-border text-muted-foreground'}>
            <FiGrid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'border-border text-muted-foreground'}>
            <FiList className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
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
            <SelectItem value="all">All ({statusCounts.all})</SelectItem>
            {statuses.map(s => <SelectItem key={s} value={s}>{s} ({statusCounts[s as keyof typeof statusCounts] ?? 0})</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
          {filtered.map(video => (
            <Card key={video.id} className="bg-card border-border card-interactive group overflow-hidden" onClick={() => setSelectedVideo(video)}>
              <CardContent className="p-0">
                <div className="aspect-[9/16] max-h-[200px] bg-gradient-to-br from-secondary to-muted rounded-t-xl flex items-center justify-center relative overflow-hidden">
                  <div className="w-12 h-12 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                    <FiPlay className="h-5 w-5 text-foreground ml-0.5" />
                  </div>
                  <Badge className={`${statusStyle(video.status)} text-[9px] border-0 absolute top-2 right-2`}>{video.status}</Badge>
                  <span className="absolute bottom-2 right-2 text-[10px] text-foreground/80 bg-background/60 backdrop-blur-sm px-1.5 py-0.5 rounded-md font-medium">{video.duration}</span>
                  {video.views !== '--' && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] text-foreground/80 bg-background/60 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
                      <FiEye className="h-2.5 w-2.5" /> {video.views}
                    </div>
                  )}
                </div>
                <div className="p-3.5">
                  <p className="text-sm font-medium text-foreground truncate">{video.title}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">{video.niche}</Badge>
                    <span className="text-[10px] text-muted-foreground">{video.date}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          {filtered.map(video => (
            <div key={video.id} className="flex items-center gap-4 p-3 rounded-xl bg-card border border-border hover:bg-muted/30 transition-all cursor-pointer group" onClick={() => setSelectedVideo(video)}>
              <div className="w-16 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <FiPlay className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{video.title}</p>
                <p className="text-[11px] text-muted-foreground">{video.niche} | {video.duration} | {video.date}</p>
              </div>
              {video.views !== '--' && (
                <div className="hidden sm:flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><FiEye className="h-3 w-3" /> {video.views}</span>
                  <span className="flex items-center gap-1"><FiHeart className="h-3 w-3" /> {video.likes}</span>
                </div>
              )}
              <Badge className={`${statusStyle(video.status)} text-[10px] border-0 flex-shrink-0`}>{video.status}</Badge>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <FiSearch className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No videos match your filters.</p>
          <Button variant="ghost" size="sm" className="text-primary mt-2" onClick={() => { setSearch(''); setNicheFilter('all'); setStatusFilter('all'); }}>Clear Filters</Button>
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={selectedVideo !== null} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="bg-card border-border text-foreground max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground text-lg">{selectedVideo?.title ?? 'Video Details'}</DialogTitle>
          </DialogHeader>
          {selectedVideo && (
            <div className="space-y-5">
              <div className="aspect-video bg-gradient-to-br from-secondary to-muted rounded-xl flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center">
                  <FiPlay className="h-7 w-7 text-foreground ml-1" />
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Badge className={`${statusStyle(selectedVideo.status)} text-xs border-0`}>{selectedVideo.status}</Badge>
                <Badge variant="outline" className="text-xs border-border text-muted-foreground">{selectedVideo.niche}</Badge>
                <Badge variant="outline" className="text-xs border-border text-muted-foreground">{selectedVideo.duration}</Badge>
                <Badge variant="outline" className="text-xs border-border text-muted-foreground">{selectedVideo.date}</Badge>
              </div>

              {selectedVideo.views !== '--' && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-muted/30 text-center">
                    <FiEye className="h-4 w-4 text-primary mx-auto mb-1" />
                    <p className="text-sm font-bold text-foreground">{selectedVideo.views}</p>
                    <p className="text-[10px] text-muted-foreground">Views</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 text-center">
                    <FiHeart className="h-4 w-4 text-[hsl(326,100%,68%)] mx-auto mb-1" />
                    <p className="text-sm font-bold text-foreground">{selectedVideo.likes}</p>
                    <p className="text-[10px] text-muted-foreground">Likes</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 text-center">
                    <FiShare2 className="h-4 w-4 text-accent mx-auto mb-1" />
                    <p className="text-sm font-bold text-foreground">{selectedVideo.shares}</p>
                    <p className="text-[10px] text-muted-foreground">Shares</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs text-muted-foreground mb-1.5 font-medium">Caption</p>
                <div className="p-3 rounded-xl bg-muted/30 text-sm text-foreground leading-relaxed">{selectedVideo.caption}</div>
              </div>

              <Separator className="bg-border" />

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-muted gap-2" onClick={() => handleCopy(selectedVideo)}>
                  {copiedId === selectedVideo.id ? <><FiCheck className="h-4 w-4" /> Copied</> : <><FiCopy className="h-4 w-4" /> Copy Caption</>}
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                  <FiDownload className="h-4 w-4" /> Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
