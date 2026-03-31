'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'

export default function PaymentPage() {
  const { t, isRTL } = useLanguage()
  const router = useRouter()
  const [focused, setFocused] = useState('')
  const [autoBilling, setAutoBilling] = useState(true)
  const [form, setForm] = useState({ cardNumber: '', expiry: '', cvv: '', cardName: '', billingAddress: '', vatNumber: '' })
  const handleInput = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const formatCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const formatExpiry = (v: string) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length >= 2 ? d.slice(0, 2) + '/' + d.slice(2) : d }
  const inputStyle = (f: boolean): React.CSSProperties => ({ width: '100%', padding: '12px 16px', background: 'var(--navy-mid)', border: `1px solid ${f ? 'var(--gold)' : 'var(--border-soft)'}`, color: 'var(--white)', fontSize: '14px', fontFamily: 'inherit', outline: 'none' })
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--white-dim)', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '0 5%' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '16px', height: '1px', background: 'var(--gold-dim)', display: 'block' }} />{t('payment.step3')}</div>
        <h1 className="font-display" style={{ fontSize: 'clamp(32px,4vw,44px)', fontWeight: 300, color: 'var(--white)', lineHeight: 1.2, marginBottom: '12px' }}>{t('payment.paymentSetup')}</h1>
        <p style={{ fontSize: '14px', color: 'var(--white-dim)', lineHeight: 1.7, marginBottom: '32px' }}>{t('payment.paymentDesc')}</p>

        <div style={{ background: 'linear-gradient(135deg, var(--navy-light), var(--navy-card))', border: '1px solid var(--border)', padding: '28px', marginBottom: '32px', height: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--white)' }}>VirtuHire</span>
          </div>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: '18px', color: 'var(--white)', letterSpacing: '3px', marginBottom: '12px' }}>{form.cardNumber || '•••• •••• •••• ••••'}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div><div style={{ fontSize: '10px', color: 'var(--white-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('payment.cardHolder')}</div><div style={{ fontSize: '13px', color: 'var(--white)', marginTop: '2px' }}>{form.cardName || 'Your Name'}</div></div>
              <div style={{ textAlign: 'right' }}><div style={{ fontSize: '10px', color: 'var(--white-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('payment.expires')}</div><div style={{ fontSize: '13px', color: 'var(--white)', marginTop: '2px' }}>{form.expiry || 'MM/YY'}</div></div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div><label style={labelStyle}>{t('payment.cardNumber')}</label><input value={form.cardNumber} onChange={e => handleInput('cardNumber', formatCard(e.target.value))} placeholder="1234 5678 9012 3456" style={inputStyle(focused === 'cn')} onFocus={() => setFocused('cn')} onBlur={() => setFocused('')} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div><label style={labelStyle}>{t('payment.expiryDate')}</label><input value={form.expiry} onChange={e => handleInput('expiry', formatExpiry(e.target.value))} placeholder="MM/YY" style={inputStyle(focused === 'exp')} onFocus={() => setFocused('exp')} onBlur={() => setFocused('')} /></div>
            <div><label style={labelStyle}>{t('payment.cvv')}</label><input value={form.cvv} maxLength={4} onChange={e => handleInput('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="•••" type="password" style={inputStyle(focused === 'cvv')} onFocus={() => setFocused('cvv')} onBlur={() => setFocused('')} /></div>
          </div>
          <div><label style={labelStyle}>{t('payment.cardholderName')}</label><input value={form.cardName} onChange={e => handleInput('cardName', e.target.value)} placeholder={t('payment.cardholderPlaceholder')} style={inputStyle(focused === 'name')} onFocus={() => setFocused('name')} onBlur={() => setFocused('')} /></div>
          <div style={{ height: '1px', background: 'var(--border-soft)' }} />
          <div><label style={labelStyle}>{t('payment.billingAddress')}</label><input value={form.billingAddress} onChange={e => handleInput('billingAddress', e.target.value)} placeholder={t('payment.billingAddressPlaceholder')} style={inputStyle(focused === 'addr')} onFocus={() => setFocused('addr')} onBlur={() => setFocused('')} /></div>
          <div><label style={labelStyle}>{t('payment.vatNumberOptional')}</label><input value={form.vatNumber} onChange={e => handleInput('vatNumber', e.target.value)} placeholder="1000XXXXX00003" style={inputStyle(focused === 'vat')} onFocus={() => setFocused('vat')} onBlur={() => setFocused('')} /></div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L1.5 3.5v4c0 3 2.5 5.5 5.5 6 3-0.5 5.5-3 5.5-6v-4L7 1z" stroke="var(--gold-dim)" strokeWidth="1.1"/></svg>
            <span style={{ fontSize: '12px', color: 'var(--white-dim)' }}>{t('payment.securePayments')}</span>
          </div>
          <button onClick={() => router.push('/client/hire')} style={{ width: '100%', padding: '16px', background: 'var(--gold)', border: '1px solid var(--gold)', color: 'var(--navy)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>{t('payment.nextHiringRequest')}<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></button>
        </div>
      </motion.div>
    </div>
  )
}
