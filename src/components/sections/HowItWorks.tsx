'use client'
import { useLanguage } from '@/context/LanguageContext'

export default function HowItWorks() {
  const { t, isRTL } = useLanguage()
  const steps = [
    { num: '01', title: t('how.step1.title'), desc: t('how.step1.desc') },
    { num: '02', title: t('how.step2.title'), desc: t('how.step2.desc') },
    { num: '03', title: t('how.step3.title'), desc: t('how.step3.desc') },
  ]
  return (
    <section id="how" style={{ padding: '100px 5%', maxWidth: '1100px', margin: '0 auto' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '12px', fontWeight: 500 }}>{t('how.tagline')}</div>
        <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, color: 'var(--white)' }}>{t('how.title')}</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
        {steps.map(s => (
          <div key={s.num} style={{ padding: '32px', background: 'var(--navy-card)', border: '1px solid var(--border-soft)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, var(--gold-dim), transparent)' }} />
            <div className="font-display" style={{ fontSize: '32px', color: 'var(--gold-dim)', marginBottom: '16px', fontWeight: 300 }}>{s.num}</div>
            <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--white)', marginBottom: '8px' }}>{s.title}</div>
            <div style={{ fontSize: '13px', color: 'var(--white-dim)', lineHeight: 1.6 }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
