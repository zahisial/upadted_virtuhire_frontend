'use client'
import { useLanguage } from '@/context/LanguageContext'

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage()
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
      style={{
        padding: '6px 14px', background: 'transparent',
        border: '1px solid var(--border)', color: 'var(--gold)',
        fontSize: '12px', cursor: 'pointer', fontFamily: lang === 'en' ? 'Tajawal' : 'Outfit',
        fontWeight: 500, transition: 'all 0.2s',
      }}
    >
      {lang === 'en' ? 'عربي' : 'EN'}
    </button>
  )
}
