'use client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useLanguage } from '@/context/LanguageContext'

export default function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  const { isRTL } = useLanguage()
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', padding: '120px 5% 80px' }} dir={isRTL ? 'rtl' : 'ltr'}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h1 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 300, color: 'var(--white)', marginBottom: '32px' }}>{title}</h1>
          <div style={{ fontSize: '14px', color: 'var(--white-dim)', lineHeight: 1.8 }}>{children}</div>
        </div>
      </div>
      <Footer />
    </>
  )
}
