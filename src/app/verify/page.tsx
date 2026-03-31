// 'use client'
// import { useState, Suspense } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { motion } from 'framer-motion'
// import { useLanguage } from '@/context/LanguageContext'
// import { authAPI } from '@/lib/api'

// function VerifyContent() {
//   const { t, isRTL } = useLanguage()
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const email = searchParams.get('email') || ''
//   const [otp, setOtp] = useState(''); const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(''); const [success, setSuccess] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault(); if (!otp || otp.length < 4) { setError(t('register.verificationCodeRequired')); return }
//     setLoading(true); setError('')
//     try { await authAPI.verifyOTP(email, otp); setSuccess(true); setTimeout(() => router.push('/client/contract'), 2000) }
//     catch (err: any) { setError(err?.detail || t('verify.invalidCode')) }
//     finally { setLoading(false) }
//   }

//   if (success) return (
//     <div style={{ maxWidth: '560px', margin: '100px auto', padding: '0 5%', textAlign: 'center' }}>
//       <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
//         <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', color: 'var(--gold)' }}><svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M6 16l7 7 13-13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
//         <h1 className="font-display" style={{ fontSize: '36px', fontWeight: 300, color: 'var(--white)' }}>{t('verify.successTitle')}</h1>
//         <p style={{ fontSize: '15px', color: 'var(--white-dim)', marginTop: '16px' }}>{t('verify.successMessage')}</p>
//       </motion.div>
//     </div>
//   )

//   return (
//     <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5%' }}>
//       <div style={{ maxWidth: '420px', width: '100%' }} dir={isRTL ? 'rtl' : 'ltr'}>
//         <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
//           <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '12px', fontWeight: 500 }}>{t('verify.step')}</div>
//           <h1 className="font-display" style={{ fontSize: 'clamp(32px,4vw,44px)', fontWeight: 300, color: 'var(--white)', lineHeight: 1.2, marginBottom: '12px' }}>{t('verify.title')}</h1>
//           <p style={{ fontSize: '14px', color: 'var(--white-dim)', lineHeight: 1.7, marginBottom: '40px' }}>{t('verify.instruction').replace('{email}', email)}</p>
//           <form onSubmit={handleSubmit}>
//             <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" style={{ width: '100%', padding: '14px 16px', textAlign: 'center', letterSpacing: '8px', background: 'var(--navy-mid)', border: '1px solid var(--border-soft)', color: 'var(--white)', fontSize: '20px', fontFamily: 'inherit', outline: 'none', marginBottom: '24px' }} />
//             {error && <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(220,80,80,0.1)', border: '1px solid rgba(220,80,80,0.3)', color: '#E05050', fontSize: '13px' }}>{error}</div>}
//             <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: loading ? 'rgba(200,169,110,0.4)' : 'var(--gold)', border: '1px solid var(--gold)', color: 'var(--navy)', fontSize: '14px', fontWeight: 600, cursor: loading ? 'wait' : 'pointer', fontFamily: 'inherit' }}>{loading ? t('verify.verifying') : t('verify.verifyButton')}</button>
//           </form>
//         </motion.div>
//       </div>
//     </div>
//   )
// }

// export default function VerifyPage() {
//   return <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--white-dim)' }}>Loading...</div>}><VerifyContent /></Suspense>
// }
// app/verify/page.tsx
import { Suspense } from 'react';
import VerifyClient from './VerifyClient';

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyClient />
    </Suspense>
  );
}