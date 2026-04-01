'use client';
import { useLanguage } from '@/context/LanguageContext';

export default function HowItWorks() {
  const { t, isRTL } = useLanguage();
  const steps = [
    { num: '01', title: t('how.step1.title'), desc: t('how.step1.desc') },
    { num: '02', title: t('how.step2.title'), desc: t('how.step2.desc') },
    { num: '03', title: t('how.step3.title'), desc: t('how.step3.desc') },
  ];
  return (
    <section id="how" className="py-16 md:py-24 px-5 max-w-6xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center mb-12">
        <div className="text-[11px] tracking-[3px] uppercase text-[var(--gold-dim)] mb-3">
          {t('how.tagline')}
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-light text-white">
          {t('how.title')}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <div key={i} className="bg-[var(--navy-card)] border border-[var(--border-soft)] p-6 md:p-8 relative">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--gold-dim)] to-transparent" />
            <div className="font-display text-3xl text-[var(--gold-dim)] mb-4">{s.num}</div>
            <div className="text-base font-medium text-white mb-2">{s.title}</div>
            <div className="text-sm text-[var(--white-dim)]">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}