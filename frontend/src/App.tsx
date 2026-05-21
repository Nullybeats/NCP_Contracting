import { useState } from 'react'
import { Landing } from '@/pages/Landing'
import { Loader } from '@/components/Loader'

function App() {
  const [loading, setLoading] = useState(true)

  return (
    <>
      {loading && <Loader onDone={() => setLoading(false)} />}
      <Landing />
    </>
  )
}

export default App
