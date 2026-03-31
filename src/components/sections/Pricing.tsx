'use client'
import { useLanguage } from '@/context/LanguageContext'

const plans = [
  { key: 'adminSales', home: 2150, office: 2700 },
  { key: 'design', home: 3200, office: 3600 },
]

export default function Pricing() {
  const { t, isRTL } = useLanguage()
  return (
    <section id="pricing" style={{ padding: '100px 5%', maxWidth: '900px', margin: '0 auto' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '12px', fontWeight: 500 }}>{t('pricing.tagline')}</div>
        <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, color: 'var(--white)' }}>{t('pricing.title')}</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {plans.map(p => (
          <div key={p.key} style={{ background: 'var(--navy-card)', border: '1px solid var(--border-soft)', padding: '36px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, var(--gold-dim), transparent)' }} />
            <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--white)', marginBottom: '24px' }}>{t(`pricing.${p.key}`)}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '13px', color: 'var(--white-dim)' }}>{t('pricing.home')}</span>
                <span className="font-display" style={{ fontSize: '28px', color: 'var(--gold)', fontWeight: 300 }}>{p.home.toLocaleString()} <span style={{ fontSize: '14px', color: 'var(--gold-dim)' }}>{t('pricing.aed')}{t('pricing.month')}</span></span>
              </div>
              <div style={{ height: '1px', background: 'var(--border-soft)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '13px', color: 'var(--white-dim)' }}>{t('pricing.office')}</span>
                <span className="font-display" style={{ fontSize: '28px', color: 'var(--gold)', fontWeight: 300 }}>{p.office.toLocaleString()} <span style={{ fontSize: '14px', color: 'var(--gold-dim)' }}>{t('pricing.aed')}{t('pricing.month')}</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--white-dim)', marginTop: '24px' }}>{t('pricing.hiringFee')}</p>
    </section>
  )
}
