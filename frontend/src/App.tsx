import { useState } from 'react'
import { Landing } from '@/pages/Landing'
import { Loader } from '@/components/Loader'
import { AudienceGate, type Audience } from '@/components/AudienceGate'

function App() {
  const [loading, setLoading] = useState(true)
  const [audience, setAudience] = useState<Audience | null>(null)

  return (
    <>
      {loading && <Loader onDone={() => setLoading(false)} />}
      {!loading && !audience && <AudienceGate onSelect={setAudience} />}
      {audience && <Landing />}
    </>
  )
}

export default App
