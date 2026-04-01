'use client';
import { useLanguage } from '@/context/LanguageContext';

const plans = [
  { key: 'adminSales', home: 2150, office: 2700 },
  { key: 'design', home: 3200, office: 3600 },
];

export default function Pricing() {
  const { t, isRTL } = useLanguage();
  return (
    <section id="pricing" className="py-16 md:py-24 px-5 max-w-4xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center mb-12">
        <div className="text-[11px] tracking-[3px] uppercase text-[var(--gold-dim)] mb-3">
          {t('pricing.tagline')}
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-light text-white">
          {t('pricing.title')}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map(p => (
          <div key={p.key} className="bg-[var(--navy-card)] border border-[var(--border-soft)] p-6 md:p-8 relative">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--gold-dim)] to-transparent" />
            <div className="text-base font-medium text-white mb-6">{t(`pricing.${p.key}`)}</div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-[var(--white-dim)]">{t('pricing.home')}</span>
                <span className="font-display text-2xl md:text-3xl text-[var(--gold)] font-light">
                  {p.home.toLocaleString()} <span className="text-sm text-[var(--gold-dim)]">{t('pricing.aed')}{t('pricing.month')}</span>
                </span>
              </div>
              <div className="h-px bg-[var(--border-soft)]" />
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-[var(--white-dim)]">{t('pricing.office')}</span>
                <span className="font-display text-2xl md:text-3xl text-[var(--gold)] font-light">
                  {p.office.toLocaleString()} <span className="text-sm text-[var(--gold-dim)]">{t('pricing.aed')}{t('pricing.month')}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-[var(--white-dim)] mt-6">{t('pricing.hiringFee')}</p>
    </section>
  );
}