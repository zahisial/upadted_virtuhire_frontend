'use client';
import { useLanguage } from '@/context/LanguageContext';

export default function Features() {
  const { t, isRTL } = useLanguage();
  const features = [
    { icon: '⚡', titleKey: 'features.f1.title', descKey: 'features.f1.desc' },
    { icon: '🎙', titleKey: 'features.f2.title', descKey: 'features.f2.desc' },
    { icon: '📊', titleKey: 'features.f3.title', descKey: 'features.f3.desc' },
    { icon: '🌐', titleKey: 'features.f4.title', descKey: 'features.f4.desc' },
  ];
  return (
    <section id="features" className="py-16 md:py-24 px-5 max-w-6xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center mb-12">
        <div className="text-[11px] tracking-[3px] uppercase text-[var(--gold-dim)] mb-3">
          {t('features.tagline')}
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-light text-white">
          {t('features.title')}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <div key={i} className="bg-[var(--navy-card)] border border-[var(--border-soft)] p-6 md:p-8">
            <div className="text-3xl mb-4">{f.icon}</div>
            <div className="text-base font-medium text-white mb-2">{t(f.titleKey)}</div>
            <div className="text-sm text-[var(--white-dim)]">{t(f.descKey)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}