'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { FiUser, FiCreditCard, FiCheck, FiSettings, FiBell, FiShield, FiMail, FiGlobe } from 'react-icons/fi'
import { SiInstagram, SiFacebook, SiTiktok } from 'react-icons/si'

const NICHES = ['AI/Tech', 'Motivation', 'Fitness', 'Business', 'Crypto', 'Health', 'Travel', 'Food']
const TONES = ['Motivational', 'Informative', 'Entertaining', 'Dark', 'Luxury']

export default function SettingsSection() {
  const [profile, setProfile] = useState({ name: 'Alex Rivera', email: 'alex@autoviral.studio' })
  const [defaultNiche, setDefaultNiche] = useState('AI/Tech')
  const [defaultTone, setDefaultTone] = useState('Informative')
  const [notifications, setNotifications] = useState({ postSuccess: true, postFail: true, creditLow: true, weeklyReport: false, trendAlerts: true })
  const [saved, setSaved] = useState(false)

  const socialAccounts = [
    { name: 'Instagram', icon: SiInstagram, connected: true, handle: '@alexrivera', followers: '12.8K', color: 'text-[hsl(326,100%,68%)]' },
    { name: 'Facebook', icon: SiFacebook, connected: true, handle: 'Alex Rivera', followers: '5.2K', color: 'text-[hsl(191,97%,70%)]' },
    { name: 'TikTok', icon: SiTiktok, connected: false, handle: '', followers: '--', color: 'text-foreground' },
  ]

  const notificationLabels: Record<string, { label: string; desc: string; icon: React.ElementType }> = {
    postSuccess: { label: 'Post Success', desc: 'When a video is posted successfully', icon: FiCheck },
    postFail: { label: 'Post Failures', desc: 'When a post fails and needs attention', icon: FiShield },
    creditLow: { label: 'Low Credits', desc: 'When credits drop below 100', icon: FiCreditCard },
    weeklyReport: { label: 'Weekly Report', desc: 'Performance summary every Monday', icon: FiMail },
    trendAlerts: { label: 'Trend Alerts', desc: 'Trending topics in your niches', icon: FiGlobe },
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account, connections, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <Card className="bg-card border-border card-elevated">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <FiUser className="h-4 w-4 text-primary" /> Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">{profile.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{profile.name}</p>
                <p className="text-xs text-muted-foreground">{profile.email}</p>
              </div>
            </div>
            <Separator className="bg-border" />
            <div>
              <Label className="text-sm text-muted-foreground mb-1.5 block">Full Name</Label>
              <Input value={profile.name} onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))} className="bg-input border-border text-foreground" />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-1.5 block">Email</Label>
              <Input type="email" value={profile.email} onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))} className="bg-input border-border text-foreground" />
            </div>
            <Button onClick={handleSave} className={`transition-all ${saved ? 'bg-accent text-accent-foreground' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}>
              {saved ? <><FiCheck className="mr-2 h-4 w-4" /> Saved</> : 'Save Profile'}
            </Button>
          </CardContent>
        </Card>

        {/* Credits */}
        <Card className="bg-card border-border card-elevated">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <FiCreditCard className="h-4 w-4 text-primary" /> Credits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-4xl font-bold text-foreground tabular-nums">847</p>
              </div>
              <p className="text-sm text-muted-foreground">of 1,000</p>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div className="bg-gradient-to-r from-primary to-[hsl(191,97%,70%)] rounded-full h-3 transition-all duration-1000" style={{ width: '84.7%' }} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-muted/30 text-center">
                <p className="text-[10px] text-muted-foreground">Daily Limit</p>
                <p className="text-sm font-bold text-foreground">50</p>
                <p className="text-[9px] text-muted-foreground">videos</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/30 text-center">
                <p className="text-[10px] text-muted-foreground">Used Today</p>
                <p className="text-sm font-bold text-foreground">7</p>
                <p className="text-[9px] text-muted-foreground">videos</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/30 text-center">
                <p className="text-[10px] text-muted-foreground">Resets In</p>
                <p className="text-sm font-bold text-foreground">14h 23m</p>
                <p className="text-[9px] text-muted-foreground">remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Accounts */}
        <Card className="bg-card border-border card-elevated lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Social Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {socialAccounts.map(acc => (
                <div key={acc.name} className={`p-4 rounded-xl border transition-all ${acc.connected ? 'border-accent/20 bg-accent/5' : 'border-border bg-muted/30'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <acc.icon className={`h-5 w-5 ${acc.connected ? acc.color : 'text-muted-foreground'}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{acc.name}</p>
                      {acc.connected ? (
                        <p className="text-[11px] text-muted-foreground">{acc.handle}</p>
                      ) : (
                        <p className="text-[11px] text-muted-foreground">Not connected</p>
                      )}
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full ${acc.connected ? 'bg-accent animate-live-pulse' : 'bg-muted-foreground/40'}`} />
                  </div>
                  {acc.connected && (
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <span className="text-[10px] text-muted-foreground">Followers</span>
                      <span className="text-xs font-semibold text-foreground">{acc.followers}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-4">OAuth connections are managed automatically by the posting agents.</p>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="bg-card border-border card-elevated">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <FiSettings className="h-4 w-4 text-primary" /> Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-1.5 block">Default Niche</Label>
              <Select value={defaultNiche} onValueChange={setDefaultNiche}>
                <SelectTrigger className="bg-input border-border text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {NICHES.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-1.5 block">Default Tone</Label>
              <Select value={defaultTone} onValueChange={setDefaultTone}>
                <SelectTrigger className="bg-input border-border text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {TONES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-card border-border card-elevated">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <FiBell className="h-4 w-4 text-primary" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(notifications).map(([key, val]) => {
              const info = notificationLabels[key]
              const IconComp = info?.icon ?? FiBell
              return (
                <div key={key} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <IconComp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-foreground">{info?.label ?? key}</p>
                      <p className="text-[10px] text-muted-foreground">{info?.desc ?? ''}</p>
                    </div>
                  </div>
                  <Switch checked={val} onCheckedChange={(c) => setNotifications(prev => ({ ...prev, [key]: c }))} />
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
