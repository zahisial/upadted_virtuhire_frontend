'use client'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export default function Footer() {
  const { t, isRTL } = useLanguage()
  return (
    <footer style={{ borderTop: '1px solid var(--border-soft)', padding: '60px 5% 32px', background: 'var(--navy-mid)' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
        <div>
          <div style={{ fontWeight: 500, fontSize: '18px', color: 'var(--white)', marginBottom: '8px' }}>
            Virtu<span style={{ color: 'var(--gold)' }}>Hire</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--white-dim)', lineHeight: 1.6 }}>{t('footer.desc')}</p>
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--gold-dim)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>{t('footer.links')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href="#how" style={{ color: 'var(--white-dim)', fontSize: '13px', textDecoration: 'none' }}>{t('nav.howItWorks')}</a>
            <a href="#pricing" style={{ color: 'var(--white-dim)', fontSize: '13px', textDecoration: 'none' }}>{t('nav.pricing')}</a>
            <Link href="/candidate" style={{ color: 'var(--white-dim)', fontSize: '13px', textDecoration: 'none' }}>{t('nav.getHired')}</Link>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--gold-dim)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>{t('footer.legal')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/legal/terms" style={{ color: 'var(--white-dim)', fontSize: '13px', textDecoration: 'none' }}>{t('footer.terms')}</Link>
            <Link href="/legal/privacy" style={{ color: 'var(--white-dim)', fontSize: '13px', textDecoration: 'none' }}>{t('footer.privacy')}</Link>
            <Link href="/legal/refund" style={{ color: 'var(--white-dim)', fontSize: '13px', textDecoration: 'none' }}>{t('footer.refund')}</Link>
            <Link href="/legal/vat" style={{ color: 'var(--white-dim)', fontSize: '13px', textDecoration: 'none' }}>{t('footer.vat')}</Link>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--white-dim)', borderTop: '1px solid var(--border-soft)', paddingTop: '24px' }}>
        {t('footer.rights')}
      </div>
    </footer>
  )
}
