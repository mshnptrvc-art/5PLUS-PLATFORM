import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      setMessage('Greška pri slanju linka.')
    } else {
      setMessage('Magic link poslat! Proveri email.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Dobrodošao na 5plus</h1>
      <input
        type="email"
        placeholder="Unesi email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded mb-2 w-64"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Pošalji magic link
      </button>
      {message && <p className="mt-4 text-green-700">{message}</p>}
    </div>
  )
}
