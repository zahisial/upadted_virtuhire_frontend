'use client'
import LegalPage from '@/components/LegalPage'
import { useLanguage } from '@/context/LanguageContext'

export default function Page() {
  const { t } = useLanguage()
  const sections = []
  for (let i = 1; i <= 7; i++) {
    const title = t(`legal.refund.section${i}.title`)
    const content = t(`legal.refund.section${i}.content`)
    if (title !== `legal.refund.section${i}.title`) {
      sections.push({ title, content })
    }
  }
  return (
    <LegalPage title={t(`legal.refund.title`)}>
      <p>{t(`legal.refund.lastUpdated`)}</p>
      {sections.map((s, i) => (
        <div key={i}>
          <h2 style={{ fontSize: '20px', fontWeight: 500, color: 'var(--gold)', margin: '24px 0 12px' }}>{s.title}</h2>
          <p>{s.content}</p>
        </div>
      ))}
    </LegalPage>
  )
}
