import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 relative overflow-hidden">
      
      {/* --- BENTO GRID SECTION (Tetap Solid Bray!) --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[200px]">
        
        {/* 1. HERO BOX */}
        <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[2.5rem] bg-blue-950/30 border border-blue-500/20 backdrop-blur-md shadow-2xl">
          <img 
            src="/assets/foto-bareng.jpeg" 
            alt="Fortunis 11"
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent p-8 flex flex-col justify-end">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic text-white">
              FORTUNIS<span className="text-blue-500">11</span>
            </h1>
            <p className="text-blue-300 mt-2 font-medium tracking-wide drop-shadow-md">
              Management Informatics 23 • Solidarity is Priority
            </p>
          </div>
        </div>

        {/* 2. STATS BOX */}
        <div className="md:col-span-2 bg-blue-900/10 border border-blue-400/20 backdrop-blur-md rounded-[2.5rem] p-8 flex flex-col justify-center relative group">
          <div className="absolute -top-6 -right-1 p-4 opacity-[0.05] text-[8rem] font-black text-blue-500 -rotate-12 pointer-events-none select-none">MI</div>
          <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.4em] mb-4 font-mono">Class Formation</p>
          <div className="flex items-center gap-12 relative z-10">
            <div>
              <p className="text-6xl font-black text-blue-500">9</p>
              <p className="text-xs text-blue-200/60 font-bold uppercase mt-1">Boys</p>
            </div>
            <div className="w-[1px] h-16 bg-blue-500/30"></div>
            <div>
              <p className="text-6xl font-black text-pink-500">2</p>
              <p className="text-xs text-blue-200/60 font-bold uppercase mt-1">Girls</p>
            </div>
          </div>
        </div>

        {/* 3. SOCIAL BOX */}
        <Link href="https://www.instagram.com/fortunis11/" target="_blank" className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-[2.5rem] p-8 flex flex-col justify-between">
          <div className="text-3xl">📸</div>
          <p className="text-2xl font-black uppercase italic text-white">Instagram</p>
        </Link>

        {/* 4. ARCHIVE BOX */}
        <Link href="/archive" className="bg-white rounded-[2.5rem] p-8 flex flex-col justify-between group">
          <div className="flex justify-between items-start text-black">
            <span className="text-3xl">📂</span>
            <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
          </div>
          <p className="text-2xl font-black italic uppercase text-black">Archive</p>
        </Link>

        {/* 5. QUOTE BOX */}
        <div className="md:col-span-2 bg-blue-950/40 border border-blue-400/20 rounded-[2.5rem] p-8 flex flex-col justify-center">
           <p className="text-xl md:text-2xl font-semibold leading-tight italic text-blue-50">
             In <span className="text-blue-400">Fortunis 11</span>, we don't just study informatics, we live it.
           </p>
        </div>

        {/* 6. MEMBERS BOX */}
        <Link href="/profile" className="md:col-span-2 bg-gradient-to-r from-blue-700 to-blue-900 rounded-[2.5rem] p-8 flex items-center justify-between group border border-white/10 shadow-lg">
          <p className="text-3xl font-black italic uppercase text-white tracking-tighter">Meet The Squad</p>
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500 shadow-lg">
             <span className="text-2xl">⚡</span>
          </div>
        </Link>
      </div>

      {/* --- SECTION INFINITE TICKER (SCROLL NYAMPING) --- */}
      <div className="mt-24 overflow-hidden py-12 border-y border-blue-500/10 bg-blue-950/20 backdrop-blur-sm -mx-4 md:-mx-8 lg:-mx-12">
        <div className="flex whitespace-nowrap animate-infinite-scroll gap-12 items-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-12 items-center">
              <span className="text-4xl md:text-6xl font-black italic text-blue-500/20 uppercase tracking-tighter hover:text-blue-500/40 transition-colors">Solidarity • Management Informatics • Tech Savvy • Fortunis11 •</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- NEW SECTION: SYSTEM SPECIFICATIONS (PENGGANTI ACTIVITY) --- */}
      <div className="max-w-7xl mx-auto mt-24 mb-32 px-4 md:px-0">
        <h2 className="text-blue-500 text-[10px] font-black uppercase tracking-[0.5em] mb-12 text-center">Fortunis11 System Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          
          {/* 1. Logic & Dev Power */}
          <div className="flex flex-col gap-5 group">
            <div className="flex justify-between items-end">
              <span className="text-white font-black italic text-2xl uppercase tracking-tighter">Computing Power</span>
              <span className="text-blue-500 font-mono text-xs font-bold">85%</span>
            </div>
            <div className="h-2 w-full bg-blue-900/20 rounded-full overflow-hidden border border-white/5 relative">
              <div className="h-full bg-blue-500 w-[85%] shadow-[0_0_15px_rgba(59,130,246,0.6)] group-hover:w-full transition-all duration-1000 ease-out"></div>
            </div>
            <p className="text-blue-200/30 text-[11px] leading-relaxed uppercase font-bold tracking-widest">
              Processing logical thinking, building digital legacy, and mastering informatics management.
            </p>
          </div>

          {/* 2. Visual & Vibe Sync */}
          <div className="flex flex-col gap-5 group">
            <div className="flex justify-between items-end">
              <span className="text-white font-black italic text-2xl uppercase tracking-tighter">System Aesthetic</span>
              <span className="text-pink-500 font-mono text-xs font-bold">75%</span>
            </div>
            <div className="h-2 w-full bg-pink-900/20 rounded-full overflow-hidden border border-white/5 relative">
              <div className="h-full bg-pink-500 w-[75%] shadow-[0_0_15px_rgba(236,72,153,0.6)] group-hover:w-full transition-all duration-1000 ease-out"></div>
            </div>
            <p className="text-blue-200/30 text-[11px] leading-relaxed uppercase font-bold tracking-widest">
              Designing user experiences and maintaining the vibe of the class to stay stunning on every device.
            </p>
          </div>

          {/* 3. Pure Brotherhood Uptime */}
          <div className="flex flex-col gap-5 group">
            <div className="flex justify-between items-end">
              <span className="text-white font-black italic text-2xl uppercase tracking-tighter">Solidarity Link</span>
              <span className="text-green-500 font-mono text-xs font-bold animate-pulse">OVERLOAD</span>
            </div>
            <div className="h-2 w-full bg-green-900/20 rounded-full overflow-hidden border border-white/5 relative">
              <div className="h-full bg-green-500 w-full shadow-[0_0_15px_rgba(34,197,94,0.6)] transition-all duration-700 ease-out"></div>
            </div>
            <p className="text-blue-200/30 text-[11px] leading-relaxed uppercase font-bold tracking-widest">
              Unbreakable connection. Synced 24/7 through campus challenges and digital life.
            </p>
          </div>

        </div>
      </div>

    </main>
  )
}