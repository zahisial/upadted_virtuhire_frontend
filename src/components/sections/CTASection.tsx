'use client'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export default function CTASection() {
  const { t, isRTL } = useLanguage()
  return (
    <section style={{ padding: '100px 5%', textAlign: 'center' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, color: 'var(--white)', marginBottom: '16px' }}>{t('cta.title')}</h2>
      <p style={{ fontSize: '15px', color: 'var(--white-dim)', marginBottom: '32px' }}>{t('cta.subtitle')}</p>
      <Link href="/client/register" style={{ padding: '16px 40px', background: 'var(--gold)', border: '1px solid var(--gold)', color: 'var(--navy)', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        {t('cta.button')}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
      </Link>
    </section>
  )
}
