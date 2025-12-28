"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [showGate, setShowGate] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState(false)

  // --- KODE RAHASIA ADMIN DI SINI BRAY ---
  const SECRET_CODE = "123654" // Ganti sesuai selera lu bray

  // Tambahin SITREP ke daftar link utama bray
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Members', path: '/profile' },
    { name: 'Archive', path: '/archive' },
    { name: 'Board', path: '/sitrep' }, // Papan tulis rahasia MI-23!
  ]

  const validateCode = () => {
    if (accessCode === SECRET_CODE) {
      setError(false)
      setShowGate(false)
      setAccessCode('')
      router.push('/admin') // Gas ke dashboard admin
    } else {
      setError(true)
      setTimeout(() => setError(false), 500) // Reset merah-merahnya bray
    }
  }

  return (
    <>
      <div className="fixed top-4 md:top-6 left-0 w-full flex justify-center z-50 px-4">
        <nav className="bg-black/40 backdrop-blur-xl border border-white/10 p-1.5 rounded-full flex items-center gap-0.5 shadow-2xl shadow-blue-500/5">
          
          <div className="hidden sm:flex pr-4 pl-3 items-center border-r border-white/10 mr-1">
              <span className="text-[10px] font-black italic text-white tracking-tighter uppercase">
                Fortunis<span className="text-blue-500 text-[10px] font-black italic">11</span>
              </span>
          </div>
          
          {/* Menu Biasa */}
          {navLinks.map((link) => {
            const active = pathname === link.path
            return (
              <Link 
                key={link.path}
                href={link.path}
                className={`relative px-3 sm:px-6 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${
                  active ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'
                }`}
              >
                {active && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-600 rounded-full -z-10 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            )
          })}

          {/* Tombol Admin Khusus Gatekeeper */}
          <button 
            onClick={() => setShowGate(true)}
            className={`relative px-3 sm:px-6 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${
              pathname.startsWith('/admin') ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'
            }`}
          >
            {pathname.startsWith('/admin') && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-blue-600 rounded-full -z-10 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">Admin</span>
          </button>
        </nav>
      </div>

      {/* --- MODAL PASSCODE (THE GATEKEEPER) --- */}
      {showGate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowGate(false)}></div>
          
          <div className={`relative bg-zinc-900 border-2 ${error ? 'border-red-500' : 'border-blue-500/30'} p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-300`}>
            <div className="text-center mb-6">
              <h2 className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2 font-mono">Restricted Area</h2>
              <p className="text-white text-xl font-black italic uppercase tracking-tighter">Enter Auth Code</p>
            </div>

            <input 
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && validateCode()}
              autoFocus
              className={`w-full bg-black/50 border-b-2 ${error ? 'border-red-500' : 'border-blue-500/50'} py-3 px-4 text-center text-2xl font-black tracking-[0.5em] text-blue-400 focus:outline-none transition-all placeholder:text-blue-500/10`}
              placeholder="••••••"
            />

            <div className="mt-8 flex gap-4">
               <button onClick={() => setShowGate(false)} className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Abort</button>
               <button 
                 onClick={validateCode}
                 className="flex-1 py-3 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-blue-600/20 hover:scale-105 transition-transform"
               >
                 Authorize
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}