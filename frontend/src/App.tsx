import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader } from '@/components/Loader'
import { AudienceGate, type Audience } from '@/components/AudienceGate'
import { ContactSection } from '@/components/ContactSection'

function App() {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const handleAudience = (audience: Audience) => {
    const filter = audience === 'developer' ? 'developer' : 'homeowner'
    navigate(`/services?audience=${filter}`)
  }

  return (
    <>
      {loading && <Loader onDone={() => setLoading(false)} />}
      {!loading && (
        <div className="min-h-svh bg-black">
          <AudienceGate onSelect={handleAudience} />
          <ContactSection />
        </div>
      )}
    </>
  )
}

export default App
