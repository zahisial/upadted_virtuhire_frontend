'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { candidatesAPI, hiringAPI } from '@/lib/api'

type Candidate = {
  id: number
  full_name: string
  full_name_ar: string
  category: string
  work_preference: string
  experience: string
  skills: string[]
  rating: number
  voice_intro: string | null
  is_featured: boolean
  monthly_rate: number
}

export default function TalentPage() {
  const { t, isRTL } = useLanguage()
  const router = useRouter()

  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [shortlisted, setShortlisted] = useState<number[]>([])
  const [interviewRequested, setInterviewRequested] = useState<number[]>([])
  const [playingAudio, setPlayingAudio] = useState<number | null>(null)
  const [filterCat, setFilterCat] = useState('')
  const [batchNum, setBatchNum] = useState(1)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [hireRequestId, setHireRequestId] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const params: any = {}
        if (filterCat) params.category = filterCat
        const data = await candidatesAPI.browse(params)
        setCandidates(data.results || data || [])
        setTotalCount(data.count || (data.results || data || []).length)

        // Get or create a hire request
        const requests = await hiringAPI.getRequests()
        if (requests.length > 0) {
          const active = requests.find((r: any) => r.status === 'pending' || r.status === 'active')
          if (active) setHireRequestId(active.id)
        }
      } catch (err) {
        console.error('Failed to load candidates:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [filterCat])

  const handleShortlist = async (candidateId: number) => {
    if (shortlisted.includes(candidateId)) {
      if (hireRequestId) {
        try { await hiringAPI.removeShortlist(hireRequestId, candidateId) } catch {}
      }
      setShortlisted(prev => prev.filter(id => id !== candidateId))
    } else {
      if (shortlisted.length >= 3) return
      if (hireRequestId) {
        try { await hiringAPI.shortlist(hireRequestId, candidateId) } catch {}
      }
      setShortlisted(prev => [...prev, candidateId])
    }
  }

  const handleInterview = async (candidateId: number) => {
    if (!hireRequestId) return
    try {
      await hiringAPI.requestInterview(hireRequestId, candidateId)
      setInterviewRequested(prev => [...prev, candidateId])
    } catch {}
  }

  const playVoice = (candidateId: number, url: string) => {
    if (audioRef.current) { audioRef.current.pause() }
    if (playingAudio === candidateId) { setPlayingAudio(null); return }
    const audio = new Audio(url)
    audio.onended = () => setPlayingAudio(null)
    audio.play()
    audioRef.current = audio
    setPlayingAudio(candidateId)
  }

  const handleProceed = () => {
    if (shortlisted.length === 0) return
    router.push(`/client/confirm?hireRequestId=${hireRequestId}&candidateIds=${shortlisted.join(',')}`)
  }

  const categories = [
    { value: '', label: t('talent.filterAll') },
    { value: 'admin-sales', label: t('pricing.adminSales') },
    { value: '2d-design', label: t('pricing.design') },
  ]

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 5%' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '16px', height: '1px', background: 'var(--gold-dim)', display: 'block' }} />
          {t('talent.step')}
        </div>
        <h1 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 300, color: 'var(--white)', lineHeight: 1.2, marginBottom: '12px' }}>{t('talent.title')}</h1>
        <p style={{ fontSize: '14px', color: 'var(--white-dim)', lineHeight: 1.7, marginBottom: '32px' }}>{t('talent.description')}</p>

        {/* Filter Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '2px', background: 'var(--navy-card)', padding: '3px', border: '1px solid var(--border-soft)' }}>
            {categories.map(cat => (
              <button key={cat.value} onClick={() => setFilterCat(cat.value)} style={{
                padding: '8px 16px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                background: filterCat === cat.value ? 'var(--navy-light)' : 'transparent',
                border: filterCat === cat.value ? '1px solid var(--border)' : '1px solid transparent',
                color: filterCat === cat.value ? 'var(--gold)' : 'var(--white-dim)',
              }}>{cat.label}</button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '12px', color: 'var(--white-dim)' }}>
              {t('talent.showing')} {candidates.length} {t('talent.of')} {totalCount} {t('talent.candidates')}
            </span>
            <div style={{ padding: '6px 14px', background: shortlisted.length > 0 ? 'rgba(200,169,110,0.15)' : 'var(--navy-card)', border: '1px solid var(--border-soft)', fontSize: '12px', color: 'var(--gold)', fontWeight: 500 }}>
              {shortlisted.length}/3 {t('talent.shortlisted')}
            </div>
          </div>
        </div>

        {/* Candidate Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--white-dim)', fontSize: '14px' }}>{t('confirm.loading')}</div>
        ) : candidates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--white-dim)', fontSize: '14px' }}>{t('talent.noResults')}</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            <AnimatePresence>
              {candidates.map((c, idx) => {
                const isShortlisted = shortlisted.includes(c.id)
                const isExpanded = expandedId === c.id
                const isInterviewed = interviewRequested.includes(c.id)
                return (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                    style={{ background: 'var(--navy-card)', border: `1px solid ${isShortlisted ? 'var(--gold)' : 'var(--border-soft)'}`, position: 'relative', transition: 'border-color 0.3s' }}>
                    {c.is_featured && (
                      <div style={{ position: 'absolute', top: '12px', right: isRTL ? 'auto' : '12px', left: isRTL ? '12px' : 'auto', padding: '3px 10px', background: 'rgba(200,169,110,0.15)', border: '1px solid var(--border)', fontSize: '10px', fontWeight: 500, color: 'var(--gold)', letterSpacing: '1px', textTransform: 'uppercase' }}>{t('talent.featured')}</div>
                    )}
                    {isShortlisted && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--gold), transparent)' }} />}

                    <div style={{ padding: '24px', cursor: 'pointer' }} onClick={() => setExpandedId(isExpanded ? null : c.id)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                        {/* Avatar */}
                        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--navy-mid)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 500, color: 'var(--gold)', flexShrink: 0 }}>
                          {c.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        {/* Info */}
                        <div style={{ flex: 1, textAlign: isRTL ? 'right' : 'left' }}>
                          <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--white)', marginBottom: '4px' }}>
                            {isRTL ? (c.full_name_ar || c.full_name) : c.full_name}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--white-dim)', display: 'flex', gap: '8px', alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                            <span>{c.category === 'admin-sales' ? t('pricing.adminSales') : t('pricing.design')}</span>
                            <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--gold-dim)' }} />
                            <span>{c.work_preference === 'home' ? t('pricing.home') : t('pricing.office')}</span>
                            <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--gold-dim)' }} />
                            <span style={{ color: 'var(--gold)' }}>★ {c.rating}</span>
                          </div>
                        </div>
                        {/* Price */}
                        <div style={{ textAlign: isRTL ? 'left' : 'right', flexShrink: 0 }}>
                          <div className="font-display" style={{ fontSize: '22px', color: 'var(--gold)', fontWeight: 300 }}>{c.monthly_rate.toLocaleString()}</div>
                          <div style={{ fontSize: '11px', color: 'var(--gold-dim)' }}>{t('pricing.aed')}{t('talent.perMonth')}</div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} style={{ padding: '0 24px 24px', borderTop: '1px solid var(--border-soft)' }}>
                        <div style={{ paddingTop: '20px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--gold-dim)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>{t('talent.experience')}</div>
                          <p style={{ fontSize: '13px', color: 'var(--white-dim)', lineHeight: 1.7, marginBottom: '16px' }}>{c.experience}</p>

                          <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--gold-dim)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>{t('talent.skills')}</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                            {c.skills.map((skill, i) => (
                              <span key={i} style={{ padding: '4px 12px', background: 'var(--navy-mid)', border: '1px solid var(--border-soft)', fontSize: '11px', color: 'var(--white-dim)' }}>{skill}</span>
                            ))}
                          </div>

                          {/* Actions */}
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {c.voice_intro && (
                              <button onClick={(e) => { e.stopPropagation(); playVoice(c.id, c.voice_intro!) }} style={{
                                padding: '10px 20px', background: playingAudio === c.id ? 'rgba(200,169,110,0.15)' : 'var(--navy-mid)',
                                border: `1px solid ${playingAudio === c.id ? 'var(--gold)' : 'var(--border-soft)'}`,
                                color: playingAudio === c.id ? 'var(--gold)' : 'var(--white-dim)',
                                fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px',
                              }}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 1l8 5-8 5V1z" fill="currentColor"/></svg>
                                {t('talent.listen')}
                              </button>
                            )}
                            <button onClick={(e) => { e.stopPropagation(); handleShortlist(c.id) }} disabled={!isShortlisted && shortlisted.length >= 3} style={{
                              padding: '10px 20px', background: isShortlisted ? 'var(--gold)' : 'var(--navy-mid)',
                              border: `1px solid ${isShortlisted ? 'var(--gold)' : 'var(--border-soft)'}`,
                              color: isShortlisted ? 'var(--navy)' : 'var(--white-dim)',
                              fontSize: '12px', fontWeight: isShortlisted ? 600 : 400,
                              cursor: !isShortlisted && shortlisted.length >= 3 ? 'not-allowed' : 'pointer',
                              fontFamily: 'inherit', opacity: !isShortlisted && shortlisted.length >= 3 ? 0.4 : 1,
                            }}>
                              {isShortlisted ? t('talent.remove') : t('talent.shortlist')}
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleInterview(c.id) }} disabled={isInterviewed} style={{
                              padding: '10px 20px', background: isInterviewed ? 'rgba(125,201,156,0.15)' : 'var(--navy-mid)',
                              border: `1px solid ${isInterviewed ? '#7DC99C' : 'var(--border-soft)'}`,
                              color: isInterviewed ? '#7DC99C' : 'var(--white-dim)',
                              fontSize: '12px', cursor: isInterviewed ? 'default' : 'pointer', fontFamily: 'inherit',
                            }}>
                              {isInterviewed ? t('talent.interviewRequested') : t('talent.requestInterview')}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Proceed Button */}
        {shortlisted.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            style={{ position: 'sticky', bottom: '20px', zIndex: 10 }}>
            <button onClick={handleProceed} style={{
              width: '100%', padding: '16px', background: 'var(--gold)', border: '1px solid var(--gold)',
              color: 'var(--navy)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 -10px 40px rgba(8,13,26,0.8)',
            }}>
              {t('talent.proceedToConfirm')} ({shortlisted.length})
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
