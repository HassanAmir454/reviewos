'use client'

import { signIn } from 'next-auth/react'
import { Github } from 'lucide-react'
import { useState } from 'react'

export function SignInButton() {
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    setLoading(true)
    await signIn('github', { callbackUrl: '/dashboard/prs' })
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl
        bg-accent-green text-bg-primary font-mono font-bold text-sm
        hover:brightness-110 active:scale-[0.98]
        shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:shadow-[0_0_30px_rgba(0,255,136,0.5)]
        transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <Github className="w-5 h-5" />
      {loading ? 'Connecting…' : 'Continue with GitHub'}
    </button>
  )
}
