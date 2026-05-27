'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown, FileCode, FilePlus, FileMinus, FileX } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FileChange } from '@/types/pr'

interface FileTreeProps {
  files: FileChange[]
  selectedFile: string | null
  onSelectFile: (filename: string) => void
}

function getFileIcon(status: FileChange['status']) {
  if (status === 'added') return <FilePlus className="w-3.5 h-3.5 text-accent-green" />
  if (status === 'removed') return <FileX className="w-3.5 h-3.5 text-accent-red" />
  if (status === 'renamed') return <FileMinus className="w-3.5 h-3.5 text-accent-amber" />
  return <FileCode className="w-3.5 h-3.5 text-text-muted" />
}

function groupByDirectory(files: FileChange[]) {
  const groups: Record<string, FileChange[]> = {}
  for (const f of files) {
    const parts = f.filename.split('/')
    const dir = parts.length > 1 ? parts.slice(0, -1).join('/') : '.'
    if (!groups[dir]) groups[dir] = []
    groups[dir].push(f)
  }
  return groups
}

export function FileTree({ files, selectedFile, onSelectFile }: FileTreeProps) {
  const groups = groupByDirectory(files)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggleDir = (dir: string) =>
    setCollapsed(prev => ({ ...prev, [dir]: !prev[dir] }))

  return (
    <div className="h-full overflow-y-auto py-2 text-xs font-mono">
      {Object.entries(groups).map(([dir, dirFiles]) => (
        <div key={dir}>
          {dir !== '.' && (
            <button
              onClick={() => toggleDir(dir)}
              className="w-full flex items-center gap-1.5 px-3 py-1 text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors"
            >
              {collapsed[dir]
                ? <ChevronRight className="w-3 h-3 shrink-0" />
                : <ChevronDown className="w-3 h-3 shrink-0" />
              }
              <span className="truncate text-[10px] tracking-wide">{dir}/</span>
            </button>
          )}
          {!collapsed[dir] && dirFiles.map(f => {
            const basename = f.filename.split('/').pop() ?? f.filename
            const isSelected = selectedFile === f.filename
            return (
              <button
                key={f.filename}
                onClick={() => onSelectFile(f.filename)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-1.5 transition-colors text-left',
                  dir !== '.' && 'pl-7',
                  isSelected
                    ? 'bg-accent-purple-dim text-accent-purple border-r-2 border-accent-purple'
                    : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                )}
              >
                {getFileIcon(f.status)}
                <span className="truncate flex-1">{basename}</span>
                <div className="flex items-center gap-1 shrink-0">
                  {f.additions > 0 && (
                    <span className="text-accent-green">+{f.additions}</span>
                  )}
                  {f.deletions > 0 && (
                    <span className="text-accent-red">-{f.deletions}</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
