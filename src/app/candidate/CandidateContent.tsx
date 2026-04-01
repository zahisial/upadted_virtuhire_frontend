'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AutoDemoModal from '@/components/AutoDemoModal';

export default function CandidatePortal() {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', location: '', category: 'admin-sales', workPreference: 'home', experience: '' });
  const [cv, setCv] = useState<File | null>(null);
  const [voice, setVoice] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState('');
  const [demoClosed, setDemoClosed] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const cvRef = useRef<HTMLInputElement>(null);
  const voiceRef = useRef<HTMLInputElement>(null);

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

  const handleInput = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

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

  const selectStyle: React.CSSProperties = {
    ...inputStyle(false),
    cursor: demoClosed ? 'not-allowed' : 'pointer',
    appearance: 'none' as any,
    WebkitAppearance: 'none' as any,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (demoClosed) return;
    if (!voice) { setError('Voice introduction is required'); return; }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('full_name', form.fullName);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('location', form.location);
      formData.append('category', form.category);
      formData.append('work_preference', form.workPreference);
      formData.append('experience', form.experience);
      if (cv) formData.append('cv', cv);
      if (voice) formData.append('voice_intro', voice);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${API_URL}/candidates/apply/`, { method: 'POST', body: formData });
      if (!res.ok) { const err = await res.json(); throw err; }
      setSuccess(true);
    } catch (err: any) {
      setError(err?.detail || err?.voice_intro?.[0] || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const rates: Record<string, { home: number; office: number }> = {
    'admin-sales': { home: 2150, office: 2700 },
    '2d-design': { home: 3200, office: 3600 },
  };

  if (success) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center py-24 px-5">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full border-2 border-[var(--gold)] flex items-center justify-center mx-auto mb-8 text-[var(--gold)]">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 16l7 7 13-13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-light text-white mb-4">{t('candidate.success')}</h1>
            <p className="text-sm text-[var(--white-dim)]">{t('candidate.successMsg')}</p>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-24 px-5" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-12">
              <div className="text-[11px] tracking-[3px] uppercase text-[var(--gold-dim)] mb-3 font-medium">Get Hired</div>
              <h1 className="font-display text-3xl md:text-4xl font-light text-white mb-3">{t('candidate.title')}</h1>
              <p className="text-sm text-[var(--white-dim)]">{t('candidate.subtitle')}</p>
            </div>

            {demoClosed && (
              <div className="bg-[rgba(200,169,110,0.1)] border border-[var(--gold)] p-3 mb-6 text-center text-[var(--gold)] text-sm font-medium">
                Demo mode ended. Redirecting to homepage in {countdown} seconds...
              </div>
            )}

            <div className="bg-[var(--navy-card)] border border-[var(--border-soft)] p-6 mb-8 relative" style={{ opacity: demoClosed ? 0.6 : 1 }}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--gold-dim)] to-transparent" />
              <div className="text-[11px] tracking-[2px] uppercase text-[var(--gold-dim)] mb-4 font-medium">Pay Rates (transparent)</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(rates).map(([cat, r]) => (
                  <div key={cat}>
                    <div className="text-sm font-medium text-white mb-2">{cat === 'admin-sales' ? t('pricing.adminSales') : t('pricing.design')}</div>
                    <div className="text-xs text-[var(--white-dim)]">{t('candidate.homeRate')}: <span className="text-[var(--gold)]">{r.home.toLocaleString()} AED</span></div>
                    <div className="text-xs text-[var(--white-dim)]">{t('candidate.officeRate')}: <span className="text-[var(--gold)]">{r.office.toLocaleString()} AED</span></div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label style={labelStyle}>{t('candidate.fullName')}</label>
                <input
                  value={form.fullName}
                  onChange={e => !demoClosed && handleInput('fullName', e.target.value)}
                  style={inputStyle(focused === 'name')}
                  onFocus={() => !demoClosed && setFocused('name')}
                  onBlur={() => setFocused('')}
                  disabled={demoClosed}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>{t('candidate.email')}</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => !demoClosed && handleInput('email', e.target.value)}
                    style={inputStyle(focused === 'email')}
                    onFocus={() => !demoClosed && setFocused('email')}
                    onBlur={() => setFocused('')}
                    disabled={demoClosed}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>{t('candidate.phone')}</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => !demoClosed && handleInput('phone', e.target.value)}
                    placeholder="+92 3XX XXXXXXX"
                    style={inputStyle(focused === 'phone')}
                    onFocus={() => !demoClosed && setFocused('phone')}
                    onBlur={() => setFocused('')}
                    disabled={demoClosed}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>{t('candidate.location')}</label>
                <input
                  value={form.location}
                  onChange={e => !demoClosed && handleInput('location', e.target.value)}
                  placeholder="City, Country"
                  style={inputStyle(focused === 'loc')}
                  onFocus={() => !demoClosed && setFocused('loc')}
                  onBlur={() => setFocused('')}
                  disabled={demoClosed}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>{t('candidate.category')}</label>
                  <select
                    value={form.category}
                    onChange={e => !demoClosed && handleInput('category', e.target.value)}
                    style={selectStyle}
                    disabled={demoClosed}
                  >
                    <option value="admin-sales">{t('pricing.adminSales')}</option>
                    <option value="2d-design">{t('pricing.design')}</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>{t('candidate.workPreference')}</label>
                  <select
                    value={form.workPreference}
                    onChange={e => !demoClosed && handleInput('workPreference', e.target.value)}
                    style={selectStyle}
                    disabled={demoClosed}
                  >
                    <option value="home">{t('pricing.home')}</option>
                    <option value="office">{t('pricing.office')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>{t('candidate.experience')}</label>
                <textarea
                  value={form.experience}
                  onChange={e => !demoClosed && handleInput('experience', e.target.value)}
                  rows={4}
                  placeholder="Describe your experience, skills, and what you bring to the role..."
                  style={{ ...inputStyle(focused === 'exp'), resize: 'vertical' }}
                  onFocus={() => !demoClosed && setFocused('exp')}
                  onBlur={() => setFocused('')}
                  disabled={demoClosed}
                />
              </div>

              {/* CV Upload */}
              <div>
                <label style={labelStyle}>{t('candidate.cv')}</label>
                <input
                  ref={cvRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={e => !demoClosed && setCv(e.target.files?.[0] || null)}
                  style={{ display: 'none' }}
                  disabled={demoClosed}
                />
                <button
                  type="button"
                  onClick={() => !demoClosed && cvRef.current?.click()}
                  className={`w-full py-4 bg-[var(--navy-mid)] text-sm transition ${
                    demoClosed ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-[var(--gold)]'
                  }`}
                  style={{
                    border: `1px dashed ${cv ? 'var(--gold)' : 'var(--border-soft)'}`,
                    color: cv ? 'var(--gold)' : 'var(--white-dim)',
                  }}
                  disabled={demoClosed}
                >
                  {cv ? cv.name : 'Click to upload CV (PDF, DOC)'}
                </button>
              </div>

              {/* Voice Intro Upload */}
              <div>
                <label style={labelStyle}>{t('candidate.voiceIntro')}</label>
                <p className="text-xs text-[var(--white-dim)] mb-2">{t('candidate.voiceNote')}</p>
                <input
                  ref={voiceRef}
                  type="file"
                  accept="audio/*"
                  onChange={e => !demoClosed && setVoice(e.target.files?.[0] || null)}
                  style={{ display: 'none' }}
                  disabled={demoClosed}
                />
                <button
                  type="button"
                  onClick={() => !demoClosed && voiceRef.current?.click()}
                  className={`w-full py-4 bg-[var(--navy-mid)] text-sm transition ${
                    demoClosed ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-[var(--gold)]'
                  }`}
                  style={{
                    border: `1px dashed ${voice ? 'var(--gold)' : 'rgba(200,169,110,0.3)'}`,
                    color: voice ? 'var(--gold)' : 'var(--gold-dim)',
                  }}
                  disabled={demoClosed}
                >
                  {voice ? voice.name : 'Click to upload voice intro (audio file, max 1 min)'}
                </button>
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
                {loading ? t('candidate.submitting') : t('candidate.submit')}
                {!loading && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
      <AutoDemoModal onModalClose={handleModalClose} />
    </>
  );
}