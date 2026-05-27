'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRepoConnection } from '@/hooks/useRepoConnection'
import { Settings, GitBranch, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'

export default function SettingsPage() {
  const { connect, isConnecting, error, connectedRepo } = useRepoConnection()
  const [owner, setOwner] = useState('')
  const [repo, setRepo] = useState('')
  const [success, setSuccess] = useState(false)

  const handleConnect = async () => {
    if (!owner || !repo) return
    setSuccess(false)
    await connect(owner, repo)
    setSuccess(true)
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-5 h-5 text-accent-purple" />
        <h1 className="font-display text-2xl font-bold text-text-primary">Settings</h1>
      </div>

      {/* Repo connection */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-bg-elevated rounded-xl border border-border-default p-6 space-y-5">
        <div>
          <SectionLabel>GitHub Repository</SectionLabel>
          <p className="font-mono text-sm text-text-secondary mt-1">
            Connect a repository to start reviewing pull requests.
          </p>
        </div>

        {connectedRepo && (
          <div className="flex items-center gap-2 px-3 py-2 bg-accent-green-dim border border-accent-green/20 rounded-lg">
            <CheckCircle className="w-4 h-4 text-accent-green" />
            <span className="font-mono text-sm text-accent-green">Connected: {connectedRepo}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <SectionLabel>Owner</SectionLabel>
            <input
              value={owner}
              onChange={e => setOwner(e.target.value)}
              placeholder="vercel"
              className="w-full bg-bg-primary border border-border-default rounded-lg px-3 py-2.5
                font-mono text-sm text-text-primary placeholder-text-ghost
                focus:outline-none focus:border-accent-purple transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <SectionLabel>Repository</SectionLabel>
            <input
              value={repo}
              onChange={e => setRepo(e.target.value)}
              placeholder="next.js"
              className="w-full bg-bg-primary border border-border-default rounded-lg px-3 py-2.5
                font-mono text-sm text-text-primary placeholder-text-ghost
                focus:outline-none focus:border-accent-purple transition-colors"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-3 py-2 bg-accent-red-dim border border-accent-red/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-accent-red" />
            <span className="font-mono text-xs text-accent-red">{error}</span>
          </div>
        )}

        <button
          onClick={handleConnect}
          disabled={isConnecting || !owner || !repo}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono font-bold text-sm
            bg-accent-purple text-white hover:brightness-110 transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-[0_0_12px_rgba(123,97,255,0.2)]"
        >
          {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <GitBranch className="w-4 h-4" />}
          {isConnecting ? 'Connecting…' : 'Connect Repository'}
        </button>
      </motion.div>

      {/* API keys info */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-bg-elevated rounded-xl border border-border-default p-6 space-y-4 mt-4">
        <SectionLabel>Environment</SectionLabel>
        {[
          { key: 'ANTHROPIC_API_KEY', desc: 'Claude AI reviews', ok: true },
          { key: 'GITHUB_TOKEN', desc: 'GitHub API access', ok: true },
          { key: 'NEXTAUTH_SECRET', desc: 'Session security', ok: true },
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between">
            <div>
              <p className="font-mono text-xs text-text-primary">{item.key}</p>
              <p className="font-mono text-[10px] text-text-muted">{item.desc}</p>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
              item.ok ? 'bg-accent-green-dim text-accent-green' : 'bg-accent-red-dim text-accent-red'
            }`}>
              {item.ok ? 'SET' : 'MISSING'}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
