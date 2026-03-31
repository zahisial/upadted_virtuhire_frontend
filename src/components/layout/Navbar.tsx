'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import LanguageToggle from '@/components/ui/LanguageToggle'

export default function Navbar() {
  const { t, isRTL } = useLanguage()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: '72px', padding: '0 5%',
      background: 'rgba(8,13,26,0.92)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-soft)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }} dir={isRTL ? 'rtl' : 'ltr'}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{
          width: '36px', height: '36px', border: '1.5px solid var(--gold)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', fontWeight: 600, color: 'var(--gold)',
        }}>V</div>
        <span style={{ fontWeight: 500, fontSize: '17px', color: 'var(--white)' }}>
          Virtu<span style={{ color: 'var(--gold)' }}>Hire</span>
        </span>
      </Link>

      <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <a href="#how" style={{ color: 'var(--white-dim)', fontSize: '13px', textDecoration: 'none', fontWeight: 400 }}>{t('nav.howItWorks')}</a>
        <a href="#pricing" style={{ color: 'var(--white-dim)', fontSize: '13px', textDecoration: 'none', fontWeight: 400 }}>{t('nav.pricing')}</a>
        <a href="#features" style={{ color: 'var(--white-dim)', fontSize: '13px', textDecoration: 'none', fontWeight: 400 }}>{t('nav.features')}</a>
        <LanguageToggle />
        {user ? (
          <>
            <Link href="/client/dashboard" style={{
              padding: '8px 20px', border: '1px solid var(--gold)',
              color: 'var(--gold)', fontSize: '13px', textDecoration: 'none', fontWeight: 500,
            }}>{t('nav.dashboard')}</Link>
            <button onClick={logout} style={{
              padding: '8px 16px', background: 'transparent', border: '1px solid var(--border-soft)',
              color: 'var(--white-dim)', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit',
            }}>{t('nav.logout')}</button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ color: 'var(--white-dim)', fontSize: '13px', textDecoration: 'none' }}>{t('nav.login')}</Link>
            <Link href="/client/register" style={{
              padding: '8px 20px', background: 'var(--gold)',
              border: '1px solid var(--gold)', color: 'var(--navy)',
              fontSize: '13px', fontWeight: 600, textDecoration: 'none',
            }}>{t('nav.hireTalent')}</Link>
            <Link href="/candidate" style={{
              padding: '8px 20px', border: '1px solid var(--border)',
              color: 'var(--white)', fontSize: '13px', textDecoration: 'none',
            }}>{t('nav.getHired')}</Link>
          </>
        )}
      </nav>
    </header>
  )
}
