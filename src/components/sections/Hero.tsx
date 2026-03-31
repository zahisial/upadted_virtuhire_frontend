'use client'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export default function Hero() {
  const { t, isRTL } = useLanguage()
  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 5% 80px', position: 'relative' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', borderRadius: '50%', border: '1px solid rgba(200,169,110,0.06)' }} />
      <div style={{ textAlign: 'center', maxWidth: '720px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '20px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <span style={{ width: '24px', height: '1px', background: 'var(--gold-dim)', display: 'block' }} />
          {t('hero.tagline')}
          <span style={{ width: '24px', height: '1px', background: 'var(--gold-dim)', display: 'block' }} />
        </div>
        <h1 className="font-display" style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 300, color: 'var(--white)', lineHeight: 1.15, marginBottom: '24px' }}>{t('hero.title')}</h1>
        <p style={{ fontSize: '16px', color: 'var(--white-dim)', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto 40px' }}>{t('hero.subtitle')}</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/client/register" style={{ padding: '14px 32px', background: 'var(--gold)', border: '1px solid var(--gold)', color: 'var(--navy)', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>{t('hero.cta1')}</Link>
          <Link href="/candidate" style={{ padding: '14px 32px', border: '1px solid var(--border)', color: 'var(--white)', fontSize: '14px', textDecoration: 'none' }}>{t('hero.cta2')}</Link>
        </div>
      </div>
    </section>
  )
}
