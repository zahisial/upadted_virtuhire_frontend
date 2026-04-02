'use client';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Hero() {
  const { t, isRTL } = useLanguage();

  return (
    <section className="min-h-screen flex items-center justify-center py-24 px-5 relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[600px] h-[600px] rounded-full border border-[rgba(200,169,110,0.06)]" />
      <div className="text-center max-w-3xl relative z-10 px-4">
        <div className="flex items-center justify-center gap-3 text-[11px] tracking-[3px] uppercase text-[var(--gold-dim)] mb-5">
          <span className="w-6 h-px bg-[var(--gold-dim)]" />
          {t('hero.tagline')}
          <span className="w-6 h-px bg-[var(--gold-dim)]" />
        </div>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight mb-6">
          {t('hero.title')}
        </h1>
        <p className="text-base md:text-lg text-[var(--white-dim)] max-w-2xl mx-auto mb-10">
          {t('hero.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/client/register?demo=true"
            className="px-6 py-3 bg-[var(--gold)] border border-[var(--gold)] text-[var(--navy)] text-sm font-semibold text-center"
          >
            {t('hero.cta1')}
          </Link>
          <Link
            href="/candidate?demo=true"
            className="px-6 py-3 border border-[var(--border)] text-white text-sm text-center"
          >
            {t('hero.cta2')}
          </Link>
        </div>
      </div>
    </section>
  );
}