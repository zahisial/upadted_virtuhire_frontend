'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useNotifications } from '@/context/NotificationContext'
import { hiringAPI, billingAPI, supportAPI, notificationsAPI } from '@/lib/api'
import LanguageToggle from '@/components/ui/LanguageToggle'
import Link from 'next/link'

type Tab = 'overview' | 'employees' | 'billing' | 'requests' | 'support' | 'services' | 'settings' | 'cancel'

export default function DashboardPage() {
  const { t, isRTL } = useLanguage()
  const { user, logout } = useAuth()
  const { notifications, unreadCount, markAllRead } = useNotifications()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('overview')
  const [employees, setEmployees] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // New ticket form
  const [ticketForm, setTicketForm] = useState({ category: 'technical', subject: '', message: '' })

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [emp, inv, pay, req, tix] = await Promise.allSettled([
          hiringAPI.getEmployees(), billingAPI.getInvoices(), billingAPI.getPayments(),
          hiringAPI.getRequests(), supportAPI.getTickets(),
        ])
        if (emp.status === 'fulfilled') setEmployees(emp.value || [])
        if (inv.status === 'fulfilled') setInvoices(inv.value || [])
        if (pay.status === 'fulfilled') setPayments(pay.value || [])
        if (req.status === 'fulfilled') setRequests(req.value || [])
        if (tix.status === 'fulfilled') setTickets(tix.value?.results || tix.value || [])
      } catch {} finally { setLoading(false) }
    }
    load()
  }, [])

  const totalMonthlyCost = employees.filter(e => e.status === 'active').reduce((sum: number, e: any) => sum + e.monthly_rate, 0)
  const activeCount = employees.filter(e => e.status === 'active').length

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: t('dash.overview') },
    { key: 'employees', label: t('dash.employees') },
    { key: 'billing', label: t('dash.billing') },
    { key: 'requests', label: t('dash.requests') },
    { key: 'support', label: t('dash.support') },
    { key: 'services', label: t('dash.services') },
    { key: 'settings', label: t('dash.settings') },
    { key: 'cancel', label: t('dash.cancelService') },
  ]

  const cardStyle: React.CSSProperties = { background: 'var(--navy-card)', border: '1px solid var(--border-soft)', padding: '24px', position: 'relative' }
  const labelStyle: React.CSSProperties = { fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '16px', fontWeight: 500 }
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', background: 'var(--navy-mid)', border: '1px solid var(--border-soft)', color: 'var(--white)', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }
  const btnGold: React.CSSProperties = { padding: '12px 24px', background: 'var(--gold)', border: '1px solid var(--gold)', color: 'var(--navy)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }
  const btnOutline: React.CSSProperties = { padding: '10px 20px', background: 'transparent', border: '1px solid var(--border-soft)', color: 'var(--white-dim)', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }

  const handleReplace = async (empId: number, name: string) => {
    if (!confirm(t('dash.replaceConfirm'))) return
    try { await hiringAPI.replaceEmployee(empId); window.location.reload() } catch {}
  }

  const handleSubmitTicket = async () => {
    if (!ticketForm.subject || !ticketForm.message) return
    try {
      await supportAPI.createTicket(ticketForm)
      setTicketForm({ category: 'technical', subject: '', message: '' })
      const tix = await supportAPI.getTickets()
      setTickets(tix.results || tix || [])
    } catch {}
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top Bar */}
      <header style={{ height: '64px', padding: '0 5%', background: 'rgba(8,13,26,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', border: '1.5px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', fontWeight: 600, color: 'var(--gold)' }}>V</div>
          <span style={{ fontWeight: 500, fontSize: '16px', color: 'var(--white)' }}>Virtu<span style={{ color: 'var(--gold)' }}>Hire</span></span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '13px', color: 'var(--white-dim)' }}>{user?.email}</span>
          <LanguageToggle />
          <button onClick={logout} style={btnOutline}>{t('nav.logout')}</button>
        </div>
      </header>

      <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto', padding: '0 2%' }}>
        {/* Sidebar */}
        <aside style={{ width: '200px', padding: '24px 0', flexShrink: 0, borderRight: isRTL ? 'none' : '1px solid var(--border-soft)', borderLeft: isRTL ? '1px solid var(--border-soft)' : 'none' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              display: 'block', width: '100%', padding: '10px 20px', textAlign: isRTL ? 'right' : 'left',
              background: tab === t.key ? 'rgba(200,169,110,0.08)' : 'transparent',
              border: 'none', borderRight: !isRTL && tab === t.key ? '2px solid var(--gold)' : 'none',
              borderLeft: isRTL && tab === t.key ? '2px solid var(--gold)' : 'none',
              color: tab === t.key ? 'var(--gold)' : 'var(--white-dim)',
              fontSize: '13px', fontWeight: tab === t.key ? 500 : 400, cursor: 'pointer', fontFamily: 'inherit',
            }}>{t.label}</button>
          ))}
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '32px', minHeight: 'calc(100vh - 64px)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--white-dim)' }}>{t('confirm.loading')}</div>
          ) : (
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>

              {/* OVERVIEW TAB */}
              {tab === 'overview' && (
                <div>
                  <h2 className="font-display" style={{ fontSize: '28px', fontWeight: 300, color: 'var(--white)', marginBottom: '24px' }}>{t('dash.overview')}</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                    <div style={cardStyle}>
                      <div style={labelStyle}>{t('dash.activeEmployees')}</div>
                      <div className="font-display" style={{ fontSize: '36px', color: 'var(--gold)', fontWeight: 300 }}>{activeCount}</div>
                    </div>
                    <div style={cardStyle}>
                      <div style={labelStyle}>{t('dash.monthlyCost')}</div>
                      <div className="font-display" style={{ fontSize: '36px', color: 'var(--gold)', fontWeight: 300 }}>{totalMonthlyCost.toLocaleString()} <span style={{ fontSize: '16px', color: 'var(--gold-dim)' }}>{t('pricing.aed')}</span></div>
                    </div>
                    <div style={cardStyle}>
                      <div style={labelStyle}>{t('dash.notifications')}</div>
                      <div className="font-display" style={{ fontSize: '36px', color: unreadCount > 0 ? 'var(--gold)' : 'var(--white-dim)', fontWeight: 300 }}>{unreadCount}</div>
                    </div>
                  </div>
                  {activeCount === 0 && (
                    <div style={{ ...cardStyle, textAlign: 'center', padding: '48px' }}>
                      <p style={{ color: 'var(--white-dim)', marginBottom: '20px' }}>{t('dash.noEmployees')}</p>
                      <button onClick={() => router.push('/client/hire')} style={btnGold}>{t('dash.hireFirst')}</button>
                    </div>
                  )}
                  {/* Recent Notifications */}
                  {notifications.length > 0 && (
                    <div style={cardStyle}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={labelStyle}>{t('dash.recentActivity')}</div>
                        {unreadCount > 0 && <button onClick={markAllRead} style={{ ...btnOutline, fontSize: '11px', padding: '6px 12px' }}>Mark all read</button>}
                      </div>
                      {notifications.slice(0, 5).map(n => (
                        <div key={n.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border-soft)', display: 'flex', gap: '12px', alignItems: 'flex-start', opacity: n.read ? 0.6 : 1 }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: n.read ? 'var(--border-soft)' : 'var(--gold)', marginTop: '6px', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: '13px', color: 'var(--white)', fontWeight: 500 }}>{n.title}</div>
                            <div style={{ fontSize: '12px', color: 'var(--white-dim)', marginTop: '2px' }}>{n.message}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* EMPLOYEES TAB */}
              {tab === 'employees' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 className="font-display" style={{ fontSize: '28px', fontWeight: 300, color: 'var(--white)' }}>{t('dash.employees')}</h2>
                    <button onClick={() => router.push('/client/hire')} style={btnGold}>{t('dash.addEmployee')}</button>
                  </div>
                  {employees.length === 0 ? (
                    <div style={{ ...cardStyle, textAlign: 'center', padding: '48px' }}><p style={{ color: 'var(--white-dim)' }}>{t('dash.noEmployees')}</p></div>
                  ) : employees.map(emp => (
                    <div key={emp.id} style={{ ...cardStyle, marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--white)', marginBottom: '4px' }}>{isRTL ? emp.candidate_name_ar || emp.candidate_name : emp.candidate_name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--white-dim)' }}>{emp.category} · {emp.work_preference} · Started {emp.start_date}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ padding: '4px 12px', fontSize: '11px', fontWeight: 500, background: emp.status === 'active' ? 'rgba(125,201,156,0.15)' : 'rgba(220,80,80,0.15)', color: emp.status === 'active' ? '#7DC99C' : '#E05050', border: `1px solid ${emp.status === 'active' ? 'rgba(125,201,156,0.3)' : 'rgba(220,80,80,0.3)'}` }}>{emp.status}</div>
                          <div className="font-display" style={{ fontSize: '20px', color: 'var(--gold)', fontWeight: 300 }}>{emp.monthly_rate?.toLocaleString()} {t('pricing.aed')}</div>
                          {emp.status === 'active' && !emp.replacement_requested && (
                            <button onClick={() => handleReplace(emp.id, emp.candidate_name)} style={btnOutline}>{t('dash.replace')}</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* BILLING TAB */}
              {tab === 'billing' && (
                <div>
                  <h2 className="font-display" style={{ fontSize: '28px', fontWeight: 300, color: 'var(--white)', marginBottom: '24px' }}>{t('dash.billing')}</h2>
                  <div style={labelStyle}>{t('dash.invoices')}</div>
                  {invoices.length === 0 ? (
                    <div style={{ ...cardStyle, textAlign: 'center', padding: '32px' }}><p style={{ color: 'var(--white-dim)' }}>{t('dash.noInvoices')}</p></div>
                  ) : invoices.map((inv: any) => (
                    <div key={inv.id} style={{ ...cardStyle, marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--white)' }}>{inv.invoice_number}</div>
                        <div style={{ fontSize: '12px', color: 'var(--white-dim)' }}>{inv.description}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ padding: '4px 10px', fontSize: '11px', background: inv.status === 'paid' ? 'rgba(125,201,156,0.15)' : 'rgba(200,169,110,0.15)', color: inv.status === 'paid' ? '#7DC99C' : 'var(--gold)', border: '1px solid var(--border-soft)' }}>{inv.status}</span>
                        <span className="font-display" style={{ fontSize: '18px', color: 'var(--gold)', fontWeight: 300 }}>{inv.amount?.toLocaleString()} {t('pricing.aed')}</span>
                      </div>
                    </div>
                  ))}
                  <div style={{ ...labelStyle, marginTop: '32px' }}>{t('dash.paymentHistory')}</div>
                  {payments.map((p: any) => (
                    <div key={p.id} style={{ ...cardStyle, marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '13px', color: 'var(--white)' }}>{p.payment_type} — {p.amount?.toLocaleString()} {t('pricing.aed')}</div>
                      <span style={{ fontSize: '12px', color: p.status === 'succeeded' ? '#7DC99C' : 'var(--white-dim)' }}>{p.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* REQUESTS TAB */}
              {tab === 'requests' && (
                <div>
                  <h2 className="font-display" style={{ fontSize: '28px', fontWeight: 300, color: 'var(--white)', marginBottom: '24px' }}>{t('dash.requests')}</h2>
                  {requests.length === 0 ? (
                    <div style={{ ...cardStyle, textAlign: 'center', padding: '32px' }}><p style={{ color: 'var(--white-dim)' }}>{t('dash.noRequests')}</p></div>
                  ) : requests.map((r: any) => (
                    <div key={r.id} style={{ ...cardStyle, marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--white)' }}>{r.category} — x{r.employee_count}</div>
                          <div style={{ fontSize: '12px', color: 'var(--white-dim)' }}>{r.work_type} · Batch {r.batches_used}</div>
                        </div>
                        <span style={{ padding: '4px 12px', fontSize: '11px', background: 'rgba(200,169,110,0.15)', color: 'var(--gold)', border: '1px solid var(--border-soft)' }}>{r.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SUPPORT TAB */}
              {tab === 'support' && (
                <div>
                  <h2 className="font-display" style={{ fontSize: '28px', fontWeight: 300, color: 'var(--white)', marginBottom: '24px' }}>{t('dash.support')}</h2>
                  <div style={{ ...cardStyle, marginBottom: '24px' }}>
                    <div style={labelStyle}>{t('dash.newTicket')}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <select value={ticketForm.category} onChange={e => setTicketForm(f => ({ ...f, category: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                        <option value="technical">Technical Support</option>
                        <option value="billing">Billing & Finance</option>
                        <option value="hr">HR / Employee Issues</option>
                        <option value="sales">Sales</option>
                        <option value="cancellation">Cancellation</option>
                      </select>
                      <input value={ticketForm.subject} onChange={e => setTicketForm(f => ({ ...f, subject: e.target.value }))} placeholder={t('dash.ticketSubject')} style={inputStyle} />
                      <textarea value={ticketForm.message} onChange={e => setTicketForm(f => ({ ...f, message: e.target.value }))} placeholder={t('dash.ticketMessage')} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
                      <button onClick={handleSubmitTicket} style={{ ...btnGold, width: 'fit-content' }}>{t('dash.submitTicket')}</button>
                    </div>
                  </div>
                  {tickets.length === 0 ? (
                    <div style={{ ...cardStyle, textAlign: 'center', padding: '32px' }}><p style={{ color: 'var(--white-dim)' }}>{t('dash.noTickets')}</p></div>
                  ) : tickets.map((tix: any) => (
                    <div key={tix.id} style={{ ...cardStyle, marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--white)' }}>{tix.subject}</div>
                          <div style={{ fontSize: '12px', color: 'var(--white-dim)' }}>{tix.category}</div>
                        </div>
                        <span style={{ padding: '4px 12px', fontSize: '11px', background: tix.status === 'resolved' ? 'rgba(125,201,156,0.15)' : 'rgba(200,169,110,0.15)', color: tix.status === 'resolved' ? '#7DC99C' : 'var(--gold)', border: '1px solid var(--border-soft)' }}>{tix.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SERVICES TAB */}
              {tab === 'services' && (
                <div>
                  <h2 className="font-display" style={{ fontSize: '28px', fontWeight: 300, color: 'var(--white)', marginBottom: '24px' }}>{t('dash.services')}</h2>
                  {[
                    { title: t('dash.buyout'), desc: t('dash.buyoutDesc'), fee: t('dash.buyoutFee') },
                    { title: t('dash.supervisor'), desc: t('dash.supervisorDesc'), fee: 'Free' },
                    { title: t('dash.accountManager'), desc: 'Contact your dedicated account manager', fee: '' },
                  ].map((s, i) => (
                    <div key={i} style={{ ...cardStyle, marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--white)', marginBottom: '4px' }}>{s.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--white-dim)' }}>{s.desc}</div>
                      </div>
                      {s.fee && <span className="font-display" style={{ fontSize: '18px', color: 'var(--gold)', fontWeight: 300 }}>{s.fee}</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* SETTINGS TAB */}
              {tab === 'settings' && (
                <div>
                  <h2 className="font-display" style={{ fontSize: '28px', fontWeight: 300, color: 'var(--white)', marginBottom: '24px' }}>{t('dash.settings')}</h2>
                  <div style={cardStyle}>
                    <div style={labelStyle}>{t('dash.profileDetails')}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ fontSize: '13px', color: 'var(--white-dim)' }}>Email: <span style={{ color: 'var(--white)' }}>{user?.email}</span></div>
                      <div style={{ fontSize: '13px', color: 'var(--white-dim)' }}>Phone: <span style={{ color: 'var(--white)' }}>{user?.phone || 'Not set'}</span></div>
                      <div style={{ fontSize: '13px', color: 'var(--white-dim)' }}>Role: <span style={{ color: 'var(--white)' }}>{user?.role}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* CANCEL TAB */}
              {tab === 'cancel' && (
                <div>
                  <h2 className="font-display" style={{ fontSize: '28px', fontWeight: 300, color: 'var(--white)', marginBottom: '24px' }}>{t('dash.cancelService')}</h2>
                  <div style={{ ...cardStyle, borderColor: 'rgba(220,80,80,0.2)' }}>
                    <p style={{ fontSize: '14px', color: 'var(--white-dim)', lineHeight: 1.7, marginBottom: '24px' }}>{t('dash.cancelNotice')}</p>
                    <button style={{ padding: '12px 24px', background: 'rgba(220,80,80,0.15)', border: '1px solid rgba(220,80,80,0.3)', color: '#E05050', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>{t('dash.confirmCancel')}</button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}
