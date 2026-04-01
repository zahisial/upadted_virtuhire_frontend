'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle from '@/components/ui/LanguageToggle';

const steps = [
  { num: 1, labelEn: 'Register', labelAr: 'التسجيل', href: '/client/register' },
  { num: 2, labelEn: 'Contract', labelAr: 'العقد', href: '/client/contract' },
  { num: 3, labelEn: 'Payment', labelAr: 'الدفع', href: '/client/payment' },
  { num: 4, labelEn: 'Hire', labelAr: 'التوظيف', href: '/client/hire' },
  { num: 5, labelEn: 'Talent', labelAr: 'المرشحون', href: '/client/talent' },
  { num: 6, labelEn: 'Confirm', labelAr: 'التأكيد', href: '/client/confirm' },
  { num: 7, labelEn: 'Dashboard', labelAr: 'لوحة التحكم', href: '/client/dashboard' },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isRTL } = useLanguage();
  const currentStep = steps.findIndex(s => pathname.startsWith(s.href)) + 1;
  const progressPct = ((currentStep - 1) / (steps.length - 1)) * 100;
  const isDashboard = pathname.startsWith('/client/dashboard');

  if (isDashboard) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[var(--navy)] flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-100 h-16 px-5 bg-[rgba(8,13,26,0.95)] backdrop-blur-lg border-b border-[var(--border-soft)] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 border-2 border-[var(--gold)] flex items-center justify-center font-serif text-base font-semibold text-[var(--gold)]">V</div>
          <span className="font-medium text-base text-white">Virtu<span className="text-[var(--gold)]">Hire</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[var(--white-dim)]">
            {isRTL ? `الخطوة ${currentStep} من ${steps.length}` : `Step ${currentStep} of ${steps.length}`}
          </span>
          <LanguageToggle />
        </div>
      </header>

      <div className="fixed top-16 left-0 right-0 z-99 bg-[var(--navy-mid)] border-b border-[var(--border-soft)] px-5">
        <div className="h-0.5 bg-[rgba(255,255,255,0.06)] relative">
          <div className="absolute top-0 left-0 h-full bg-[var(--gold)] transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="flex justify-between py-3 gap-1 sm:gap-2 text-xs sm:text-sm" dir={isRTL ? 'rtl' : 'ltr'}>
          {steps.map(step => {
            const isActive = step.num === currentStep;
            const isDone = step.num < currentStep;
            return (
              <div key={step.num} className="flex items-center gap-1 sm:gap-2 transition-opacity" style={{ opacity: isActive ? 1 : isDone ? 0.7 : 0.35 }}>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-semibold ${
                  isDone ? 'bg-[var(--gold-dim)] border-[var(--gold-dim)] text-[var(--navy)]' :
                  isActive ? 'border-[var(--gold)] bg-[rgba(200,169,110,0.15)] text-[var(--gold)]' :
                  'border-[var(--border-soft)] text-[var(--white-dim)]'
                }`}>
                  {isDone ? '✓' : step.num}
                </div>
                <span className={`hidden sm:inline text-[11px] ${isActive ? 'text-[var(--gold)]' : 'text-[var(--white-dim)]'}`}>
                  {isRTL ? step.labelAr : step.labelEn}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <main className="flex-1 pt-32 pb-16">{children}</main>
    </div>
  );
}