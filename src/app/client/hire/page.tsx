'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { hiringAPI, billingAPI } from '@/lib/api'

const PRICING: Record<string, Record<string, number>> = { 'admin-sales': { home: 2150, office: 2700 }, '2d-design': { home: 3200, office: 3600 } }

export default function HirePage() {
  const { t, isRTL } = useLanguage()
  const router = useRouter()
  const [category, setCategory] = useState<string>('')
  const [workType, setWorkType] = useState<string>('')
  const [count, setCount] = useState(1)
  const [loading, setLoading] = useState(false)

  const monthlyRate = category && workType ? PRICING[category]?.[workType] || 0 : 0
  const hiringFee = 300 * count
  const dueNow = hiringFee

  const handleSubmit = async () => {
    if (!category || !workType) return
    setLoading(true)
    try {
      await hiringAPI.createRequest({ category, work_type: workType, employee_count: count })
      router.push('/client/talent')
    } catch { router.push('/client/talent') }
    finally { setLoading(false) }
  }

  const categories = [
    { id: 'admin-sales', label: t('hire.categories.adminSales'), desc: t('hire.categories.adminSalesDesc') },
    { id: '2d-design', label: t('hire.categories.design'), desc: t('hire.categories.designDesc') },
  ]
  const workTypes = [
    { id: 'home', label: t('hire.workTypes.home'), desc: t('hire.workTypes.homeDesc') },
    { id: 'office', label: t('hire.workTypes.office'), desc: t('hire.workTypes.officeDesc') },
  ]

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 5%' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '16px', height: '1px', background: 'var(--gold-dim)', display: 'block' }} />{t('hire.step')}</div>
        <h1 className="font-display" style={{ fontSize: 'clamp(32px,4vw,44px)', fontWeight: 300, color: 'var(--white)', lineHeight: 1.2, marginBottom: '12px' }}>{t('hire.title')}</h1>
        <p style={{ fontSize: '14px', color: 'var(--white-dim)', lineHeight: 1.7, marginBottom: '40px' }}>{t('hire.description')}</p>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--white-dim)', marginBottom: '12px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{t('hire.categoryLabel')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {categories.map(c => (
              <button key={c.id} onClick={() => setCategory(c.id)} style={{ padding: '24px 20px', textAlign: isRTL ? 'right' : 'left', background: category === c.id ? 'rgba(200,169,110,0.08)' : 'var(--navy-card)', border: `1px solid ${category === c.id ? 'var(--gold)' : 'var(--border-soft)'}`, cursor: 'pointer', color: 'var(--white)', fontFamily: 'inherit' }}>
                <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '4px' }}>{c.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--white-dim)' }}>{c.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {category && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--white-dim)', marginBottom: '12px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{t('hire.workTypeLabel')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {workTypes.map(w => (
                <button key={w.id} onClick={() => setWorkType(w.id)} style={{ padding: '20px', textAlign: isRTL ? 'right' : 'left', background: workType === w.id ? 'rgba(200,169,110,0.08)' : 'var(--navy-card)', border: `1px solid ${workType === w.id ? 'var(--gold)' : 'var(--border-soft)'}`, cursor: 'pointer', color: 'var(--white)', fontFamily: 'inherit' }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{w.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--white-dim)' }}>{w.desc}</div>
                  {category && <div className="font-display" style={{ fontSize: '18px', color: workType === w.id ? 'var(--gold)' : 'var(--gold-dim)', marginTop: '12px', fontWeight: 300 }}>{PRICING[category]?.[w.id]?.toLocaleString()} {t('pricing.aed')}/{t('hire.monthAbbr')}</div>}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {workType && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--white-dim)', marginBottom: '12px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{t('hire.employeeCount')}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'var(--navy-card)', border: '1px solid var(--border-soft)', padding: '20px 24px', width: 'fit-content' }}>
              <button onClick={() => setCount(Math.max(1, count - 1))} style={{ width: '36px', height: '36px', border: '1px solid var(--border-soft)', background: 'transparent', color: 'var(--white)', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <span className="font-display" style={{ fontSize: '28px', color: 'var(--gold)', fontWeight: 300, minWidth: '32px', textAlign: 'center' }}>{count}</span>
              <button onClick={() => setCount(Math.min(10, count + 1))} style={{ width: '36px', height: '36px', border: '1px solid var(--border-soft)', background: 'transparent', color: 'var(--white)', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              <span style={{ fontSize: '13px', color: 'var(--white-dim)' }}>{count === 1 ? t('hire.employeeSingular') : t('hire.employeePlural')}</span>
            </div>
          </motion.div>
        )}

        {category && workType && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
            <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border-soft)', padding: '28px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--gold-dim), transparent)' }} />
              <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '20px', fontWeight: 500 }}>{t('hire.costSummary')}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><span style={{ fontSize: '13px', color: 'var(--white-dim)' }}>{t('hire.hiringFee')}</span><span style={{ fontSize: '14px', color: 'var(--white)' }}>{hiringFee.toLocaleString()} {t('pricing.aed')}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><span style={{ fontSize: '13px', color: 'var(--white-dim)' }}>{t('hire.monthlyCost')}</span><span style={{ fontSize: '14px', color: 'var(--white)' }}>{(monthlyRate * count).toLocaleString()} {t('pricing.aed')}</span></div>
              <div style={{ height: '1px', background: 'var(--border-soft)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}><span style={{ fontSize: '13px', color: 'var(--white)', fontWeight: 500 }}>{t('hire.dueNow')}</span><span className="font-display" style={{ fontSize: '18px', color: 'var(--gold)', fontWeight: 300 }}>{dueNow.toLocaleString()} {t('pricing.aed')}</span></div>
              <p style={{ fontSize: '12px', color: 'var(--white-dim)', marginTop: '16px', lineHeight: 1.6 }}>{t('hire.hiringFeeNote')}</p>
            </div>
          </motion.div>
        )}

        <button onClick={handleSubmit} disabled={!category || !workType || loading} style={{ width: '100%', padding: '16px', background: category && workType ? 'var(--gold)' : 'rgba(200,169,110,0.2)', border: `1px solid ${category && workType ? 'var(--gold)' : 'var(--border-soft)'}`, color: category && workType ? 'var(--navy)' : 'var(--white-dim)', fontSize: '14px', fontWeight: 600, cursor: category && workType ? 'pointer' : 'not-allowed', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {loading ? 'Processing...' : t('hire.payAndBrowse').replace('{amount}', dueNow.toLocaleString())}
        </button>
      </motion.div>
    </div>
  )
}
