import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { SignInButton } from './SignInButton'
import { Cpu, GitPullRequest, Zap, Shield } from 'lucide-react'

export default async function LoginPage() {
  const session = await auth()
  if (session?.user) redirect('/dashboard/prs')

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Left — Branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-bg-secondary border-r border-border-subtle relative overflow-hidden">
        {/* Animated grid background */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(var(--border-default) 1px, transparent 1px),
              linear-gradient(90deg, var(--border-default) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Glow orb */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-accent-purple opacity-[0.06] blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-green/10 border border-accent-green/20 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-accent-green" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight">
                <span className="text-accent-green">Review</span>OS
              </h1>
              <p className="text-[10px] font-mono text-text-muted tracking-widest uppercase">
                AI Code Review Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Feature bullets */}
        <div className="relative z-10 space-y-6">
          {[
            {
              icon: <GitPullRequest className="w-4 h-4 text-accent-purple" />,
              label: 'Real-time PR monitoring',
              desc: 'Live updates via WebSocket as PRs open, update, and close.',
            },
            {
              icon: <Zap className="w-4 h-4 text-accent-green" />,
              label: 'Claude AI streaming review',
              desc: 'Instant code analysis with token-by-token streaming output.',
            },
            {
              icon: <Shield className="w-4 h-4 text-accent-amber" />,
              label: 'Risk & complexity scoring',
              desc: 'Cyclomatic complexity + AI-powered risk level per PR.',
            },
          ].map(f => (
            <div key={f.label} className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-bg-elevated border border-border-default flex items-center justify-center shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="font-mono text-sm font-medium text-text-primary">{f.label}</p>
                <p className="font-mono text-xs text-text-muted mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="relative z-10 font-mono text-[10px] text-text-ghost">
          ReviewOS · Portfolio Demo · {new Date().getFullYear()}
        </p>
      </div>

      {/* Right — Login panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <h1 className="font-display text-3xl font-extrabold">
              <span className="text-accent-green">Review</span>OS
            </h1>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-text-primary">
              Sign in to ReviewOS
            </h2>
            <p className="font-mono text-sm text-text-muted">
              Connect your GitHub account to start reviewing pull requests with AI.
            </p>
          </div>

          <SignInButton />

          <p className="text-[11px] font-mono text-text-ghost text-center">
            Requires repo read access. No code is stored.
          </p>
        </div>
      </div>
    </div>
  )
}
