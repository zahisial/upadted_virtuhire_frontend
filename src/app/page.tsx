'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import HowItWorks from '@/components/sections/HowItWorks';
import Pricing from '@/components/sections/Pricing';
import DashboardPreview from '@/components/sections/DashboardPreview';
import Features from '@/components/sections/Features';
import CTASection from '@/components/sections/CTASection';
import { DemoModalProvider } from '@/context/DemoModalContext';

export default function Home() {
  return (
    <DemoModalProvider>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Pricing />
        <DashboardPreview />
        <Features />
        <CTASection />
      </main>
      <Footer />
    </DemoModalProvider>
  );
}