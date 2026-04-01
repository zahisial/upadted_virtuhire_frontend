'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import AutoDemoModal from '@/components/AutoDemoModal';

export default function RegisterClient() {
  const { t, isRTL } = useLanguage();
  const { register } = useAuth();
  const router = useRouter();
  const [accountType, setAccountType] = useState<'individual' | 'corporate'>('individual');
  const [form, setForm] = useState({ email: '', password: '', phone: '', fullName: '', companyName: '', vatNumber: '', contactPerson: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const [demoClosed, setDemoClosed] = useState(false);
  const [countdown, setCountdown] = useState(5);

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

  const handleModalClose = () => setDemoClosed(true);

  const handleInput = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const inputStyle = (focused: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '12px 16px',
    background: 'var(--navy-mid)',
    border: `1px solid ${focused ? 'var(--gold)' : 'var(--border-soft)'}`,
    color: 'var(--white)',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s',
    opacity: demoClosed ? 0.6 : 1,
    cursor: demoClosed ? 'not-allowed' : 'auto',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--white-dim)',
    marginBottom: '8px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (demoClosed) return;
    setLoading(true);
    setError('');
    try {
      await register({
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: 'client',
        account_type: accountType,
        full_name: form.fullName,
        company_name: form.companyName,
        vat_number: form.vatNumber,
        contact_person: form.contactPerson,
      });
      router.push(`/verify?email=${encodeURIComponent(form.email)}`);
    } catch (err: any) {
      setError(err?.email?.[0] || err?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-lg mx-auto px-5" dir={isRTL ? 'rtl' : 'ltr'}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex items-center gap-2 text-[11px] tracking-[3px] uppercase text-[var(--gold-dim)] mb-3">
            <span className="w-4 h-px bg-[var(--gold-dim)]" />
            {t('register.step')}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-light text-white mb-3">
            {t('register.title')}
          </h1>
          <p className="text-sm text-[var(--white-dim)] mb-8">
            {t('register.description')}
          </p>

          {demoClosed && (
            <div className="bg-[rgba(200,169,110,0.1)] border border-[var(--gold)] p-3 mb-6 text-center text-[var(--gold)] text-sm font-medium">
              Demo mode ended. Redirecting to homepage in {countdown} seconds...
            </div>
          )}

          <div className="flex gap-1 mb-7 bg-[var(--navy-card)] p-1 border border-[var(--border-soft)] w-fit">
            {(['individual', 'corporate'] as const).map(type => (
              <button
                key={type}
                onClick={() => !demoClosed && setAccountType(type)}
                disabled={demoClosed}
                className={`px-6 py-2 text-sm font-medium transition ${
                  accountType === type
                    ? 'bg-[var(--navy-light)] border border-[var(--border)] text-[var(--gold)]'
                    : 'bg-transparent border border-transparent text-[var(--white-dim)]'
                } ${demoClosed ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                {t(`register.${type}`)}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            {error && (
              <div className="p-3 bg-[rgba(220,80,80,0.1)] border border-[rgba(220,80,80,0.3)] text-[#E05050] text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || demoClosed}
              className={`w-full py-4 border font-semibold text-sm flex items-center justify-center gap-2 transition ${
                loading || demoClosed
                  ? 'bg-[rgba(200,169,110,0.4)] border-[var(--gold)] text-[var(--navy)] cursor-not-allowed'
                  : 'bg-[var(--gold)] border-[var(--gold)] text-[var(--navy)] cursor-pointer hover:bg-[var(--gold-light)]'
              }`}
            >
              {loading ? 'Creating...' : t('register.next')}
              {!loading && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              )}
            </button>

            <div className="text-center">
              <a href="/login" className={`text-[var(--gold)] text-sm no-underline ${demoClosed ? 'opacity-60 pointer-events-none' : ''}`}>
                {t('register.haveAccount')}
              </a>
            </div>
          </form>
        </motion.div>
      </div>
      <AutoDemoModal onModalClose={handleModalClose} />
    </>
  );
}