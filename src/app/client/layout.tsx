'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import LanguageToggle from '@/components/ui/LanguageToggle'

const steps = [
  { num: 1, labelEn: 'Register', labelAr: 'التسجيل', href: '/client/register' },
  { num: 2, labelEn: 'Contract', labelAr: 'العقد', href: '/client/contract' },
  { num: 3, labelEn: 'Payment', labelAr: 'الدفع', href: '/client/payment' },
  { num: 4, labelEn: 'Hire', labelAr: 'التوظيف', href: '/client/hire' },
  { num: 5, labelEn: 'Talent', labelAr: 'المرشحون', href: '/client/talent' },
  { num: 6, labelEn: 'Confirm', labelAr: 'التأكيد', href: '/client/confirm' },
  { num: 7, labelEn: 'Dashboard', labelAr: 'لوحة التحكم', href: '/client/dashboard' },
]

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isRTL } = useLanguage()
  const currentStep = steps.findIndex(s => pathname.startsWith(s.href)) + 1
  const progressPct = ((currentStep - 1) / (steps.length - 1)) * 100
  const isDashboard = pathname.startsWith('/client/dashboard')

  if (isDashboard) return <>{children}</>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: '64px', padding: '0 5%',
        background: 'rgba(8,13,26,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border-soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }} dir={isRTL ? 'rtl' : 'ltr'}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', border: '1.5px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', fontWeight: 600, color: 'var(--gold)' }}>V</div>
          <span style={{ fontWeight: 500, fontSize: '16px', color: 'var(--white)' }}>Virtu<span style={{ color: 'var(--gold)' }}>Hire</span></span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '12px', color: 'var(--white-dim)' }}>{isRTL ? `الخطوة ${currentStep} من ${steps.length}` : `Step ${currentStep} of ${steps.length}`}</span>
          <LanguageToggle />
        </div>
      </header>
      <div style={{ position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 99, background: 'var(--navy-mid)', borderBottom: '1px solid var(--border-soft)', padding: '0 5%' }}>
        <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'var(--gold)', width: `${progressPct}%`, transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', gap: '8px' }} dir={isRTL ? 'rtl' : 'ltr'}>
          {steps.map(step => {
            const isActive = step.num === currentStep
            const isDone = step.num < currentStep
            return (
              <div key={step.num} style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: isActive ? 1 : isDone ? 0.7 : 0.35, transition: 'opacity 0.3s' }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  border: `1px solid ${isActive ? 'var(--gold)' : isDone ? 'var(--gold-dim)' : 'var(--border-soft)'}`,
                  background: isDone ? 'var(--gold-dim)' : isActive ? 'rgba(200,169,110,0.15)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: 600,
                  color: isActive ? 'var(--gold)' : isDone ? 'var(--navy)' : 'var(--white-dim)', flexShrink: 0,
                }}>{isDone ? '✓' : step.num}</div>
                <span style={{ fontSize: '11px', fontWeight: isActive ? 500 : 400, color: isActive ? 'var(--gold)' : 'var(--white-dim)' }}>{isRTL ? step.labelAr : step.labelEn}</span>
              </div>
            )
          })}
        </div>
      </div>
      <main style={{ flex: 1, paddingTop: '128px', paddingBottom: '60px' }}>{children}</main>
    </div>
  )
}
