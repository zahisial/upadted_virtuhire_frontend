'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import LanguageToggle from '@/components/ui/LanguageToggle';

export default function Navbar() {
  const { t, isRTL } = useLanguage();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen width
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [isMobile, mobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-[100vw] max-w-screen z-50 h-[72px] px-4 md:px-5 bg-[rgba(8,13,26,0.92)] backdrop-blur-lg border-b border-[var(--border-soft)] flex items-center justify-between ">
        <Link href="/" className="flex items-center gap-2 no-underline shrink-0">
          <div className="w-9 h-9 border-2 border-[var(--gold)] flex items-center justify-center font-serif text-lg font-semibold text-[var(--gold)]">V</div>
          <span className="font-medium text-[17px] text-white">Virtu<span className="text-[var(--gold)]">Hire</span></span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#how" className="text-[var(--white-dim)] text-sm no-underline hover:text-[var(--gold)] transition">
            {t('nav.howItWorks')}
          </a>
          <a href="#pricing" className="text-[var(--white-dim)] text-sm no-underline hover:text-[var(--gold)] transition">
            {t('nav.pricing')}
          </a>
          <a href="#features" className="text-[var(--white-dim)] text-sm no-underline hover:text-[var(--gold)] transition">
            {t('nav.features')}
          </a>
          <LanguageToggle />
          {user ? (
            <>
              <Link
                href="/client/dashboard"
                className="px-5 py-2 border border-[var(--gold)] text-[var(--gold)] text-sm no-underline font-medium hover:bg-[var(--gold)] hover:text-[var(--navy)] transition"
              >
                {t('nav.dashboard')}
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-transparent border border-[var(--border-soft)] text-[var(--white-dim)] text-xs cursor-pointer font-inherit hover:text-white hover:border-white transition"
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[var(--white-dim)] text-sm no-underline hover:text-white transition"
              >
                {t('nav.login')}
              </Link>
              <Link
                href="/client/register?demo=true"
                className="px-5 py-2 bg-[var(--gold)] border border-[var(--gold)] text-[var(--navy)] text-sm font-semibold no-underline hover:bg-[var(--gold-light)] transition"
              >
                {t('nav.hireTalent')}
              </Link>
              <Link
                href="/candidate?demo=true"
                className="px-5 py-2 border border-[var(--border)] text-white text-sm no-underline hover:border-[var(--gold)] hover:text-[var(--gold)] transition"
              >
                {t('nav.getHired')}
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu button - conditionally rendered based on isMobile */}
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center w-10 h-10 text-white focus:outline-none shrink-0"
            aria-label="Toggle menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        )}
      </header>

      {/* Mobile menu overlay */}
      {isMobile && (
        <div
          className={`fixed top-[72px] left-0 right-0 z-40 bg-[rgba(8,13,26,0.98)] backdrop-blur-lg border-b border-[var(--border-soft)] transition-all duration-300 overflow-hidden ${
            mobileMenuOpen ? 'max-h-[calc(100vh-72px)] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex flex-col p-5 gap-4 overflow-y-auto max-h-[calc(100vh-72px)] w-[100vw] ">
            <a
              href="#how"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--white-dim)] text-sm no-underline py-2 hover:text-[var(--gold)] transition"
            >
              {t('nav.howItWorks')}
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--white-dim)] text-sm no-underline py-2 hover:text-[var(--gold)] transition"
            >
              {t('nav.pricing')}
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--white-dim)] text-sm no-underline py-2 hover:text-[var(--gold)] transition"
            >
              {t('nav.features')}
            </a>
            <div className="py-2">
              <LanguageToggle />
            </div>
            {user ? (
              <>
                <Link
                  href="/client/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-5 py-2 border border-[var(--gold)] text-[var(--gold)] text-sm text-center no-underline font-medium hover:bg-[var(--gold)] hover:text-[var(--navy)] transition"
                >
                  {t('nav.dashboard')}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 bg-transparent border border-[var(--border-soft)] text-[var(--white-dim)] text-xs cursor-pointer font-inherit hover:text-white hover:border-white transition"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[var(--white-dim)] text-sm no-underline py-2 hover:text-white transition"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  href="/client/register?demo=true"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-5 py-2 bg-[var(--gold)] border border-[var(--gold)] text-[var(--navy)] text-sm font-semibold text-center no-underline hover:bg-[var(--gold-light)] transition"
                >
                  {t('nav.hireTalent')}
                </Link>
                <Link
                  href="/candidate?demo=true"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-5 py-2 border border-[var(--border)] text-white text-sm text-center no-underline hover:border-[var(--gold)] hover:text-[var(--gold)] transition"
                >
                  {t('nav.getHired')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}