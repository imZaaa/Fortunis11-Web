"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function MembersPage() {
  const [members, setMembers] = useState([])
  const [selectedMember, setSelectedMember] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('priority', { ascending: true })

      if (!error) setMembers(data)
      setLoading(false)
    }
    fetchMembers()
  }, [])

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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-blue-500 font-mono italic animate-pulse">Initialising Command Center...</div>

  return (
    <main className="min-h-screen p-6 md:p-12 lg:p-20 relative overflow-hidden">
      <div className="fixed top-20 right-0 p-4 opacity-[0.03] text-[20rem] font-black text-blue-500 -rotate-12 pointer-events-none select-none z-0">
        MI
      </div>

      <div className="max-w-7xl mx-auto mb-24 relative z-10">
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white">
          THE <span className="text-blue-600 drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]">SQUAD</span>
        </h1>
      </div>

      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-32 relative z-10">
        {members.map((member, index) => {
          const isLastTwo = index >= 9
          const isStaggered = !isLastTwo && index % 2 === 1

          return (
            <div 
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className={`group relative cursor-pointer transition-all duration-700 w-full sm:w-[calc(50%-2rem)] lg:w-[calc(33.33%-3rem)] ${
                isStaggered ? 'lg:mt-32' : '' 
              }`}
            >
              <div className="absolute -top-12 -left-4 text-6xl font-black text-white/[0.04] italic uppercase pointer-events-none group-hover:text-blue-500/10 transition-colors">
                {getNickName(member.name)}
              </div>

              <div className="relative rounded-[3rem] bg-blue-900/10 border border-blue-400/20 backdrop-blur-md overflow-hidden hover:border-blue-500/50 transition-all duration-500 shadow-2xl hover:-translate-y-4">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={member.image_url} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent p-8 flex flex-col justify-end">
                  <div className={`w-12 h-1.5 rounded-full mb-4 ${member.gender === 'L' ? 'bg-blue-500 shadow-blue-500/50' : 'bg-pink-500 shadow-pink-500/50'}`}></div>
                  <h3 className="text-2xl font-black tracking-tight text-white italic">{member.name}</h3>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* --- MODAL DETAIL YANG UDAH DILEBARIN BRAY! --- */}
      {selectedMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md" onClick={() => setSelectedMember(null)}></div>
          
          {/* UPDATE DI SINI: max-w-4xl biar lebih lebar */}
          <div className="relative bg-blue-950/40 border border-blue-500/30 p-8 md:p-12 rounded-[3rem] max-w-4xl w-full shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in duration-300">
            <button onClick={() => setSelectedMember(null)} className="absolute top-6 right-8 text-blue-400 hover:text-white font-black tracking-widest">CLOSE [X]</button>
            
            <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
              {/* UPDATE DI SINI: Ukuran foto digedein di layar besar (md:w-64 md:h-80) */}
              <div className="w-48 h-64 md:w-64 md:h-80 rounded-3xl overflow-hidden border-2 border-blue-500/20 flex-shrink-0 shadow-lg shadow-blue-500/20 relative group">
                <img src={selectedMember.image_url} alt={selectedMember.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              
              <div className="flex flex-col gap-6 text-center md:text-left flex-1 py-4">
                <div>
                  <h2 className="text-4xl md:text-5xl font-black italic text-white uppercase leading-none mb-2">{selectedMember.name}</h2>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <span className="px-4 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">
                        MI-23 Elite
                    </span>
                    
                    {/* Logika baru: Ngecek 'L' atau 'Laki-laki' bray */}
                    <span className={`px-4 py-1.5 border rounded-full text-[10px] font-bold uppercase tracking-[0.2em] ${
                        (selectedMember.gender === 'L' || selectedMember.gender === 'Laki-laki') 
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' 
                        : 'bg-pink-500/10 border-pink-500/30 text-pink-400'
                    }`}>
                        {(selectedMember.gender === 'L' || selectedMember.gender === 'Laki-laki') ? 'Boy' : 'Girl'}
                    </span>
                    </div>
                </div>              
                <div className="space-y-6 mt-2">
                  <div>
                    <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Class Quote</p>
                    <p className="text-blue-100 italic font-medium leading-relaxed text-lg">{selectedMember.quote || 'No words needed, just action in silence.'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-8 border-t border-blue-500/10 pt-6">
                    <div>
                      <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">IG Handle</p>
                      <Link href={`https://instagram.com/${selectedMember.instagram || 'fortunis11'}`} target="_blank" className="text-white font-mono text-sm tracking-wider hover:text-blue-400 transition-colors">
                        @{selectedMember.instagram || 'fortunis11'}
                      </Link>
                    </div>
                    <div>
                      <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Specialty</p>
                      <p className="text-white font-mono text-sm tracking-wider">{selectedMember.hobby || 'Fullstack Magic'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto mt-40 pb-20 text-center relative z-10">
        <Link href="/" className="text-zinc-600 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.3em]">← Back to Base</Link>
      </div>
    </main>
  )
}