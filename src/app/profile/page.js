"use client"

import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function MembersPage() {
  const [members, setMembers] = useState([])
  const [filteredMembers, setFilteredMembers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMember, setSelectedMember] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('priority', { ascending: true })

      if (!error) {
        setMembers(data)
        setFilteredMembers(data)
      }
      setLoading(false)
    }
    fetchMembers()
  }, [])

  useEffect(() => {
    const results = members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredMembers(results)
  }, [searchTerm, members])

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
    <div className="min-h-screen bg-[#020617] p-12 flex flex-col items-center justify-center">
      <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p className="text-blue-500 font-mono italic animate-pulse tracking-widest text-sm">Sedang Sinkron Data...</p>
    </div>
  )

  return (
    <main className="min-h-screen p-6 md:p-12 lg:p-20 relative overflow-hidden">
      <div className="fixed top-20 right-0 p-4 opacity-[0.03] text-[20rem] font-black text-blue-500 -rotate-12 pointer-events-none select-none z-0">MI</div>

      <div className="max-w-7xl mx-auto mb-20 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h2 className="text-blue-500 text-xs font-bold uppercase tracking-[0.5em] mb-4 font-mono">Accessing Personnel</h2>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white">
              THE <span className="text-blue-600 drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]">SQUAD</span>
            </h1>
          </div>
          <div className="flex gap-6 bg-blue-900/10 border border-blue-500/20 backdrop-blur-md p-6 rounded-3xl">
            <div className="text-center"><p className="text-2xl font-black text-white">{members.length}</p><p className="text-[10px] text-blue-400 uppercase font-bold tracking-widest">Total</p></div>
            <div className="w-px h-10 bg-blue-500/20"></div>
            <div className="text-center"><p className="text-2xl font-black text-blue-500">9</p><p className="text-[10px] text-blue-400 uppercase font-bold tracking-widest">Boys</p></div>
            <div className="w-px h-10 bg-blue-500/20"></div>
            <div className="text-center"><p className="text-2xl font-black text-pink-500">2</p><p className="text-[10px] text-pink-400 uppercase font-bold tracking-widest">Girls</p></div>
          </div>
        </div>
        <div className="relative max-w-md group">
          <input type="text" placeholder="Search member name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-blue-950/20 border border-blue-500/30 rounded-2xl py-4 px-6 text-white font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-32 relative z-10 mb-40">
        {filteredMembers.map((member, index) => {
          const isLastTwo = index >= filteredMembers.length - (filteredMembers.length % 3 === 2 ? 2 : 0);
          const isStaggered = index % 2 === 1 && !isLastTwo;
          return (
            <div key={member.id} onClick={() => setSelectedMember(member)} className={`group relative cursor-pointer transition-all duration-700 w-full sm:w-[calc(50%-2rem)] lg:w-[calc(33.33%-3rem)] ${isStaggered ? 'lg:mt-32' : ''}`}>
              <div className="absolute -top-12 -left-4 text-6xl font-black text-white/[0.04] italic uppercase pointer-events-none group-hover:text-blue-500/10 transition-colors">{getNickName(member.name)}</div>
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

      {selectedMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md" onClick={() => setSelectedMember(null)}></div>
          <div className="relative bg-blue-950/40 border border-blue-500/30 p-8 md:p-12 rounded-[3rem] max-w-4xl w-full shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in duration-300">
            <button onClick={() => setSelectedMember(null)} className="absolute top-6 right-8 text-blue-400 hover:text-white font-black tracking-widest">CLOSE [X]</button>
            <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
              <div className="w-48 h-64 md:w-64 md:h-80 rounded-3xl overflow-hidden border-2 border-blue-500/20 flex-shrink-0 relative">
                <img src={selectedMember.image_url} alt={selectedMember.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-6 text-center md:text-left flex-1 py-4">
                <div>
                  <h2 className="text-4xl md:text-5xl font-black italic text-white uppercase leading-none mb-2">{selectedMember.name}</h2>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <span className="px-4 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">MI-23 Member</span>
                    <span className={`px-4 py-1.5 border rounded-full text-[10px] font-bold uppercase tracking-[0.2em] ${
                        (selectedMember.gender === 'L' || selectedMember.gender === 'Laki-laki') ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-pink-500/10 border-pink-500/30 text-pink-400'
                    }`}>
                        {(selectedMember.gender === 'L' || selectedMember.gender === 'Laki-laki') ? 'Boy' : 'Girl'}
                    </span>
                  </div>
                </div>              
                <div className="space-y-6 mt-2">
                  <div>
                    <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Class Quote</p>
                    <p className="text-blue-100 italic font-medium leading-relaxed text-lg">{selectedMember.quote}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-8 border-t border-blue-500/10 pt-6">
                    <div>
                      <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">IG Handle</p>
                      <Link href={`https://instagram.com/${selectedMember.acc_ig}`} target="_blank" className="text-white font-mono text-sm tracking-wider hover:text-blue-400 transition-colors">
                        {selectedMember.acc_ig}
                      </Link>
                    </div>
                    <div>
                      <p className="text-white font-mono text-sm tracking-wider">{selectedMember.hobby}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

     {structureData && (
  <div className="max-w-5xl mx-auto relative z-10 mb-32 px-4 md:px-0">
    {/* Judul Section yang Lebih Megah */}
    <div className="text-center mb-20">
      <h2 className="text-blue-500 text-xs font-bold uppercase tracking-[0.6em] mb-3 font-mono">Core Structure</h2>
      <h3 className="text-5xl md:text-7xl font-black italic text-white uppercase tracking-tighter drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
        Command <span className="text-blue-600">Hierarchy</span>
      </h3>
    </div>

    <div className="flex flex-col items-center gap-16 relative">
      {/* Garis Koneksi Pusat (Vertical Shimmer) */}
      <div className="absolute inset-0 flex justify-center pointer-events-none">
        <div className="w-[2px] h-full bg-gradient-to-b from-blue-600 via-blue-400/20 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
      </div>

      {/* LEVEL 1: UNIT COMMANDER (DAYAT) */}
      <div className="relative z-10 group">
        {/* Glow Effect Background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-60 transition duration-1000"></div>
        <div className="relative bg-[#020617]/90 border-2 border-blue-500/50 backdrop-blur-2xl p-8 rounded-[2.5rem] flex items-center gap-8 shadow-2xl transition-all duration-500 group-hover:scale-105">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl overflow-hidden border-4 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            <img src={structureData.ketua.img} alt={structureData.ketua.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          </div>
          <div className="pr-4">
            <p className="text-blue-400 font-mono text-[10px] font-black uppercase tracking-[0.3em] mb-2">{structureData.ketua.code} | {structureData.ketua.role}</p>
            <h4 className="text-3xl md:text-4xl font-black italic text-white uppercase tracking-tighter leading-none">{getNickName(structureData.ketua.name)}</h4>
            <div className="mt-3 flex gap-1">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-1 w-6 bg-blue-500/40 rounded-full animate-pulse"></div>)}
            </div>
          </div>
        </div>
      </div>

      {/* LEVEL 2: EXECUTIVE OFFICER (RHEZA) */}
      <div className="relative z-10 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-700 rounded-3xl blur opacity-20 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative bg-[#020617]/80 border-2 border-blue-400/30 backdrop-blur-xl p-6 rounded-3xl flex items-center gap-6 shadow-xl transition-all duration-500 group-hover:scale-105">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 border-blue-400/40">
            <img src={structureData.wakil.img} alt={structureData.wakil.name} className="w-full h-full object-cover" />
          </div>
          <div className="pr-4">
            <p className="text-blue-400 font-mono text-[10px] font-bold uppercase tracking-widest mb-1">{structureData.wakil.code} | {structureData.wakil.role}</p>
            <h4 className="text-2xl font-black italic text-white uppercase">{getNickName(structureData.wakil.name)}</h4>
          </div>
        </div>
      </div>

      {/* LEVEL 3: THE SUPPORT CORE (SALSABILA & FATIMAH - PINK THEME) */}
      <div className="flex flex-wrap justify-center gap-10 relative z-10 w-full mt-4">
        
        {/* Resource Manager (Salsabila) */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-pink-500/30 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative bg-pink-950/10 border border-pink-500/30 backdrop-blur-md p-5 rounded-[2rem] flex items-center gap-5 hover:border-pink-500/60 transition-all duration-300 min-w-[280px]">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
              <img src={structureData.bendahara.img} alt={structureData.bendahara.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-pink-400 font-mono text-[10px] font-black uppercase tracking-widest mb-1">{structureData.bendahara.code}</p>
              <h4 className="text-xl font-black italic text-white uppercase">{getNickName(structureData.bendahara.name)}</h4>
              <p className="text-pink-300/40 text-[9px] uppercase font-bold tracking-tighter">Financial Unit</p>
            </div>
          </div>
        </div>

        {/* Info Specialist (Fatimah - SEKARANG PINK BRAY!) */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-pink-500/30 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative bg-pink-950/10 border border-pink-500/30 backdrop-blur-md p-5 rounded-[2rem] flex items-center gap-5 hover:border-pink-500/60 transition-all duration-300 min-w-[280px]">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
              <img src={structureData.sekretaris.img} alt={structureData.sekretaris.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-pink-400 font-mono text-[10px] font-black uppercase tracking-widest mb-1">{structureData.sekretaris.code}</p>
              <h4 className="text-xl font-black italic text-white uppercase">{getNickName(structureData.sekretaris.name)}</h4>
              <p className="text-pink-300/40 text-[9px] uppercase font-bold tracking-tighter">Documentation Unit</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
)}
      <div className="max-w-7xl mx-auto mt-20 pb-20 text-center relative z-10">
        <Link href="/" className="text-zinc-600 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.3em]">← Back to Base</Link>
      </div>
    </main>
  )
}