'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { hiringAPI, candidatesAPI } from '@/lib/api'

function ConfirmContent() {
  const { t, isRTL } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const hireRequestId = searchParams.get('hireRequestId')
  const candidateIds = searchParams.get('candidateIds')?.split(',').map(Number) || []
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!hireRequestId || candidateIds.length === 0) {
      setError(t('confirm.missingData'))
      setLoading(false)
      return
    }
    Promise.all(candidateIds.map(id => candidatesAPI.detail(id)))
      .then(data => {
        setCandidates(data.map((c: any) => ({
          ...c,
          initials: c.full_name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        })))
        setLoading(false)
      })
      .catch(() => {
        setError(t('confirm.loadError'))
        setLoading(false)
      })
  }, [hireRequestId, candidateIds, t])

  const totalMonthly = candidates.reduce((s: number, c: any) => s + (c.monthly_rate || 0), 0)
  const hiringFee = 300 * candidates.length
  const dueNow = totalMonthly - hiringFee

  const handleConfirm = async () => {
    if (!hireRequestId) return
    setProcessing(true)
    setError('')
    try {
      for (const c of candidates) {
        await hiringAPI.confirmHire(parseInt(hireRequestId), c.id)
      }
      setConfirmed(true)
      setTimeout(() => router.push('/client/dashboard'), 2000)
    } catch (e: any) {
      setError(e?.detail || t('confirm.confirmError'))
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div style={{ maxWidth: '560px', margin: '100px auto', textAlign: 'center', color: 'var(--white-dim)' }}>
        {t('confirm.loading')}
      </div>
    )
  }

  if (error && !candidates.length) {
    return (
      <div style={{ maxWidth: '560px', margin: '100px auto', textAlign: 'center' }}>
        <div style={{ color: '#E05050', marginBottom: '20px' }}>{error}</div>
        <button
          onClick={() => router.back()}
          style={{
            padding: '12px 24px',
            background: 'var(--gold)',
            border: 'none',
            color: 'var(--navy)',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          {t('confirm.goBack')}
        </button>
      </div>
    )
  }

  if (confirmed) {
    return (
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '0 5%', textAlign: 'center' }} dir={isRTL ? 'rtl' : 'ltr'}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', color: 'var(--gold)' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M6 16l7 7 13-13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-display" style={{ fontSize: 'clamp(32px,4vw,48px)', fontWeight: 300, color: 'var(--white)', marginBottom: '16px' }}>
            {t('confirm.successTitle')}
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--white-dim)', marginBottom: '40px' }}>
            {candidates.length === 1
              ? t('confirm.successMessageSingle').replace('{name}', candidates[0].full_name)
              : t('confirm.successMessagePlural').replace('{count}', String(candidates.length))}
          </p>
          <button
            onClick={() => router.push('/client/dashboard')}
            style={{
              width: '100%',
              padding: '16px',
              background: 'var(--gold)',
              border: '1px solid var(--gold)',
              color: 'var(--navy)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            {t('confirm.goToDashboard')}
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '0 5%' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '16px', height: '1px', background: 'var(--gold-dim)', display: 'block' }} />
          {t('confirm.step')}
        </div>
        <h1 className="font-display" style={{ fontSize: 'clamp(32px,4vw,44px)', fontWeight: 300, color: 'var(--white)', lineHeight: 1.2, marginBottom: '12px' }}>
          {t('confirm.title')}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--white-dim)', lineHeight: 1.7, marginBottom: '40px' }}>
          {t('confirm.description')}
        </p>

        {candidates.map((c, i) => (
          <div key={c.id} style={{ background: 'var(--navy-card)', border: '1px solid var(--gold-dim)', padding: '28px', marginBottom: i === candidates.length - 1 ? '28px' : '2px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--gold-dim), transparent)' }} />
            <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '16px', fontWeight: 500 }}>
              {i === 0 ? t('confirm.selectedCandidate') : t('confirm.additionalCandidate')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--navy-mid)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 500, color: 'var(--gold)', flexShrink: 0 }}>
                {c.initials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '17px', fontWeight: 500, color: 'var(--white)', marginBottom: '4px' }}>{c.full_name}</div>
                <div style={{ fontSize: '13px', color: 'var(--white-dim)' }}>{c.category} · {c.work_preference}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: 'var(--white-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{t('confirm.monthly')}</div>
                <div className="font-display" style={{ fontSize: '24px', color: 'var(--gold)', fontWeight: 300 }}>
                  {c.monthly_rate?.toLocaleString()} {t('pricing.aed')}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border-soft)', padding: '28px', marginBottom: '28px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '20px', fontWeight: 500 }}>
            {t('confirm.paymentBreakdown')}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', color: 'var(--white)' }}>{t('confirm.firstMonthRate')}</span>
            <span style={{ fontSize: '14px', color: 'var(--white)' }}>{totalMonthly.toLocaleString()} {t('pricing.aed')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', color: 'var(--white-dim)' }}>{t('confirm.hiringFeeCredited')}</span>
            <span style={{ fontSize: '14px', color: '#7DC99C' }}>−{hiringFee.toLocaleString()} {t('pricing.aed')}</span>
          </div>
          <div style={{ height: '1px', background: 'var(--border-soft)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px' }}>
            <span style={{ fontSize: '13px', color: 'var(--white)', fontWeight: 500 }}>{t('confirm.dueNow')}</span>
            <span className="font-display" style={{ fontSize: '18px', color: 'var(--gold)', fontWeight: 300 }}>
              {dueNow.toLocaleString()} {t('pricing.aed')}
            </span>
          </div>
        </div>

        {error && (
          <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(220,80,80,0.1)', border: '1px solid rgba(220,80,80,0.3)', color: '#E05050', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleConfirm}
          disabled={processing}
          style={{
            width: '100%',
            padding: '16px',
            background: processing ? 'rgba(200,169,110,0.4)' : 'var(--gold)',
            border: '1px solid var(--gold)',
            color: 'var(--navy)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: processing ? 'wait' : 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {processing ? t('confirm.processing') : t('confirm.payAndConfirm').replace('{amount}', dueNow.toLocaleString())}
        </button>
      </motion.div>
    </div>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div style={{ maxWidth: '560px', margin: '100px auto', textAlign: 'center', color: 'var(--white-dim)' }}>Loading...</div>}>
      <ConfirmContent />
    </Suspense>
  )
}