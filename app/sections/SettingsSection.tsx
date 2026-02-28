'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { FiUser, FiCreditCard, FiCheck, FiSettings } from 'react-icons/fi'
import { SiInstagram, SiFacebook, SiTiktok } from 'react-icons/si'

const NICHES = ['AI/Tech', 'Motivation', 'Fitness', 'Business', 'Crypto', 'Health', 'Travel', 'Food']
const TONES = ['Motivational', 'Informative', 'Entertaining', 'Dark', 'Luxury']

export default function SettingsSection() {
  const [profile, setProfile] = useState({ name: 'Alex Rivera', email: 'alex@autoviral.studio' })
  const [defaultNiche, setDefaultNiche] = useState('AI/Tech')
  const [defaultTone, setDefaultTone] = useState('Informative')
  const [notifications, setNotifications] = useState({ postSuccess: true, postFail: true, creditLow: true, weeklyReport: false })
  const [saved, setSaved] = useState(false)

  const socialAccounts = [
    { name: 'Instagram', icon: SiInstagram, connected: true, handle: '@alexrivera' },
    { name: 'Facebook', icon: SiFacebook, connected: true, handle: 'Alex Rivera' },
    { name: 'TikTok', icon: SiTiktok, connected: false, handle: '' },
  ]

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
        <Card className="bg-card border-border card-elevated">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <FiUser className="h-4 w-4 text-primary" /> Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-1.5 block">Full Name</Label>
              <Input value={profile.name} onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))} className="bg-input border-border text-foreground" />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-1.5 block">Email</Label>
              <Input type="email" value={profile.email} onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))} className="bg-input border-border text-foreground" />
            </div>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {saved ? <><FiCheck className="mr-2 h-4 w-4" /> Saved!</> : 'Save Profile'}
            </Button>
          </CardContent>
        </Card>

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
                <p className="text-3xl font-bold text-foreground">847</p>
              </div>
              <p className="text-sm text-muted-foreground">of 1,000</p>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div className="bg-primary rounded-full h-2.5" style={{ width: '84.7%' }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-muted/40">
                <p className="text-xs text-muted-foreground">Daily Limit</p>
                <p className="text-sm font-semibold text-foreground">50 videos</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/40">
                <p className="text-xs text-muted-foreground">Resets In</p>
                <p className="text-sm font-semibold text-foreground">14h 23m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border card-elevated lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Social Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {socialAccounts.map(acc => (
                <div key={acc.name} className="flex items-center gap-3 p-4 rounded-xl bg-muted/40">
                  <acc.icon className="h-6 w-6 text-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{acc.name}</p>
                    {acc.connected ? (
                      <p className="text-xs text-muted-foreground truncate">{acc.handle}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Not connected</p>
                    )}
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full ${acc.connected ? 'bg-accent' : 'bg-muted-foreground/40'}`} />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">OAuth connections are managed automatically by the posting agents.</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border card-elevated lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <FiSettings className="h-4 w-4 text-primary" /> Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
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
              </div>
              <div className="space-y-3">
                <Label className="text-sm text-muted-foreground block">Notifications</Label>
                {Object.entries(notifications).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                    <span className="text-sm text-foreground">{key === 'postSuccess' ? 'Post Success' : key === 'postFail' ? 'Post Failures' : key === 'creditLow' ? 'Low Credits' : 'Weekly Report'}</span>
                    <Switch checked={val} onCheckedChange={(c) => setNotifications(prev => ({ ...prev, [key]: c }))} />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
