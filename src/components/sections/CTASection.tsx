'use client';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function CTASection() {
  const { t, isRTL } = useLanguage();
  return (
    <section className="py-16 md:py-24 px-5 text-center" dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4">
        {t('cta.title')}
      </h2>
      <p className="text-base text-[var(--white-dim)] max-w-2xl mx-auto mb-8">
        {t('cta.subtitle')}
      </p>
      <Link
        href="/client/register?demo=true"
        className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--gold)] border border-[var(--gold)] text-[var(--navy)] text-sm font-semibold"
      >
        {t('cta.button')}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </Link>
    </section>
  );
}