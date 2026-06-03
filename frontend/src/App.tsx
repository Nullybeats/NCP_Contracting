import { useState } from 'react'
import { Landing } from '@/pages/Landing'
import { Loader } from '@/components/Loader'
import { AudienceGate, type Audience } from '@/components/AudienceGate'
import { ContactSection } from '@/components/ContactSection'

function App() {
  const [loading, setLoading] = useState(true)
  const [audience, setAudience] = useState<Audience | null>(null)

  return (
    <>
      {loading && <Loader onDone={() => setLoading(false)} />}
      {!loading && !audience && (
        <div className="min-h-svh bg-black">
          <AudienceGate onSelect={setAudience} />
          <ContactSection />
        </div>
      )}
      {audience && <Landing audience={audience} />}
    </>
  )
}

export default App
