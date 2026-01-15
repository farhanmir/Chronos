'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, Terminal } from 'lucide-react'

// Logo component with fixed dimensions to prevent layout shift
function Logo() {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
      <img 
        src="/logo.png" 
        alt="Chronos logo" 
        width={160}
        height={160}
        className="relative w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl"
        loading="eager"
      />
    </div>
  )
}

interface HeroClientProps {
  initialDownloadCount: number
}

export function HeroClient({ initialDownloadCount }: HeroClientProps) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'install' | 'run'>('install')

  const commands = {
    install: 'pip install -e .',
    run: 'chronos run "Build a website" --yolo'
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="relative flex flex-col items-center justify-center px-6 pt-24 pb-20 md:pt-32 md:pb-24 overflow-hidden min-h-[80vh]">
      {/* Dynamic Background */}
      <div className="absolute inset-0hero-gradient opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="max-w-[800px] w-full text-center relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-10 animate-fade-in-up">
          <Logo />
        </div>

        {/* App Name */}
        <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-white glow-text">
          Chronos
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-indigo-200/80 mb-6 leading-relaxed font-light">
          Autonomous <span className="text-white font-medium">Gemini Code</span> Runner
        </p>

        {/* Description */}
        <p className="text-base md:text-lg text-gray-400 mb-12 max-w-[600px] mx-auto leading-relaxed">
          Break free from rate limits. Chronos uses a high-throughput Token Bucket algorithm to manage Gemini's API autonomously. Sleep while it codes.
        </p>

        {/* Terminal Window */}
        <div className="max-w-[650px] mx-auto mb-10 text-left">
          <div className="bg-[#0A0A0C] border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
            
            {/* Terminal Header */}
            <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/5">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
              </div>
              <div className="ml-4 flex text-xs text-gray-500 space-x-4">
                <button 
                  onClick={() => setActiveTab('install')}
                  className={`${activeTab === 'install' ? 'text-indigo-400' : 'hover:text-gray-300'}`}
                >
                  install
                </button>
                <button 
                  onClick={() => setActiveTab('run')}
                  className={`${activeTab === 'run' ? 'text-indigo-400' : 'hover:text-gray-300'}`}
                >
                  run
                </button>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm relative group">
              <div className="flex items-center text-gray-300">
                <span className="text-indigo-500 mr-3">➜</span>
                <span className="flex-1">{commands[activeTab]}</span>
                <button
                  onClick={() => copyToClipboard(commands[activeTab])}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center justify-center gap-8 text-sm font-medium">
          <a 
            href="https://github.com/example/chronos" 
            target="_blank"
            className="flex items-center gap-2 text-white hover:text-indigo-400 transition-colors"
          >
            <span className="bg-white/10 p-2 rounded-full"><Terminal className="w-4 h-4" /></span>
             View Source
          </a>
        </div>

        {/* Stat */}
        <p className="text-xs text-gray-600 mt-12 font-mono">
          v0.1.0 • Gemini 1.5 Pro • Token Bucket Enabled
        </p>
      </div>
    </section>
  )
}

