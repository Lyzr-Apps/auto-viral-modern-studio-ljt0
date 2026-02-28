'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { FiShield, FiUsers, FiServer, FiAlertTriangle, FiZap, FiDollarSign, FiActivity, FiRefreshCw, FiCheck, FiClock } from 'react-icons/fi'

interface AdminSectionProps {
  isAdmin: boolean
}

const NICHES = ['AI/Tech', 'Motivation', 'Fitness', 'Business', 'Crypto', 'Health', 'Travel', 'Food']

const MOCK_LOGS = [
  { id: 1, time: '14:32:01', severity: 'INFO', message: 'Render pipeline completed: video_2847.mp4', source: 'renderer' },
  { id: 2, time: '14:31:45', severity: 'INFO', message: 'Caption generated for user alex@email.com', source: 'caption-agent' },
  { id: 3, time: '14:30:22', severity: 'WARN', message: 'Queue depth exceeding threshold: 89 jobs pending', source: 'queue' },
  { id: 4, time: '14:29:58', severity: 'INFO', message: 'Trend data refreshed for niche: AI/Tech', source: 'trend-agent' },
  { id: 5, time: '14:28:10', severity: 'ERROR', message: 'TikTok API rate limit hit - retrying in 60s', source: 'posting' },
  { id: 6, time: '14:27:33', severity: 'INFO', message: 'New user registered: sarah@creator.io', source: 'auth' },
  { id: 7, time: '14:26:15', severity: 'INFO', message: 'Batch render started: 12 videos queued', source: 'renderer' },
  { id: 8, time: '14:25:02', severity: 'WARN', message: 'Credit balance low for user: mike@content.co', source: 'billing' },
  { id: 9, time: '14:23:44', severity: 'INFO', message: 'Schedule triggered: daily_crypto_digest', source: 'scheduler' },
  { id: 10, time: '14:22:19', severity: 'INFO', message: 'Hook optimizer analysis completed batch #4521', source: 'optimizer' },
  { id: 11, time: '14:21:00', severity: 'ERROR', message: 'Instagram token expired for user: jake@mail.com', source: 'posting' },
  { id: 12, time: '14:19:35', severity: 'INFO', message: 'CDN cache purged for 15 video assets', source: 'cdn' },
]

const FEATURES = [
  { key: 'ai_voiceover_v2', label: 'AI Voiceover v2', desc: 'Enhanced voice cloning and emotion control', enabled: true },
  { key: 'auto_captions', label: 'Auto Captions', desc: 'AI-generated subtitle timing', enabled: true },
  { key: 'multi_lang', label: 'Multi-Language', desc: 'Auto-translate to 12+ languages', enabled: false },
  { key: 'ab_testing', label: 'A/B Hook Testing', desc: 'Split-test hooks across platforms', enabled: true },
  { key: 'advanced_analytics', label: 'Advanced Analytics', desc: 'Predictive performance modeling', enabled: false },
  { key: 'bulk_scheduler', label: 'Bulk Scheduler', desc: 'Schedule up to 100 posts at once', enabled: false },
]

function severityColor(severity: string) {
  switch (severity) {
    case 'INFO': return 'text-[hsl(191,97%,70%)]'
    case 'WARN': return 'text-[hsl(31,100%,65%)]'
    case 'ERROR': return 'text-destructive'
    default: return 'text-muted-foreground'
  }
}

function severityBg(severity: string) {
  switch (severity) {
    case 'INFO': return 'bg-[hsl(191,97%,70%)]/10'
    case 'WARN': return 'bg-[hsl(31,100%,65%)]/10'
    case 'ERROR': return 'bg-destructive/10'
    default: return 'bg-muted'
  }
}

