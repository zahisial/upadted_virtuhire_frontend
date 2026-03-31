'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const { t, isRTL } = useLanguage()
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('')
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState('')
  const inputStyle = (f: boolean): React.CSSProperties => ({ width: '100%', padding: '12px 16px', background: 'var(--navy-mid)', border: `1px solid ${f ? 'var(--gold)' : 'var(--border-soft)'}`, color: 'var(--white)', fontSize: '14px', fontFamily: 'inherit', outline: 'none' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try { await login(email, password); router.push('/client/dashboard') }
    catch (err: any) { setError(err?.detail || t('login.loginFailed')) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5%' }}>
      <div style={{ maxWidth: '420px', width: '100%' }} dir={isRTL ? 'rtl' : 'ltr'}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ width: '48px', height: '48px', border: '1.5px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', fontWeight: 600, color: 'var(--gold)', margin: '0 auto 16px' }}>V</div>
            <h1 className="font-display" style={{ fontSize: '32px', fontWeight: 300, color: 'var(--white)', marginBottom: '8px' }}>{t('login.signIn')}</h1>
            <p style={{ fontSize: '14px', color: 'var(--white-dim)' }}>{t('login.welcomeBack')}</p>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div><label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--white-dim)', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{t('login.email')}</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('login.emailPlaceholder')} style={inputStyle(focused === 'e')} onFocus={() => setFocused('e')} onBlur={() => setFocused('')} required /></div>
            <div><label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--white-dim)', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{t('login.password')}</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t('login.passwordPlaceholder')} style={inputStyle(focused === 'p')} onFocus={() => setFocused('p')} onBlur={() => setFocused('')} required /></div>
            {error && <div style={{ padding: '12px', background: 'rgba(220,80,80,0.1)', border: '1px solid rgba(220,80,80,0.3)', color: '#E05050', fontSize: '13px' }}>{error}</div>}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: loading ? 'rgba(200,169,110,0.4)' : 'var(--gold)', border: '1px solid var(--gold)', color: 'var(--navy)', fontSize: '14px', fontWeight: 600, cursor: loading ? 'wait' : 'pointer', fontFamily: 'inherit' }}>{loading ? t('login.loggingIn') : t('login.loginButton')}</button>
            <div style={{ textAlign: 'center' }}><a href="/client/register" style={{ color: 'var(--gold)', fontSize: '13px', textDecoration: 'none' }}>{t('login.dontHaveAccount')}</a></div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
