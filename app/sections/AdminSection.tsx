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
import { FiShield, FiUsers, FiServer, FiAlertTriangle, FiZap, FiDollarSign } from 'react-icons/fi'

interface AdminSectionProps {
  isAdmin: boolean
}

const NICHES = ['AI/Tech', 'Motivation', 'Fitness', 'Business', 'Crypto', 'Health', 'Travel', 'Food']

const MOCK_LOGS = [
  { id: 1, time: '14:32:01', severity: 'INFO', message: 'Render pipeline completed: video_2847.mp4' },
  { id: 2, time: '14:31:45', severity: 'INFO', message: 'Caption generated for user alex@email.com' },
  { id: 3, time: '14:30:22', severity: 'WARN', message: 'Queue depth exceeding threshold: 89 jobs pending' },
  { id: 4, time: '14:29:58', severity: 'INFO', message: 'Trend data refreshed for niche: AI/Tech' },
  { id: 5, time: '14:28:10', severity: 'ERROR', message: 'TikTok API rate limit hit - retrying in 60s' },
  { id: 6, time: '14:27:33', severity: 'INFO', message: 'New user registered: sarah@creator.io' },
  { id: 7, time: '14:26:15', severity: 'INFO', message: 'Batch render started: 12 videos queued' },
  { id: 8, time: '14:25:02', severity: 'WARN', message: 'Credit balance low for user: mike@content.co' },
  { id: 9, time: '14:23:44', severity: 'INFO', message: 'Schedule triggered: daily_crypto_digest' },
  { id: 10, time: '14:22:19', severity: 'INFO', message: 'Hook optimizer analysis completed batch #4521' },
]

const FEATURES = [
  { key: 'ai_voiceover', label: 'AI Voiceover v2', enabled: true },
  { key: 'auto_captions', label: 'Auto Captions', enabled: true },
  { key: 'multi_lang', label: 'Multi-Language Support', enabled: false },
  { key: 'ab_testing', label: 'A/B Hook Testing', enabled: true },
  { key: 'advanced_analytics', label: 'Advanced Analytics', enabled: false },
]

function severityColor(severity: string) {
  switch (severity) {
    case 'INFO': return 'text-[hsl(191,97%,70%)]'
    case 'WARN': return 'text-[hsl(31,100%,65%)]'
    case 'ERROR': return 'text-destructive'
    default: return 'text-muted-foreground'
  }
}

export default function AdminSection({ isAdmin }: AdminSectionProps) {
  const [bulkNiche, setBulkNiche] = useState('AI/Tech')
  const [bulkCount, setBulkCount] = useState(5)
  const [featureStates, setFeatureStates] = useState<Record<string, boolean>>(
    Object.fromEntries(FEATURES.map(f => [f.key, f.enabled]))
  )

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <FiShield className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-lg font-semibold text-foreground">Admin Access Required</h2>
          <p className="text-sm text-muted-foreground">Toggle admin mode in the header to view this section.</p>
        </div>
      </div>
    )
  }

  const metrics = [
    { label: 'Total Users', value: '2,847', icon: FiUsers, color: 'text-primary' },
    { label: 'Daily Renders', value: '1,234', icon: FiServer, color: 'text-accent' },
    { label: 'Queue Load', value: '67%', icon: FiZap, color: 'text-[hsl(191,97%,70%)]' },
    { label: 'API Failures', value: '0.3%', icon: FiAlertTriangle, color: 'text-[hsl(31,100%,65%)]' },
    { label: 'Revenue', value: '$18.4K', icon: FiDollarSign, color: 'text-[hsl(326,100%,68%)]' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <FiShield className="h-6 w-6 text-primary" /> Admin Panel
        </h1>
        <p className="text-sm text-muted-foreground mt-1">System monitoring and management tools.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {metrics.map(m => (
          <Card key={m.label} className="bg-card border-border card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <m.icon className={`h-4 w-4 ${m.color}`} />
                <span className="text-xs text-muted-foreground">{m.label}</span>
              </div>
              <p className="text-xl font-bold tracking-tight text-foreground">{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border card-elevated">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Bulk Generator</CardTitle>
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
              <Input type="number" min={1} max={30} value={bulkCount} onChange={(e) => setBulkCount(Math.min(30, Math.max(1, parseInt(e.target.value) || 1)))} className="bg-input border-border text-foreground" />
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <FiZap className="mr-2 h-4 w-4" /> Bulk Generate {bulkCount} Videos
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border card-elevated">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Feature Testing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {FEATURES.map(feat => (
              <div key={feat.key} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                <span className="text-sm text-foreground">{feat.label}</span>
                <Switch checked={featureStates[feat.key] ?? false} onCheckedChange={(c) => setFeatureStates(prev => ({ ...prev, [feat.key]: c }))} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border card-elevated">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">System Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-1 font-mono text-xs">
              {MOCK_LOGS.map(log => (
                <div key={log.id} className="flex gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <span className="text-muted-foreground w-16 flex-shrink-0">{log.time}</span>
                  <span className={`w-12 flex-shrink-0 font-semibold ${severityColor(log.severity)}`}>{log.severity}</span>
                  <span className="text-foreground">{log.message}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
