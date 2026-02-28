'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { FiPlay, FiDownload, FiCalendar, FiCopy, FiCheck, FiArrowRight, FiArrowLeft, FiEdit3, FiFilm, FiMusic, FiClock, FiImage, FiType, FiVideo, FiMic, FiLayers, FiHash, FiRefreshCw } from 'react-icons/fi'
import { SiInstagram, SiTiktok, SiYoutube, SiFacebook } from 'react-icons/si'

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

const TONES = [
  { value: 'Motivational', icon: FiPlay, desc: 'Inspiring energy' },
  { value: 'Informative', icon: FiType, desc: 'Clear & factual' },
  { value: 'Entertaining', icon: FiMusic, desc: 'Fun & engaging' },
  { value: 'Dark', icon: FiLayers, desc: 'Bold & edgy' },
  { value: 'Luxury', icon: FiImage, desc: 'Premium & sleek' },
]

const PLATFORMS_LIST = [
  { name: 'Instagram', icon: SiInstagram, color: 'text-[hsl(326,100%,68%)]' },
  { name: 'TikTok', icon: SiTiktok, color: 'text-foreground' },
  { name: 'YouTube Shorts', icon: SiYoutube, color: 'text-destructive' },
  { name: 'Facebook', icon: SiFacebook, color: 'text-[hsl(191,97%,70%)]' },
]

const LENGTHS = [
  { value: '30', label: '30s', desc: 'Quick hook' },
  { value: '45', label: '45s', desc: 'Standard' },
  { value: '60', label: '60s', desc: 'Deep dive' },
]

const STEPS = [
  { num: 1, label: 'Script & Scenes', icon: FiEdit3 },
  { num: 2, label: 'Review & Render', icon: FiFilm },
  { num: 3, label: 'Caption & Post', icon: FiHash },
]

function visualTypeIcon(type: string) {
  const t = (type ?? '').toLowerCase()
  if (t.includes('text') || t.includes('title')) return FiType
  if (t.includes('video') || t.includes('footage') || t.includes('clip')) return FiVideo
  if (t.includes('image') || t.includes('photo')) return FiImage
  if (t.includes('voice') || t.includes('narrat')) return FiMic
  return FiLayers
}

