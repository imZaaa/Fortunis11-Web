"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Navbar() {
  const pathname = usePathname()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Members', path: '/profile' },
    { name: 'Archive', path: '/archive' },
    { name: 'Admin', path: '/admin' },
  ]

  return (
    <div className="fixed top-4 md:top-6 left-0 w-full flex justify-center z-50 px-4">
      {/* Container Melayang - Lebarnya otomatis ngikutin konten (fit-content) */}
      <nav className="bg-black/40 backdrop-blur-xl border border-white/10 p-1.5 rounded-full flex items-center gap-0.5 shadow-2xl shadow-blue-500/5">
        
        {/* Branding - Muncul cuma di tablet keatas biar gak sempit di HP */}
        <div className="hidden sm:flex pr-4 pl-3 items-center">
           <span className="text-[10px] font-black italic text-white tracking-tighter uppercase">
             Fortunis<span className="text-blue-500 text-[10px] font-black italic">11</span>
           </span>
           <div className="w-[1px] h-3 bg-white/20 ml-4"></div>
        </div>
        
        {/* Loop Links */}
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
              {/* Efek Sliding Background pake Framer Motion bray! */}
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
      </nav>
    </div>
  )
}