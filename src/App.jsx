import { useEffect, useState } from 'react'
import LandingPage from './pages/LandingPage'
import StudioExperience from './pages/StudioExperience'

/**
 * الموقع قسمان:
 *  - landing: صفحة العرض — صور المنتجات الحقيقية + شرح الفكرة (تفتح أولاً)
 *  - studio:  استوديو الـ 3D — التجربة التفاعلية (تفكيك الطبقات + تخصيص الساندويتش)
 */
export default function App() {
  const [view, setView] = useState('landing')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [view])

  if (view === 'studio') {
    return <StudioExperience onBack={() => setView('landing')} />
  }
  return <LandingPage onOpenStudio={() => setView('studio')} />
}