export default function CreateVideoSection({ onNavigateToTab, prefillTopic }: CreateVideoSectionProps) {
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('Informative')
  const [platforms, setPlatforms] = useState<string[]>(['Instagram', 'TikTok'])
  const [length, setLength] = useState('45')
  const [step, setStep] = useState(1)

  const [scriptLoading, setScriptLoading] = useState(false)
  const [scriptError, setScriptError] = useState<string | null>(null)
  const [scriptData, setScriptData] = useState<ScriptData | null>(null)
  const [editedHook, setEditedHook] = useState('')
  const [editedScenes, setEditedScenes] = useState<SceneItem[]>([])

  const [renderPhase, setRenderPhase] = useState<'idle' | 'rendering' | 'done'>('idle')
  const [renderProgress, setRenderProgress] = useState(0)
  const renderIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [captionLoading, setCaptionLoading] = useState(false)
  const [captionError, setCaptionError] = useState<string | null>(null)
  const [captionData, setCaptionData] = useState<PlatformCaption[]>([])
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null)
  const [downloadStarted, setDownloadStarted] = useState(false)
  const [posted, setPosted] = useState(false)

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
        setStep(2)
      } else {
        setScriptError(result?.error ?? 'Failed to generate script.')
      }
    } catch {
      setScriptError('Network error. Please try again.')
    } finally {
      setScriptLoading(false)
    }
  }

  const handleRender = useCallback(() => {
    if (renderIntervalRef.current) clearInterval(renderIntervalRef.current)
    setRenderPhase('rendering')
    setRenderProgress(0)
    setPosted(false)
    setDownloadStarted(false)
    let progress = 0
    renderIntervalRef.current = setInterval(() => {
      progress += 4
      if (progress >= 100) {
        progress = 100
        if (renderIntervalRef.current) clearInterval(renderIntervalRef.current)
        renderIntervalRef.current = null
        setRenderProgress(100)
        setRenderPhase('done')
        setStep(3)
      } else {
        setRenderProgress(progress)
      }
    }, 150)
  }, [])

  useEffect(() => {
    return () => {
      if (renderIntervalRef.current) clearInterval(renderIntervalRef.current)
    }
  }, [])

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
    } catch {
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

  const totalSceneDuration = editedScenes.reduce((sum, s) => sum + (s?.duration_seconds ?? 0), 0)

  const handleDownload = () => {
    setDownloadStarted(true)
    setTimeout(() => setDownloadStarted(false), 2500)
  }

  const handlePostNow = () => {
    setPosted(true)
    setTimeout(() => {
      onNavigateToTab('library')
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Create Video</h1>
          <p className="text-sm text-muted-foreground mt-1">Generate scripts, render videos, and craft platform captions.</p>
        </div>
        {step > 1 && (
          <Button variant="outline" size="sm" onClick={() => { setStep(1); setScriptData(null); setRenderPhase('idle'); setCaptionData([]); }} className="border-border text-muted-foreground hover:text-foreground gap-1.5">
            <FiRefreshCw className="h-3.5 w-3.5" /> Start Over
          </Button>
        )}
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, idx) => (
          <React.Fragment key={s.num}>
            <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all ${step === s.num ? 'bg-primary/15 border border-primary/30' : step > s.num ? 'bg-accent/10 border border-accent/20' : 'bg-muted/30 border border-transparent'}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${step === s.num ? 'bg-primary text-primary-foreground' : step > s.num ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                {step > s.num ? <FiCheck className="h-3.5 w-3.5" /> : s.num}
              </div>
              <div className="hidden sm:block">
                <p className={`text-xs font-medium ${step === s.num ? 'text-primary' : step > s.num ? 'text-accent' : 'text-muted-foreground'}`}>{s.label}</p>
              </div>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 ${step > s.num ? 'bg-accent/40' : 'bg-border'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Input Form */}
      {step === 1 && (
        <Card className="bg-card border-border card-elevated animate-fade-in-up">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <FiEdit3 className="h-4 w-4 text-primary" /> Video Brief
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label className="text-sm text-muted-foreground mb-1.5 block">Topic / Idea</Label>
              <Textarea placeholder="e.g. 5 AI tools that will replace your job in 2025..." value={topic} onChange={(e) => setTopic(e.target.value)} className="bg-input border-border text-foreground resize-none" rows={3} />
              <p className="text-[10px] text-muted-foreground mt-1.5">{topic.length}/200 characters</p>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground mb-2.5 block">Tone & Style</Label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {TONES.map(t => (
                  <button key={t.value} onClick={() => setTone(t.value)} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${tone === t.value ? 'border-primary bg-primary/10 glow-border' : 'border-border bg-muted/30 hover:border-primary/30'}`}>
                    <t.icon className={`h-4 w-4 ${tone === t.value ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-xs font-medium ${tone === t.value ? 'text-primary' : 'text-foreground'}`}>{t.value}</span>
                    <span className="text-[9px] text-muted-foreground">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label className="text-sm text-muted-foreground mb-2.5 block">Duration</Label>
                <div className="flex gap-2">
                  {LENGTHS.map(l => (
                    <button key={l.value} onClick={() => setLength(l.value)} className={`flex-1 flex flex-col items-center gap-0.5 py-3 rounded-xl border transition-all ${length === l.value ? 'border-primary bg-primary/10 glow-border' : 'border-border bg-muted/30 hover:border-primary/30'}`}>
                      <span className={`text-sm font-bold ${length === l.value ? 'text-primary' : 'text-foreground'}`}>{l.label}</span>
                      <span className="text-[9px] text-muted-foreground">{l.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground mb-2.5 block">Platforms</Label>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS_LIST.map(p => (
                    <button key={p.name} onClick={() => togglePlatform(p.name)} className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${platforms.includes(p.name) ? 'border-primary/30 bg-primary/5' : 'border-border bg-muted/30 hover:border-primary/20'}`}>
                      <p.icon className={`h-3.5 w-3.5 ${platforms.includes(p.name) ? p.color : 'text-muted-foreground'}`} />
                      <span className={`text-xs ${platforms.includes(p.name) ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{p.name.replace(' Shorts', '')}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button onClick={handleGenerateScript} disabled={scriptLoading || !topic.trim()} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 text-sm gap-2">
              {scriptLoading ? (
                <>
                  <div className="relative">
                    <div className="h-4 w-4 border-2 border-primary-foreground/30 rounded-full" />
                    <div className="absolute inset-0 h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  </div>
                  Generating Script...
                </>
              ) : (
                <><FiFilm className="h-4 w-4" /> Generate Script & Scenes</>
              )}
            </Button>

            {scriptError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-between">
                <p className="text-sm text-destructive">{scriptError}</p>
                <Button variant="ghost" size="sm" onClick={handleGenerateScript} className="text-destructive hover:text-destructive/80 gap-1">
                  <FiRefreshCw className="h-3 w-3" /> Retry
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Script Editor */}
      {step === 2 && scriptData && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Hook Line */}
          <Card className="bg-card border-border card-elevated">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <FiMic className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Hook Line</h3>
                </div>
                <div className="flex gap-2">
                  {scriptData?.music_mood && (
                    <Badge variant="outline" className="text-[10px] border-border text-muted-foreground gap-1">
                      <FiMusic className="h-2.5 w-2.5" /> {scriptData.music_mood}
                    </Badge>
                  )}
                  {totalSceneDuration > 0 && (
                    <Badge variant="outline" className="text-[10px] border-border text-muted-foreground gap-1">
                      <FiClock className="h-2.5 w-2.5" /> {totalSceneDuration}s
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-[10px] border-border text-muted-foreground gap-1">
                    <FiLayers className="h-2.5 w-2.5" /> {editedScenes.length} scenes
                  </Badge>
                </div>
              </div>
              <Textarea value={editedHook} onChange={(e) => setEditedHook(e.target.value)} className="bg-input border-border text-foreground resize-none text-base font-medium" rows={2} placeholder="Your attention-grabbing opening line..." />
              {scriptData?.pacing_notes && (
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-[10px] uppercase tracking-wider text-primary mb-1">Pacing Notes</p>
                  <p className="text-xs text-foreground">{scriptData.pacing_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scene Cards */}
          <ScrollArea className="max-h-[500px]">
            <div className="space-y-3">
              {editedScenes.map((scene, idx) => {
                const VisualIcon = visualTypeIcon(scene?.visual_type ?? '')
                return (
                  <Card key={idx} className="bg-card border-border card-interactive group overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex">
                        {/* Scene number strip */}
                        <div className="w-12 bg-primary/10 flex flex-col items-center justify-center gap-1 flex-shrink-0">
                          <span className="text-lg font-bold text-primary">{scene?.scene_number ?? idx + 1}</span>
                          {(scene?.duration_seconds ?? 0) > 0 && (
                            <span className="text-[9px] text-primary/70">{scene.duration_seconds}s</span>
                          )}
                        </div>
                        <div className="flex-1 p-4 space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            {scene?.visual_type && (
                              <Badge className="bg-primary/15 text-primary text-[10px] border-0 gap-1">
                                <VisualIcon className="h-2.5 w-2.5" /> {scene.visual_type}
                              </Badge>
                            )}
                            {scene?.transition && (
                              <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">{scene.transition}</Badge>
                            )}
                          </div>
                          <div>
                            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Visual Description</Label>
                            <Textarea value={scene?.visual_description ?? ''} onChange={(e) => updateScene(idx, 'visual_description', e.target.value)} className="bg-input border-border text-foreground resize-none text-sm" rows={2} />
                          </div>
                          <div>
                            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Voiceover</Label>
                            <Textarea value={scene?.voiceover_text ?? ''} onChange={(e) => updateScene(idx, 'voiceover_text', e.target.value)} className="bg-input border-border text-foreground resize-none text-sm italic" rows={2} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>

          {/* Render Button */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)} className="border-border text-muted-foreground hover:text-foreground gap-1.5">
              <FiArrowLeft className="h-4 w-4" /> Back
            </Button>
            {renderPhase === 'idle' && (
              <Button onClick={handleRender} className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 h-11 gap-2">
                <FiPlay className="h-4 w-4" /> Render Video
              </Button>
            )}
            {renderPhase === 'rendering' && (
              <div className="flex-1 space-y-2 p-3 rounded-xl bg-muted/30 border border-border">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="h-4 w-4 border-2 border-accent/30 rounded-full" />
                      <div className="absolute inset-0 h-4 w-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    </div>
                    <span className="text-muted-foreground">Rendering video...</span>
                  </div>
                  <span className="text-foreground font-bold tabular-nums">{renderProgress}%</span>
                </div>
                <Progress value={renderProgress} className="h-2" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Caption & Post */}
      {step === 3 && renderPhase === 'done' && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Video Preview */}
          <Card className="bg-card border-border card-elevated overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video max-h-[280px] bg-gradient-to-br from-secondary via-muted to-secondary flex items-center justify-center relative">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center mx-auto glow-primary">
                    <FiPlay className="h-7 w-7 text-primary ml-1" />
                  </div>
                  <p className="text-sm text-muted-foreground">Video preview</p>
                </div>
                <Badge className="absolute top-3 right-3 bg-accent/20 text-accent border-0 text-xs gap-1">
                  <FiCheck className="h-3 w-3" /> Rendered
                </Badge>
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <Badge variant="outline" className="text-[10px] border-foreground/20 text-foreground/80 bg-background/40 backdrop-blur-sm">{length}s</Badge>
                  <Badge variant="outline" className="text-[10px] border-foreground/20 text-foreground/80 bg-background/40 backdrop-blur-sm">{tone}</Badge>
                </div>
              </div>
              <div className="p-4 flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleDownload} disabled={downloadStarted} className="flex-1 min-w-[120px] border-border text-foreground hover:bg-muted gap-2">
                  {downloadStarted ? <><FiCheck className="h-4 w-4 text-accent" /> Downloading...</> : <><FiDownload className="h-4 w-4" /> Download</>}
                </Button>
                <Button variant="outline" onClick={() => onNavigateToTab('scheduler')} className="flex-1 min-w-[120px] border-border text-foreground hover:bg-muted gap-2">
                  <FiCalendar className="h-4 w-4" /> Schedule
                </Button>
                <Button onClick={handlePostNow} disabled={posted} className={`flex-1 min-w-[120px] gap-2 ${posted ? 'bg-accent text-accent-foreground' : 'bg-accent text-accent-foreground hover:bg-accent/90'}`}>
                  {posted ? <><FiCheck className="h-4 w-4" /> Posted</> : <><FiArrowRight className="h-4 w-4" /> Post Now</>}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Caption Generation */}
          {captionData.length === 0 && !captionLoading && (
            <Button onClick={handleGenerateCaptions} disabled={captionLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 gap-2">
              <FiHash className="h-4 w-4" /> Generate Captions & Hashtags
            </Button>
          )}

          {captionLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="relative">
                <div className="h-10 w-10 border-3 border-primary/30 rounded-full" />
                <div className="absolute inset-0 h-10 w-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Crafting platform-optimized captions</p>
                <p className="text-xs text-muted-foreground mt-1">Analyzing hashtag trends & engagement patterns...</p>
              </div>
            </div>
          )}

          {captionError && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-between">
              <p className="text-sm text-destructive">{captionError}</p>
              <Button variant="ghost" size="sm" onClick={handleGenerateCaptions} className="text-destructive hover:text-destructive/80 gap-1">
                <FiRefreshCw className="h-3 w-3" /> Retry
              </Button>
            </div>
          )}

          {captionData.length > 0 && (
            <div className="space-y-3 animate-fade-in-up">
              <div className="flex items-center gap-2">
                <FiHash className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Platform Captions</h3>
                <Badge variant="outline" className="border-border text-muted-foreground text-[10px]">{captionData.length} platforms</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {captionData.map((pc, idx) => {
                  const platformInfo = PLATFORMS_LIST.find(p => (pc?.platform ?? '').toLowerCase().includes(p.name.toLowerCase().replace(' shorts', '')))
                  const PlatIcon = platformInfo?.icon ?? FiHash
                  return (
                    <Card key={idx} className="bg-card border-border card-interactive overflow-hidden">
                      <CardContent className="p-0">
                        <div className={`px-4 py-2.5 flex items-center justify-between border-b border-border ${platformInfo ? 'bg-muted/30' : 'bg-muted/20'}`}>
                          <div className="flex items-center gap-2">
                            <PlatIcon className={`h-4 w-4 ${platformInfo?.color ?? 'text-primary'}`} />
                            <span className="text-sm font-medium text-foreground">{pc?.platform ?? 'Unknown'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {pc?.best_posting_time && (
                              <Badge variant="outline" className="text-[9px] border-border text-muted-foreground gap-1">
                                <FiClock className="h-2 w-2" /> {pc.best_posting_time}
                              </Badge>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => handleCopyCaption(pc?.platform ?? '', `${pc?.caption ?? ''}\n\n${Array.isArray(pc?.hashtags) ? pc.hashtags.join(' ') : ''}`)} className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground">
                              {copiedPlatform === pc?.platform ? <FiCheck className="h-3.5 w-3.5 text-accent" /> : <FiCopy className="h-3.5 w-3.5" />}
                            </Button>
                          </div>
                        </div>
                        <div className="p-4 space-y-3">
                          <p className="text-sm text-foreground leading-relaxed">{pc?.caption ?? ''}</p>
                          {Array.isArray(pc?.hashtags) && pc.hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {pc.hashtags.map((tag, ti) => (
                                <span key={ti} className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">{String(tag ?? '').startsWith('#') ? tag : `#${tag}`}</span>
                              ))}
                            </div>
                          )}
                          {pc?.call_to_action && (
                            <div className="p-2 rounded-lg bg-accent/5 border border-accent/10">
                              <p className="text-[10px] uppercase tracking-wider text-accent mb-0.5">Call to Action</p>
                              <p className="text-xs text-foreground">{pc.call_to_action}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setStep(2)} className="border-border text-muted-foreground hover:text-foreground gap-1.5">
              <FiArrowLeft className="h-4 w-4" /> Back to Editor
            </Button>
            <Button onClick={() => onNavigateToTab('library')} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              View in Library <FiArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
