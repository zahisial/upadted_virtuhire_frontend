'use client'
import { useLanguage } from '@/context/LanguageContext'

export default function DashboardPreview() {
  const { t, isRTL } = useLanguage()
  return (
    <section style={{ padding: '80px 5%', maxWidth: '900px', margin: '0 auto' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border-soft)', padding: '40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--gold), var(--gold-dim), transparent)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '8px', fontWeight: 500 }}>Dashboard Preview</div>
            <div style={{ fontSize: '20px', fontWeight: 500, color: 'var(--white)' }}>Your Command Center</div>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {[{ label: 'Active', val: '3' }, { label: 'Monthly', val: '8,050 AED' }, { label: 'Open', val: '1' }].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div className="font-display" style={{ fontSize: '28px', color: 'var(--gold)', fontWeight: 300 }}>{s.val}</div>
                <div style={{ fontSize: '11px', color: 'var(--white-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {['Employees', 'Billing', 'Requests', 'Support'].map(tab => (
            <div key={tab} style={{ padding: '16px', background: 'var(--navy-mid)', border: '1px solid var(--border-soft)', textAlign: 'center', fontSize: '13px', color: 'var(--white-dim)' }}>{tab}</div>
          ))}
        </div>
      </div>
    </section>
  )
}
