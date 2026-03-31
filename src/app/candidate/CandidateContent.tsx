// app/candidate/CandidateClient.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AutoDemoModal from '@/components/AutoDemoModal';

export default function CandidateClient() {
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
    width: '100%', padding: '12px 16px', background: 'var(--navy-mid)',
    border: `1px solid ${focused ? 'var(--gold)' : 'var(--border-soft)'}`,
    color: 'var(--white)', fontSize: '14px', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s',
    opacity: demoClosed ? 0.6 : 1,
    cursor: demoClosed ? 'not-allowed' : 'auto',
  });
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--white-dim)', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' };
  const selectStyle: React.CSSProperties = { ...inputStyle(false), cursor: demoClosed ? 'not-allowed' : 'pointer', appearance: 'none' as any, WebkitAppearance: 'none' as any };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (demoClosed) return;
    if (!voice) { setError('Voice introduction is required'); return; }
    setLoading(true); setError('');
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
    } finally { setLoading(false); }
  };

  const rates: Record<string, { home: number; office: number }> = {
    'admin-sales': { home: 2150, office: 2700 },
    '2d-design': { home: 3200, office: 3600 },
  };

  if (success) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 5% 80px' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', maxWidth: '480px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', color: 'var(--gold)' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M6 16l7 7 13-13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h1 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, color: 'var(--white)', marginBottom: '16px' }}>{t('candidate.success')}</h1>
            <p style={{ fontSize: '15px', color: 'var(--white-dim)', lineHeight: 1.7 }}>{t('candidate.successMsg')}</p>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', padding: '120px 5% 80px' }} dir={isRTL ? 'rtl' : 'ltr'}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '12px', fontWeight: 500 }}>Get Hired</div>
              <h1 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, color: 'var(--white)', lineHeight: 1.2, marginBottom: '12px' }}>{t('candidate.title')}</h1>
              <p style={{ fontSize: '15px', color: 'var(--white-dim)', lineHeight: 1.7 }}>{t('candidate.subtitle')}</p>
            </div>

            {/* Pay Transparency */}
            <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border-soft)', padding: '24px', marginBottom: '32px', position: 'relative', opacity: demoClosed ? 0.6 : 1 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, var(--gold-dim), transparent)' }} />
              <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '16px', fontWeight: 500 }}>Pay Rates (transparent)</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {Object.entries(rates).map(([cat, r]) => (
                  <div key={cat}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--white)', marginBottom: '8px' }}>{cat === 'admin-sales' ? t('pricing.adminSales') : t('pricing.design')}</div>
                    <div style={{ fontSize: '12px', color: 'var(--white-dim)' }}>{t('candidate.homeRate')}: <span style={{ color: 'var(--gold)' }}>{r.home.toLocaleString()} AED</span></div>
                    <div style={{ fontSize: '12px', color: 'var(--white-dim)' }}>{t('candidate.officeRate')}: <span style={{ color: 'var(--gold)' }}>{r.office.toLocaleString()} AED</span></div>
                  </div>
                ))}
              </div>
            </div>

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

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'var(--navy-mid)',
                    border: `1px dashed ${cv ? 'var(--gold)' : 'var(--border-soft)'}`,
                    color: cv ? 'var(--gold)' : 'var(--white-dim)',
                    fontSize: '13px',
                    cursor: demoClosed ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                    opacity: demoClosed ? 0.6 : 1,
                  }}
                  disabled={demoClosed}
                >
                  {cv ? cv.name : 'Click to upload CV (PDF, DOC)'}
                </button>
              </div>

              {/* Voice Intro Upload */}
              <div>
                <label style={labelStyle}>{t('candidate.voiceIntro')}</label>
                <p style={{ fontSize: '12px', color: 'var(--white-dim)', marginBottom: '8px' }}>{t('candidate.voiceNote')}</p>
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
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'var(--navy-mid)',
                    border: `1px dashed ${voice ? 'var(--gold)' : 'rgba(200,169,110,0.3)'}`,
                    color: voice ? 'var(--gold)' : 'var(--gold-dim)',
                    fontSize: '13px',
                    cursor: demoClosed ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    opacity: demoClosed ? 0.6 : 1,
                  }}
                  disabled={demoClosed}
                >
                  {voice ? voice.name : 'Click to upload voice intro (audio file, max 1 min)'}
                </button>
              </div>

              {error && <div style={{ padding: '12px', background: 'rgba(220,80,80,0.1)', border: '1px solid rgba(220,80,80,0.3)', color: '#E05050', fontSize: '13px' }}>{error}</div>}

              <button
                type="submit"
                disabled={loading || demoClosed}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: loading || demoClosed ? 'rgba(200,169,110,0.4)' : 'var(--gold)',
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
                {loading ? t('candidate.submitting') : t('candidate.submit')}
                {!loading && <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>}
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