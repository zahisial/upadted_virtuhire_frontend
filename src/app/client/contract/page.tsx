'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { contractsAPI } from '@/lib/api'

export default function ContractPage() {
  const { t, isRTL } = useLanguage()
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [signed, setSigned] = useState(false)
  const [lang, setLang] = useState<'en'|'ar'>(isRTL ? 'ar' : 'en')

  useEffect(() => { const c = canvasRef.current; if (!c) return; const ctx = c.getContext('2d'); if (!ctx) return; ctx.strokeStyle = '#C8A96E'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round' }, [])
  const getPos = (e: any, c: HTMLCanvasElement) => { const r = c.getBoundingClientRect(); return e.touches ? { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top } : { x: e.clientX - r.left, y: e.clientY - r.top } }
  const startDraw = (e: any) => { const c = canvasRef.current; if (!c) return; const ctx = c.getContext('2d'); if (!ctx) return; const p = getPos(e, c); ctx.beginPath(); ctx.moveTo(p.x, p.y); setIsDrawing(true) }
  const draw = (e: any) => { if (!isDrawing) return; const c = canvasRef.current; if (!c) return; const ctx = c.getContext('2d'); if (!ctx) return; const p = getPos(e, c); ctx.lineTo(p.x, p.y); ctx.stroke(); setSigned(true) }
  const stopDraw = () => setIsDrawing(false)
  const clear = () => { const c = canvasRef.current; if (!c) return; c.getContext('2d')?.clearRect(0, 0, c.width, c.height); setSigned(false) }
  const handleSubmit = async () => { if (!agreed || !signed) return; try { const sig = canvasRef.current?.toDataURL() || ''; await contractsAPI.sign(lang, sig) } catch {} router.push('/client/payment') }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 5%' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '16px', height: '1px', background: 'var(--gold-dim)', display: 'block' }} />{t('contract.step')}</div>
        <h1 className="font-display" style={{ fontSize: 'clamp(32px,4vw,44px)', fontWeight: 300, color: 'var(--white)', lineHeight: 1.2, marginBottom: '12px' }}>{t('contract.title')}</h1>
        <p style={{ fontSize: '14px', color: 'var(--white-dim)', lineHeight: 1.7, marginBottom: '32px' }}>{t('contract.description')}</p>
        <div style={{ display: 'flex', gap: '2px', marginBottom: '20px', background: 'var(--navy-card)', padding: '4px', border: '1px solid var(--border-soft)', width: 'fit-content' }}>
          {(['en','ar'] as const).map(l => (<button key={l} onClick={() => setLang(l)} style={{ padding: '8px 20px', background: lang === l ? 'var(--navy-light)' : 'transparent', border: lang === l ? '1px solid var(--border)' : '1px solid transparent', color: lang === l ? 'var(--gold)' : 'var(--white-dim)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: l === 'ar' ? 'Tajawal' : 'inherit' }}>{l === 'en' ? 'English' : 'عربي'}</button>))}
        </div>
        <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border-soft)', padding: '32px', maxHeight: '320px', overflowY: 'auto', marginBottom: '24px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--gold-dim), transparent)' }} />
          <pre style={{ fontFamily: lang === 'ar' ? 'Tajawal' : 'inherit', fontSize: '13px', color: 'var(--white-dim)', lineHeight: 1.9, whiteSpace: 'pre-wrap', direction: lang === 'ar' ? 'rtl' : 'ltr', textAlign: lang === 'ar' ? 'right' : 'left', margin: 0 }}>{lang === 'en' ? t('contract.fullText') : t('contract.fullTextAr')}</pre>
        </div>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', marginBottom: '32px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
          <div onClick={() => setAgreed(!agreed)} style={{ width: '20px', height: '20px', border: `1px solid ${agreed ? 'var(--gold)' : 'var(--border-soft)'}`, background: agreed ? 'var(--gold)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
            {agreed && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="var(--navy)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <span style={{ fontSize: '13px', color: 'var(--white-dim)', lineHeight: 1.6 }}>{t('contract.agree')}</span>
        </label>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--white-dim)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{t('contract.signature')}</label><button onClick={clear} style={{ background: 'none', border: 'none', color: 'var(--gold-dim)', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>{t('contract.clear')}</button></div>
          <div style={{ background: 'var(--navy-mid)', border: `1px solid ${signed ? 'rgba(200,169,110,0.3)' : 'var(--border-soft)'}`, position: 'relative' }}>
            <canvas ref={canvasRef} width={620} height={140} style={{ display: 'block', width: '100%', height: '140px', cursor: 'crosshair', touchAction: 'none' }} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw} onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw} />
            {!signed && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}><span style={{ fontSize: '13px', color: 'rgba(168,159,146,0.4)' }}>{t('contract.signHere')}</span></div>}
          </div>
        </div>
        <button onClick={handleSubmit} disabled={!agreed||!signed} style={{ width: '100%', padding: '16px', background: agreed&&signed ? 'var(--gold)' : 'rgba(200,169,110,0.2)', border: `1px solid ${agreed&&signed ? 'var(--gold)' : 'var(--border-soft)'}`, color: agreed&&signed ? 'var(--navy)' : 'var(--white-dim)', fontSize: '14px', fontWeight: 600, cursor: agreed&&signed ? 'pointer' : 'not-allowed', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>{t('contract.next')}</button>
      </motion.div>
    </div>
  )
}
