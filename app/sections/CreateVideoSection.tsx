'use client'

import React, { useState, useEffect } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { FiPlay, FiDownload, FiCalendar, FiCopy, FiCheck, FiArrowRight, FiEdit3, FiFilm } from 'react-icons/fi'

const SCRIPT_AGENT_ID = '69a3270589a7585c80443946'
const CAPTION_AGENT_ID = '69a32706931679f19b7d6d2b'

interface CreateVideoSectionProps {
  onNavigateToTab: (tab: string) => void
  prefillTopic: string
}

interface SceneItem {
  scene_number?: number
  visual_type?: string
  visual_description?: string
  voiceover_text?: string
  duration_seconds?: number
  transition?: string
}

interface ScriptData {
  hook_line?: string
  total_duration?: number
  music_mood?: string
  pacing_notes?: string
  scenes?: SceneItem[]
}

interface PlatformCaption {
  platform?: string
  caption?: string
  hashtags?: string[]
  call_to_action?: string
  best_posting_time?: string
}

const TONES = ['Motivational', 'Informative', 'Entertaining', 'Dark', 'Luxury']
const PLATFORMS_LIST = ['Instagram', 'TikTok', 'Facebook', 'YouTube Shorts']
const LENGTHS = ['30', '45', '60']

export default function CreateVideoSection({ onNavigateToTab, prefillTopic }: CreateVideoSectionProps) {
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('Informative')
  const [platforms, setPlatforms] = useState<string[]>(['Instagram', 'TikTok'])
  const [length, setLength] = useState('45')

  const [scriptLoading, setScriptLoading] = useState(false)
  const [scriptError, setScriptError] = useState<string | null>(null)
  const [scriptData, setScriptData] = useState<ScriptData | null>(null)
  const [editedHook, setEditedHook] = useState('')
  const [editedScenes, setEditedScenes] = useState<SceneItem[]>([])

  const [renderPhase, setRenderPhase] = useState<'idle' | 'rendering' | 'done'>('idle')
  const [renderProgress, setRenderProgress] = useState(0)

  const [captionLoading, setCaptionLoading] = useState(false)
  const [captionError, setCaptionError] = useState<string | null>(null)
  const [captionData, setCaptionData] = useState<PlatformCaption[]>([])
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null)

  useEffect(() => {
    if (prefillTopic) setTopic(prefillTopic)
  }, [prefillTopic])

  const togglePlatform = (p: string) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  const handleGenerateScript = async () => {
    if (!topic.trim()) return
    setScriptLoading(true)
    setScriptError(null)
    setScriptData(null)
    setRenderPhase('idle')
    setCaptionData([])

    try {
      const message = `Generate a ${length}-second ${tone} short-form video script for the topic: "${topic}". Target platforms: ${platforms.join(', ')}.`
      const result = await callAIAgent(message, SCRIPT_AGENT_ID)
      if (result.success && result?.response?.result) {
        const d = result.response.result as ScriptData
        setScriptData(d)
        setEditedHook(d?.hook_line ?? '')
        setEditedScenes(Array.isArray(d?.scenes) ? [...d.scenes] : [])
      } else {
        setScriptError(result?.error ?? 'Failed to generate script.')
      }
    } catch (err) {
      setScriptError('Network error. Please try again.')
    } finally {
      setScriptLoading(false)
    }
  }

  const handleRender = () => {
    setRenderPhase('rendering')
    setRenderProgress(0)
    const interval = setInterval(() => {
      setRenderProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setRenderPhase('done'); return 100 }
        return prev + 4
      })
    }, 150)
  }

  const handleGenerateCaptions = async () => {
    setCaptionLoading(true)
    setCaptionError(null)
    setCaptionData([])

    try {
      const message = `Generate platform-optimized captions and hashtags for a ${tone} video about "${topic}". Target platforms: ${platforms.join(', ')}.`
      const result = await callAIAgent(message, CAPTION_AGENT_ID)
      if (result.success && result?.response?.result) {
        const d = result.response.result
        setCaptionData(Array.isArray(d?.platforms) ? d.platforms : [])
      } else {
        setCaptionError(result?.error ?? 'Failed to generate captions.')
      }
    } catch (err) {
      setCaptionError('Network error. Please try again.')
    } finally {
      setCaptionLoading(false)
    }
  }

  const handleCopyCaption = (platform: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedPlatform(platform)
    setTimeout(() => setCopiedPlatform(null), 2000)
  }

  const updateScene = (idx: number, field: string, value: string) => {
    setEditedScenes(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Create Video</h1>
        <p className="text-sm text-muted-foreground mt-1">Generate scripts, render videos, and craft platform captions.</p>
      </div>

      {/* Phase 1: Input Form */}
      <Card className="bg-card border-border card-elevated">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <FiEdit3 className="h-4 w-4 text-primary" /> Video Brief
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label className="text-sm text-muted-foreground mb-1.5 block">Topic</Label>
            <Input placeholder="e.g. 5 AI tools that will replace your job" value={topic} onChange={(e) => setTopic(e.target.value)} className="bg-input border-border text-foreground" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-1.5 block">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="bg-input border-border text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {TONES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-1.5 block">Duration</Label>
              <div className="flex gap-2">
                {LENGTHS.map(l => (
                  <button key={l} onClick={() => setLength(l)} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${length === l ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                    {l}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm text-muted-foreground mb-1.5 block">Platforms</Label>
            <div className="flex flex-wrap gap-3">
              {PLATFORMS_LIST.map(p => (
                <label key={p} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={platforms.includes(p)} onCheckedChange={() => togglePlatform(p)} />
                  <span className="text-sm text-foreground">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <Button onClick={handleGenerateScript} disabled={scriptLoading || !topic.trim()} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            {scriptLoading ? <><div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" /> Generating...</> : <><FiFilm className="mr-2 h-4 w-4" /> Generate Script & Scenes</>}
          </Button>

          {scriptError && <p className="text-sm text-destructive text-center">{scriptError}</p>}
        </CardContent>
      </Card>

      {/* Phase 2: Script Editor */}
      {scriptData && (
        <Card className="bg-card border-border card-elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-foreground">Script Editor</CardTitle>
              <div className="flex gap-2">
                {scriptData?.music_mood && <Badge variant="outline" className="text-xs border-border text-muted-foreground">Mood: {scriptData.music_mood}</Badge>}
                {scriptData?.total_duration && <Badge variant="outline" className="text-xs border-border text-muted-foreground">{scriptData.total_duration}s total</Badge>}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label className="text-sm text-muted-foreground mb-1.5 block">Hook Line</Label>
              <Textarea value={editedHook} onChange={(e) => setEditedHook(e.target.value)} className="bg-input border-border text-foreground resize-none" rows={2} />
            </div>

            {scriptData?.pacing_notes && (
              <div className="p-3 rounded-xl bg-muted/40">
                <p className="text-xs text-muted-foreground mb-1">Pacing Notes</p>
                <p className="text-sm text-foreground">{scriptData.pacing_notes}</p>
              </div>
            )}

            <ScrollArea className="max-h-[400px]">
              <div className="space-y-4">
                {editedScenes.map((scene, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/20 text-primary text-xs border-0">Scene {scene?.scene_number ?? idx + 1}</Badge>
                      {scene?.visual_type && <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">{scene.visual_type}</Badge>}
                      {(scene?.duration_seconds ?? 0) > 0 && <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">{scene.duration_seconds}s</Badge>}
                      {scene?.transition && <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">{scene.transition}</Badge>}
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Visual Description</Label>
                      <Textarea value={scene?.visual_description ?? ''} onChange={(e) => updateScene(idx, 'visual_description', e.target.value)} className="bg-input border-border text-foreground resize-none text-sm" rows={2} />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Voiceover</Label>
                      <Textarea value={scene?.voiceover_text ?? ''} onChange={(e) => updateScene(idx, 'voiceover_text', e.target.value)} className="bg-input border-border text-foreground resize-none text-sm" rows={2} />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {renderPhase === 'idle' && (
              <Button onClick={handleRender} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <FiPlay className="mr-2 h-4 w-4" /> Render Video
              </Button>
            )}
            {renderPhase === 'rendering' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rendering...</span>
                  <span className="text-foreground font-medium">{renderProgress}%</span>
                </div>
                <Progress value={renderProgress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Phase 3: After Render */}
      {renderPhase === 'done' && (
        <Card className="bg-card border-border card-elevated">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Video Ready</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="aspect-video max-h-[300px] bg-secondary rounded-xl flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <FiPlay className="h-7 w-7 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Video preview</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="flex-1 min-w-[140px] border-border text-foreground hover:bg-muted">
                <FiDownload className="mr-2 h-4 w-4" /> Download MP4
              </Button>
              <Button variant="outline" onClick={() => onNavigateToTab('scheduler')} className="flex-1 min-w-[140px] border-border text-foreground hover:bg-muted">
                <FiCalendar className="mr-2 h-4 w-4" /> Schedule Post
              </Button>
              <Button className="flex-1 min-w-[140px] bg-accent text-accent-foreground hover:bg-accent/90">
                <FiArrowRight className="mr-2 h-4 w-4" /> Post Now
              </Button>
            </div>

            {captionData.length === 0 && !captionLoading && (
              <Button onClick={handleGenerateCaptions} disabled={captionLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {captionLoading ? <><div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" /> Generating...</> : 'Generate Caption & Hashtags'}
              </Button>
            )}

            {captionLoading && (
              <div className="flex flex-col items-center py-6 gap-2">
                <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Generating captions...</p>
              </div>
            )}

            {captionError && <p className="text-sm text-destructive text-center">{captionError}</p>}

            {captionData.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Platform Captions</h3>
                {captionData.map((pc, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-muted/30 border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-primary/20 text-primary text-xs border-0">{pc?.platform ?? 'Unknown'}</Badge>
                      <div className="flex items-center gap-2">
                        {pc?.best_posting_time && <span className="text-[10px] text-muted-foreground">Best: {pc.best_posting_time}</span>}
                        <Button variant="ghost" size="sm" onClick={() => handleCopyCaption(pc?.platform ?? '', `${pc?.caption ?? ''}\n\n${Array.isArray(pc?.hashtags) ? pc.hashtags.join(' ') : ''}`)} className="h-7 px-2 text-muted-foreground hover:text-foreground">
                          {copiedPlatform === pc?.platform ? <FiCheck className="h-3.5 w-3.5" /> : <FiCopy className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-foreground">{pc?.caption ?? ''}</p>
                    {Array.isArray(pc?.hashtags) && pc.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {pc.hashtags.map((tag, ti) => (
                          <span key={ti} className="text-xs text-primary">{String(tag ?? '').startsWith('#') ? tag : `#${tag}`}</span>
                        ))}
                      </div>
                    )}
                    {pc?.call_to_action && (
                      <p className="text-xs text-accent italic">CTA: {pc.call_to_action}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