export default function AdminSection({ isAdmin }: AdminSectionProps) {
  const [bulkNiche, setBulkNiche] = useState('AI/Tech')
  const [bulkCount, setBulkCount] = useState(5)
  const [featureStates, setFeatureStates] = useState<Record<string, boolean>>(
    Object.fromEntries(FEATURES.map(f => [f.key, f.enabled]))
  )
  const [generating, setGenerating] = useState(false)
  const [logFilter, setLogFilter] = useState('all')

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
            <FiShield className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Admin Access Required</h2>
            <p className="text-sm text-muted-foreground mt-1">Toggle Admin Mode in the sidebar to access this panel.</p>
          </div>
        </div>
      </div>
    )
  }

  const handleBulkGenerate = () => {
    setGenerating(true)
    setTimeout(() => setGenerating(false), 3000)
  }

  const filteredLogs = MOCK_LOGS.filter(log => logFilter === 'all' || log.severity === logFilter)

  const metrics = [
    { label: 'Total Users', value: '2,847', change: '+124', icon: FiUsers, color: 'text-primary', bg: 'bg-gradient-primary' },
    { label: 'Daily Renders', value: '1,234', change: '+8.3%', icon: FiServer, color: 'text-accent', bg: 'bg-gradient-accent' },
    { label: 'Queue Load', value: '67%', change: 'healthy', icon: FiActivity, color: 'text-[hsl(191,97%,70%)]', bg: 'bg-gradient-primary' },
    { label: 'API Failures', value: '0.3%', change: '-0.1%', icon: FiAlertTriangle, color: 'text-[hsl(31,100%,65%)]', bg: 'bg-[hsl(31,100%,65%)]/10' },
    { label: 'Revenue', value: '$18.4K', change: '+$2.1K', icon: FiDollarSign, color: 'text-[hsl(326,100%,68%)]', bg: 'bg-gradient-warm' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FiShield className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">System monitoring and management tools.</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 stagger-children">
        {metrics.map(m => (
          <Card key={m.label} className="bg-card border-border card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-lg ${m.bg} flex items-center justify-center`}>
                  <m.icon className={`h-3.5 w-3.5 ${m.color}`} />
                </div>
                <span className="text-[10px] text-muted-foreground">{m.label}</span>
              </div>
              <p className="text-xl font-bold tracking-tight text-foreground tabular-nums">{m.value}</p>
              <p className="text-[10px] text-accent mt-0.5">{m.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bulk Generator */}
        <Card className="bg-card border-border card-elevated">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <FiZap className="h-4 w-4 text-primary" /> Bulk Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-1.5 block">Niche</Label>
              <Select value={bulkNiche} onValueChange={setBulkNiche}>
                <SelectTrigger className="bg-input border-border text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {NICHES.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-1.5 block">Video Count (1-30)</Label>
              <div className="flex items-center gap-3">
                <Input type="number" min={1} max={30} value={bulkCount} onChange={(e) => setBulkCount(Math.min(30, Math.max(1, parseInt(e.target.value) || 1)))} className="bg-input border-border text-foreground" />
                <Badge variant="outline" className="border-border text-muted-foreground text-[10px] whitespace-nowrap">
                  Est. {Math.ceil(bulkCount * 2.5)} min
                </Badge>
              </div>
            </div>
            <Button onClick={handleBulkGenerate} disabled={generating} className={`w-full transition-all ${generating ? 'bg-accent text-accent-foreground' : 'bg-primary hover:bg-primary/90 text-primary-foreground'} gap-2`}>
              {generating ? (
                <><div className="h-4 w-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" /> Generating {bulkCount} Videos...</>
              ) : (
                <><FiZap className="h-4 w-4" /> Bulk Generate {bulkCount} Videos</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Feature Testing */}
        <Card className="bg-card border-border card-elevated">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Feature Flags</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px]">
              <div className="space-y-2">
                {FEATURES.map(feat => (
                  <div key={feat.key} className={`flex items-center justify-between p-3 rounded-xl transition-all ${featureStates[feat.key] ? 'bg-primary/5 border border-primary/15' : 'bg-muted/20 border border-transparent hover:bg-muted/30'}`}>
                    <div className="flex-1 min-w-0 mr-3">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{feat.label}</p>
                        {featureStates[feat.key] && <Badge className="bg-accent/15 text-accent text-[8px] border-0 h-4">Active</Badge>}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{feat.desc}</p>
                    </div>
                    <Switch checked={featureStates[feat.key] ?? false} onCheckedChange={(c) => setFeatureStates(prev => ({ ...prev, [feat.key]: c }))} />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* System Logs */}
      <Card className="bg-card border-border card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base font-semibold text-foreground">System Logs</CardTitle>
            <div className="flex items-center gap-2">
              {['all', 'INFO', 'WARN', 'ERROR'].map(f => (
                <button key={f} onClick={() => setLogFilter(f)} className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${logFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                  {f === 'all' ? 'All' : f}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[320px]">
            <div className="space-y-1">
              {filteredLogs.map(log => (
                <div key={log.id} className={`flex gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors ${severityBg(log.severity)}`}>
                  <span className="text-[11px] text-muted-foreground w-16 flex-shrink-0 font-mono tabular-nums">{log.time}</span>
                  <span className={`w-11 flex-shrink-0 font-bold text-[10px] ${severityColor(log.severity)}`}>{log.severity}</span>
                  <span className="text-xs text-foreground flex-1">{log.message}</span>
                  <Badge variant="outline" className="text-[8px] border-border text-muted-foreground h-4 flex-shrink-0">{log.source}</Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
