'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import AutoDemoModal from '@/components/AutoDemoModal'

export default function RegisterPage() {
  const { t, isRTL } = useLanguage()
  const { register } = useAuth()
  const router = useRouter()
  const [accountType, setAccountType] = useState<'individual' | 'corporate'>('individual')
  const [form, setForm] = useState({ email: '', password: '', phone: '', fullName: '', companyName: '', vatNumber: '', contactPerson: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState('')
  const [demoClosed, setDemoClosed] = useState(false)
  const [countdown, setCountdown] = useState(5)

  // Redirect after 5 seconds when demoClosed becomes true
  useEffect(() => {
    if (demoClosed) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [demoClosed, router]);

  const handleModalClose = () => {
    setDemoClosed(true);
  };

  const handleInput = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  const inputStyle = (f: boolean): React.CSSProperties => ({
    width: '100%', padding: '12px 16px', background: 'var(--navy-mid)',
    border: `1px solid ${f ? 'var(--gold)' : 'var(--border-soft)'}`,
    color: 'var(--white)', fontSize: '14px', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s',
    opacity: demoClosed ? 0.6 : 1,
    cursor: demoClosed ? 'not-allowed' : 'auto',
  })
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--white-dim)', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (demoClosed) return;
    setLoading(true); setError('')
    try {
      await register({
        email: form.email, password: form.password, phone: form.phone, role: 'client',
        account_type: accountType, full_name: form.fullName,
        company_name: form.companyName, vat_number: form.vatNumber, contact_person: form.contactPerson,
      })
      router.push(`/verify?email=${encodeURIComponent(form.email)}`)
    } catch (err: any) {
      setError(err?.email?.[0] || err?.detail || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <>
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '0 5%' }} dir={isRTL ? 'rtl' : 'ltr'}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '16px', height: '1px', background: 'var(--gold-dim)', display: 'block' }} />
            {t('register.step')}
          </div>
          <h1 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 300, color: 'var(--white)', lineHeight: 1.2, marginBottom: '12px' }}>{t('register.title')}</h1>
          <p style={{ fontSize: '14px', color: 'var(--white-dim)', lineHeight: 1.7, marginBottom: '32px' }}>{t('register.description')}</p>

          {/* Demo ending message */}
          {demoClosed && (
            <div style={{
              background: 'rgba(200,169,110,0.1)',
              border: '1px solid var(--gold)',
              padding: '12px',
              marginBottom: '24px',
              textAlign: 'center',
              color: 'var(--gold)',
              fontSize: '14px',
              fontWeight: 500
            }}>
              Demo mode ended. Redirecting to homepage in {countdown} seconds...
            </div>
          )}

          {/* Account Type Toggle */}
          <div style={{ display: 'flex', gap: '2px', marginBottom: '28px', background: 'var(--navy-card)', padding: '4px', border: '1px solid var(--border-soft)', width: 'fit-content' }}>
            {(['individual', 'corporate'] as const).map(type => (
              <button
                key={type}
                onClick={() => !demoClosed && setAccountType(type)}
                style={{
                  padding: '10px 24px',
                  background: accountType === type ? 'var(--navy-light)' : 'transparent',
                  border: accountType === type ? '1px solid var(--border)' : '1px solid transparent',
                  color: accountType === type ? 'var(--gold)' : 'var(--white-dim)',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: demoClosed ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  opacity: demoClosed ? 0.6 : 1,
                }}
                disabled={demoClosed}
              >
                {t(`register.${type}`)}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {accountType === 'individual' ? (
              <div>
                <label style={labelStyle}>{t('register.fullName')}</label>
                <input
                  value={form.fullName}
                  onChange={e => !demoClosed && handleInput('fullName', e.target.value)}
                  style={inputStyle(focused === 'fullName')}
                  onFocus={() => !demoClosed && setFocused('fullName')}
                  onBlur={() => setFocused('')}
                  disabled={demoClosed}
                  required
                />
              </div>
            ) : (
              <>
                <div>
                  <label style={labelStyle}>{t('register.companyName')}</label>
                  <input
                    value={form.companyName}
                    onChange={e => !demoClosed && handleInput('companyName', e.target.value)}
                    style={inputStyle(focused === 'companyName')}
                    onFocus={() => !demoClosed && setFocused('companyName')}
                    onBlur={() => setFocused('')}
                    disabled={demoClosed}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>{t('register.vatNumber')}</label>
                    <input
                      value={form.vatNumber}
                      onChange={e => !demoClosed && handleInput('vatNumber', e.target.value)}
                      style={inputStyle(focused === 'vatNumber')}
                      onFocus={() => !demoClosed && setFocused('vatNumber')}
                      onBlur={() => setFocused('')}
                      disabled={demoClosed}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>{t('register.contactPerson')}</label>
                    <input
                      value={form.contactPerson}
                      onChange={e => !demoClosed && handleInput('contactPerson', e.target.value)}
                      style={inputStyle(focused === 'contactPerson')}
                      onFocus={() => !demoClosed && setFocused('contactPerson')}
                      onBlur={() => setFocused('')}
                      disabled={demoClosed}
                    />
                  </div>
                </div>
              </>
            )}
            <div>
              <label style={labelStyle}>{t('register.email')}</label>
              <input
                type="email"
                value={form.email}
                onChange={e => !demoClosed && handleInput('email', e.target.value)}
                placeholder="you@company.com"
                style={inputStyle(focused === 'email')}
                onFocus={() => !demoClosed && setFocused('email')}
                onBlur={() => setFocused('')}
                disabled={demoClosed}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>{t('register.phone')}</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => !demoClosed && handleInput('phone', e.target.value)}
                  placeholder="+971 50 XXX XXXX"
                  style={inputStyle(focused === 'phone')}
                  onFocus={() => !demoClosed && setFocused('phone')}
                  onBlur={() => setFocused('')}
                  disabled={demoClosed}
                />
              </div>
              <div>
                <label style={labelStyle}>{t('register.password')}</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => !demoClosed && handleInput('password', e.target.value)}
                  placeholder="Min 6 characters"
                  style={inputStyle(focused === 'password')}
                  onFocus={() => !demoClosed && setFocused('password')}
                  onBlur={() => setFocused('')}
                  disabled={demoClosed}
                  required
                />
              </div>
            </div>
            {error && <div style={{ padding: '12px', background: 'rgba(220,80,80,0.1)', border: '1px solid rgba(220,80,80,0.3)', color: '#E05050', fontSize: '13px' }}>{error}</div>}
            <button
              type="submit"
              disabled={loading || demoClosed}
              style={{
                width: '100%',
                padding: '16px',
                background: (loading || demoClosed) ? 'rgba(200,169,110,0.4)' : 'var(--gold)',
                border: '1px solid var(--gold)',
                color: 'var(--navy)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: (loading || demoClosed) ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {loading ? 'Creating...' : t('register.next')}
              {!loading && <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>}
            </button>
            <div style={{ textAlign: 'center' }}>
              <a href="/login" style={{ color: 'var(--gold)', fontSize: '13px', textDecoration: 'none', opacity: demoClosed ? 0.6 : 1, pointerEvents: demoClosed ? 'none' : 'auto' }}>{t('register.haveAccount')}</a>
            </div>
          </form>
        </motion.div>
      </div>
      <AutoDemoModal onModalClose={handleModalClose} />
    </>
  )
}