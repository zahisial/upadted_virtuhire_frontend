'use client'
import { useLanguage } from '@/context/LanguageContext'

export default function Features() {
  const { t, isRTL } = useLanguage()
  const features = [
    { icon: '⚡', titleKey: 'features.f1.title', descKey: 'features.f1.desc' },
    { icon: '🎙', titleKey: 'features.f2.title', descKey: 'features.f2.desc' },
    { icon: '📊', titleKey: 'features.f3.title', descKey: 'features.f3.desc' },
    { icon: '🌐', titleKey: 'features.f4.title', descKey: 'features.f4.desc' },
  ]
  return (
    <section id="features" style={{ padding: '100px 5%', maxWidth: '1100px', margin: '0 auto' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '12px', fontWeight: 500 }}>{t('features.tagline')}</div>
        <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, color: 'var(--white)' }}>{t('features.title')}</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {features.map((f, i) => (
          <div key={i} style={{ padding: '28px', background: 'var(--navy-card)', border: '1px solid var(--border-soft)' }}>
            <div style={{ fontSize: '24px', marginBottom: '16px' }}>{f.icon}</div>
            <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--white)', marginBottom: '8px' }}>{t(f.titleKey)}</div>
            <div style={{ fontSize: '13px', color: 'var(--white-dim)', lineHeight: 1.6 }}>{t(f.descKey)}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
