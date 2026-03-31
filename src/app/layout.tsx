import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
import { AuthProvider } from '@/context/AuthContext'
import { NotificationProvider } from '@/context/NotificationContext'

export const metadata: Metadata = {
  title: 'VirtuHire — Hire Trained Offshore Staff in 48 Hours',
  description: 'GCC offshore staffing platform. Pre-vetted Admin, Sales & Design talent from Pakistan, managed through one clean dashboard.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <AuthProvider>
          <NotificationProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
