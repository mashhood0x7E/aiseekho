/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import CyberBackground from './components/CyberBackground';
import { Cpu, Terminal, ShieldAlert } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen text-white font-sans selection:bg-cyan-500 selection:text-black">
      <CyberBackground />
      
      {/* Header / HUD */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Cpu className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tighter uppercase italic bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
              Neo_Terminal_V4
            </h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-500/80 uppercase tracking-widest">System Online</span>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-[10px] font-mono text-white/40 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Terminal className="w-3 h-3" />
            <span>Connection: Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-3 h-3" />
            <span>Uptime: 99.99%</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center gap-12 max-w-6xl">
        <div className="w-full flex flex-col xl:flex-row items-center xl:items-start justify-center gap-8 md:gap-16">
          
          {/* Left Panel: Music & Visuals */}
          <motion.section 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-full max-w-[400px] space-y-6"
          >
            <div className="space-y-2 mb-8">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                Audio <span className="text-purple-500">Node</span>
              </h2>
              <p className="text-white/40 text-xs font-mono">Neural auditory streaming interface powered by CyberAI</p>
            </div>
            
            <MusicPlayer />
            
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-white/30 uppercase">Signal Strength</span>
                <span className="text-[10px] font-mono text-cyan-400">Stable</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-1/2 h-full bg-cyan-500/50 blur-[2px]"
                />
              </div>
            </div>
          </motion.section>

          {/* Center: Snake Game */}
          <motion.section
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-[450px]"
          >
            <div className="relative mb-6">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-20" />
              <SnakeGame />
            </div>
            
            <div className="flex items-center gap-4 px-4 py-3 bg-white/5 border border-white/5 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              <p className="text-[10px] font-mono text-white/50 uppercase tracking-tight">
                High-performance neural rendering active. Maintain focus. Refine reflexes.
              </p>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto px-6 py-8 border-t border-white/5 text-center">
        <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">
          &copy; 2026 Neo_Terminal // All Rights Reserved // Distributed Under Apache-2.0
        </p>
      </footer>
    </div>
  );
}
