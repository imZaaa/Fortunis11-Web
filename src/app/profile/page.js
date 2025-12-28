"use client"

import { useEffect, useState, useMemo, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function MembersPage() {
  const [members, setMembers] = useState([])
  const [filteredMembers, setFilteredMembers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMember, setSelectedMember] = useState(null)
  const [loading, setLoading] = useState(true)

  // 1. Definisikan fungsi pendukung di atas bray
  const getNickName = (fullName) => {
    if (!fullName) return ''
    const names = fullName.split(' ')
    const first = names[0].toLowerCase()
    if ((first === 'muhammad' || first === 'muhamad') && names.length > 1) {
      const second = names[1].toLowerCase()
      if (second === 'nur' && names.length > 2) return names[2]
      return names[1]
    }
    return names[0]
  }

  const fetchMembers = useCallback(async () => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('priority', { ascending: true })

    if (!error) {
      setMembers(data)
      setFilteredMembers(data)
    }
    setLoading(false)
  }, [])

  // 2. Lifecycle hooks
  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  useEffect(() => {
    const results = members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredMembers(results)
  }, [searchTerm, members])

  const structureData = useMemo(() => {
    if (members.length === 0) return null;
    const findImg = (namePart) => {
        const found = members.find(m => m.name.toLowerCase().includes(namePart.toLowerCase()));
        return found ? found.image_url : '';
    }
    return {
        ketua: { name: 'Muhammad Nur Hidayat', role: 'Unit Commander', code: 'KETUA', img: findImg('Hidayat') },
        wakil: { name: 'Rheza', role: 'Executive Officer', code: 'WAKIL', img: findImg('Rheza') },
        sekretaris: { name: 'Fatimah Azzahra', role: 'Info Specialist', code: 'SEKRETARIS', img: findImg('Fatimah') },
        bendahara: { name: 'Salsabila', role: 'Resource Manager', code: 'BENDAHARA', img: findImg('Salsabila') },
    };
  }, [members]);

  if (loading) return (
    <div className="min-h-screen bg-[#020617] p-12 flex flex-col items-center justify-center font-mono">
      <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p className="text-blue-500 animate-pulse tracking-widest text-sm uppercase font-black italic">Sedang Sinkron Data...</p>
    </div>
  )

  return (
    <main className="min-h-screen p-4 md:p-12 lg:p-20 relative overflow-x-hidden">
      {/* Background MI Text */}
      <div className="fixed top-20 right-0 p-4 opacity-[0.03] text-[15rem] md:text-[20rem] font-black text-blue-500 -rotate-12 pointer-events-none select-none z-0">MI</div>

      <div className="max-w-7xl mx-auto mb-20 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <h2 className="text-blue-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] mb-4 font-mono">Accessing Personnel</h2>
            <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-white uppercase">
              THE <span className="text-blue-600 drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]">SQUAD</span>
            </h1>
          </div>
          <div className="flex gap-4 md:gap-6 bg-blue-900/10 border border-blue-500/20 backdrop-blur-md p-5 md:p-6 rounded-3xl w-fit">
            <div className="text-center px-2"><p className="text-xl md:text-2xl font-black text-white">{members.length}</p><p className="text-[9px] text-blue-400 uppercase font-bold tracking-widest">Total</p></div>
            <div className="w-px h-10 bg-blue-500/20"></div>
            <div className="text-center px-2"><p className="text-xl md:text-2xl font-black text-blue-500">9</p><p className="text-[9px] text-blue-400 uppercase font-bold tracking-widest">Boys</p></div>
            <div className="w-px h-10 bg-blue-500/20"></div>
            <div className="text-center px-2"><p className="text-xl md:text-2xl font-black text-pink-500">2</p><p className="text-[9px] text-pink-400 uppercase font-bold tracking-widest">Girls</p></div>
          </div>
        </div>
        <div className="relative max-w-md">
          <input 
            type="text" 
            placeholder="Search member name..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full bg-blue-950/20 border border-blue-500/30 rounded-2xl py-4 px-6 text-white font-mono text-sm focus:outline-none focus:border-blue-500 transition-all" 
          />
        </div>
      </div>

      {/* Squad Grid */}
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-20 md:gap-y-32 relative z-10 mb-40">
        {filteredMembers.map((member, index) => {
          const isStaggered = index % 2 === 1;
          return (
            <div key={member.id} onClick={() => setSelectedMember(member)} className={`group relative cursor-pointer transition-all duration-700 w-full sm:w-[calc(50%-2rem)] lg:w-[calc(33.33%-3rem)] ${isStaggered ? 'lg:mt-32' : ''}`}>
              <div className="absolute -top-10 -left-2 text-5xl md:text-6xl font-black text-white/[0.04] italic uppercase pointer-events-none group-hover:text-blue-500/10 transition-colors font-mono">{getNickName(member.name)}</div>
              <div className="relative rounded-[3rem] bg-blue-900/10 border border-blue-400/20 backdrop-blur-md overflow-hidden hover:border-blue-500/50 transition-all duration-500 shadow-2xl hover:-translate-y-4">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={member.image_url} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent p-6 md:p-8 flex flex-col justify-end">
                  <div className={`w-12 h-1.5 rounded-full mb-4 ${member.gender === 'L' || member.gender === 'Laki-laki' ? 'bg-blue-500 shadow-blue-500/50' : 'bg-pink-500 shadow-pink-500/50'}`}></div>
                  <h3 className="text-xl md:text-2xl font-black tracking-tight text-white italic uppercase">{member.name}</h3>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* --- MODAL DETAIL (FIX BUTTON CLOSE!) --- */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
              onClick={() => setSelectedMember(null)}
            ></motion.div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-blue-950/40 border border-blue-500/30 p-6 md:p-12 rounded-[3rem] max-w-4xl w-full shadow-2xl backdrop-blur-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* BUTTON CLOSE KASTA TINGGI BRAY! */}
              <button 
                onClick={() => setSelectedMember(null)} 
                className="absolute top-4 right-4 md:top-8 md:right-10 z-[110] bg-blue-600/20 hover:bg-blue-600 backdrop-blur-md px-5 py-2 rounded-2xl text-white text-[10px] font-black tracking-[0.2em] transition-all uppercase border border-white/10"
              >
                CLOSE [X]
              </button>

              <div className="overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
                  <div className="w-full max-w-[280px] md:w-64 aspect-[3/4] rounded-[2rem] overflow-hidden border-2 border-blue-500/20 flex-shrink-0 shadow-2xl">
                    <img src={selectedMember.image_url} alt={selectedMember.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex flex-col gap-6 text-center md:text-left flex-1 py-2">
                    <div>
                      <h2 className="text-3xl md:text-5xl font-black italic text-white uppercase leading-tight mb-3">{selectedMember.name}</h2>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <span className="px-4 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-[9px] font-bold text-blue-400 uppercase tracking-widest">MI-23 Member</span>
                        <span className={`px-4 py-1.5 border rounded-full text-[9px] font-bold uppercase tracking-widest ${
                            (selectedMember.gender === 'L' || selectedMember.gender === 'Laki-laki') ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-pink-500/10 border-pink-500/30 text-pink-400'
                        }`}>
                            {(selectedMember.gender === 'L' || selectedMember.gender === 'Laki-laki') ? 'Boy' : 'Girl'}
                        </span>
                      </div>
                    </div>              
                    
                    <div className="space-y-6">
                      <div className="bg-white/5 p-5 rounded-2xl border-l-4 border-blue-600">
                        <p className="text-blue-500 text-[9px] font-black uppercase tracking-widest mb-1 font-mono">Mission Quote</p>
                        <p className="text-blue-50 font-medium italic text-lg leading-relaxed">"{selectedMember.quote || 'No specific signal received.'}"</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-blue-500/10 pt-6">
                        <div>
                          <p className="text-blue-500 text-[9px] font-black uppercase tracking-widest mb-1 font-mono">IG Handle</p>
                          <Link href={`https://instagram.com/${selectedMember.acc_ig}`} target="_blank" className="text-white font-mono text-sm tracking-wider hover:text-blue-400 transition-colors">
                            {selectedMember.acc_ig || 'not_found'}
                          </Link>
                        </div>
                        <div>
                          <p className="text-blue-500 text-[9px] font-black uppercase tracking-widest mb-1 font-mono">Special Skill</p>
                          <p className="text-white font-mono text-sm uppercase tracking-wider">{selectedMember.hobby || 'Undercovered'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- COMMAND HIERARCHY (RESPONSIVE FIX) --- */}
      {structureData && (
        <div className="max-w-5xl mx-auto relative z-10 mb-32 px-4 md:px-0 mt-40">
          <div className="text-center mb-20">
            <h2 className="text-blue-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.6em] mb-3 font-mono">Core Structure</h2>
            <h3 className="text-4xl md:text-7xl font-black italic text-white uppercase tracking-tighter drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              Command <span className="text-blue-600">Hierarchy</span>
            </h3>
          </div>

          <div className="flex flex-col items-center gap-16 relative">
            <div className="absolute inset-0 flex justify-center pointer-events-none">
              <div className="w-[2px] h-full bg-gradient-to-b from-blue-600 via-blue-400/20 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
            </div>

            {/* Ketua: Hidayat */}
            <div className="relative z-10 group w-full max-w-xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative bg-[#020617]/90 border-2 border-blue-500/50 backdrop-blur-2xl p-6 md:p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6 md:gap-8 transition-all duration-500 group-hover:scale-105">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border-4 border-blue-500/30 flex-shrink-0">
                  <img src={structureData.ketua.img} alt={structureData.ketua.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center md:text-left pr-4">
                  <p className="text-blue-400 font-mono text-[9px] font-black uppercase tracking-widest mb-1">{structureData.ketua.code} | {structureData.ketua.role}</p>
                  <h4 className="text-2xl md:text-4xl font-black italic text-white uppercase tracking-tighter leading-none">{getNickName(structureData.ketua.name)}</h4>
                </div>
              </div>
            </div>

            {/* Wakil: Rheza bray! */}
            <div className="relative z-10 group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-700 rounded-3xl blur opacity-20 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-[#020617]/80 border-2 border-blue-400/30 backdrop-blur-xl p-5 md:p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 transition-all duration-500 group-hover:scale-105">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-blue-400/40 flex-shrink-0">
                  <img src={structureData.wakil.img} alt={structureData.wakil.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center md:text-left pr-4">
                  <p className="text-blue-400 font-mono text-[9px] font-bold uppercase tracking-widest mb-1">{structureData.wakil.code} | {structureData.wakil.role}</p>
                  <h4 className="text-xl md:text-2xl font-black italic text-white uppercase">{getNickName(structureData.wakil.name)}</h4>
                </div>
              </div>
            </div>

            {/* Support Unit: Salsabila & Fatimah */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-10 relative z-10 w-full mt-4 px-4">
              {[structureData.bendahara, structureData.sekretaris].map((agent) => (
                <div key={agent.code} className="group relative w-full sm:w-[320px]">
                  <div className="absolute -inset-0.5 bg-pink-500/30 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative bg-pink-950/10 border border-pink-500/30 backdrop-blur-md p-5 rounded-[2rem] flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-pink-500/40 flex-shrink-0">
                      <img src={agent.img} alt={agent.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-pink-400 font-mono text-[8px] font-black uppercase tracking-widest mb-1">{agent.code}</p>
                      <h4 className="text-lg font-black italic text-white uppercase">{getNickName(agent.name)}</h4>
                      <p className="text-pink-300/40 text-[7px] uppercase font-bold tracking-tighter">Support Wing</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto mt-20 pb-20 text-center relative z-10">
        <Link href="/" className="text-zinc-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest font-mono">← Return to Command Base</Link>
      </div>
    </main>
  )
}