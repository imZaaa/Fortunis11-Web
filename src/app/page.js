import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 relative">
      
      {/* Container Utama Bento Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[200px]">
        
        {/* 1. HERO BOX - Foto Bareng Fortunis11 */}
        <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[2.5rem] bg-blue-950/30 border border-blue-500/20 backdrop-blur-md shadow-2xl shadow-blue-900/20">
          <img 
            src="/assets/foto-bareng.jpeg" 
            alt="Fortunis 11"
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent p-8 flex flex-col justify-end">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic">
              FORTUNIS<span className="text-blue-500">11</span>
            </h1>
            <p className="text-blue-300 mt-2 font-medium tracking-wide drop-shadow-md">
              Management Informatics 23 • Solidarity is Priority
            </p>
          </div>
        </div>

        {/* 2. STATS BOX - 9 Cowok 2 Cewek */}
        <div className="md:col-span-2 bg-blue-900/10 border border-blue-400/20 backdrop-blur-md rounded-[2.5rem] p-8 flex flex-col justify-center relative group hover:border-blue-500/50 transition-all duration-500">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 blur-2xl group-hover:bg-blue-500/20 transition-all"></div>

          {/* --- BACKGROUND ORNAMEN "MI" --- */}
          <div className="absolute -top-6 -right-1 p-4 opacity-[0.05] text-[8rem] font-black text-blue-500 -rotate-12 pointer-events-none select-none">
            MI
          </div>
          
          <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.4em] mb-4 font-mono">Class Formation</p>
          <div className="flex items-center gap-12 relative z-10">
            <div className="hover:scale-110 transition-transform duration-300">
              <p className="text-6xl font-black text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">9</p>
              <p className="text-xs text-blue-200/60 font-bold uppercase tracking-widest mt-1">Boys</p>
            </div>
            <div className="w-[1px] h-16 bg-blue-500/30"></div>
            <div className="hover:scale-110 transition-transform duration-300">
              <p className="text-6xl font-black text-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]">2</p>
              <p className="text-xs text-blue-200/60 font-bold uppercase tracking-widest mt-1">Girls</p>
            </div>
            <div className="hidden lg:block ml-auto opacity-10 group-hover:opacity-30 transition-opacity">
               <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
               </svg>
            </div>
          </div>
        </div>

        {/* 3. SOCIAL BOX - Instagram */}
        <Link 
          href="https://www.instagram.com/fortunis11/" 
          target="_blank"
          className="bg-gradient-to-br from-purple-600 to-pink-600 hover:scale-[0.98] transition-transform rounded-[2.5rem] p-8 flex flex-col justify-between shadow-lg shadow-pink-500/10"
        >
          <div className="text-3xl">📸</div>
          <div>
            <p className="text-white/70 text-sm font-bold uppercase tracking-tighter">Follow Us</p>
            <p className="text-2xl font-black uppercase italic tracking-tighter">Instagram</p>
          </div>
        </Link>

        {/* 4. ARCHIVE BOX - Menuju Gudang Kenangan */}
        <Link 
          href="/archive"
          className="bg-white hover:bg-zinc-200 transition-all rounded-[2.5rem] p-8 flex flex-col justify-between group shadow-xl"
        >
          <div className="flex justify-between items-start text-black">
            <span className="text-3xl">📂</span>
            <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
          </div>
          <div className="text-black">
            <p className="text-zinc-500 text-sm font-bold uppercase">The Vault</p>
            <p className="text-2xl font-black italic uppercase tracking-tighter">Archive</p>
          </div>
        </Link>

        {/* 5. QUOTE BOX */}
        <div className="md:col-span-2 bg-blue-950/40 border border-blue-400/20 rounded-[2.5rem] p-8 flex flex-col justify-center relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-[0.05] text-8xl font-black text-blue-500 rotate-12">MI</div>
           <p className="text-xl md:text-2xl font-semibold leading-tight italic z-10 text-blue-50">
             In <span className="text-blue-400">Fortunis 11</span>, we dont just study management informatics, we live it with passion and solidarity.
           </p>
        </div>

        {/* 6. MEMBERS BOX */}
        <Link 
          href="/profile"
          className="md:col-span-2 bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 transition-all rounded-[2.5rem] p-8 flex items-center justify-between group border border-white/10 shadow-lg shadow-blue-900/40"
        >
          <div>
            <p className="text-blue-200 text-sm font-bold uppercase tracking-widest">Wanna see us?</p>
            <p className="text-3xl font-black italic uppercase text-white tracking-tighter">Meet The Squad</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500 border border-white/20 shadow-lg">
             <span className="text-2xl">⚡</span>
          </div>
        </Link>
      </div>

      {/* --- SECTION INFINITE TICKER (SCROLL NYAMPING) --- */}
      <div className="mt-24 overflow-hidden py-12 border-y border-blue-500/10 bg-blue-950/20 backdrop-blur-sm -mx-4 md:-mx-8 lg:-mx-12">
        {/* Kontainer Flex dengan animasi scroll */}
        <div className="flex whitespace-nowrap animate-infinite-scroll gap-12 items-center">
          {/* Duplikasi konten biar loop-nya nggak keputus bray */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-12 items-center">
              <span className="text-4xl md:text-6xl font-black italic text-blue-500/20 uppercase tracking-tighter hover:text-blue-500/40 transition-colors">Solidarity</span>
              <span className="text-blue-500/40 text-2xl">⚡</span>
              <span className="text-4xl md:text-6xl font-black italic text-blue-500/20 uppercase tracking-tighter hover:text-blue-500/40 transition-colors">Management Informatics</span>
              <span className="text-blue-500/40 text-2xl">⚡</span>
              <span className="text-4xl md:text-6xl font-black italic text-blue-500/20 uppercase tracking-tighter hover:text-blue-500/40 transition-colors">Tech Savvy</span>
              <span className="text-blue-500/40 text-2xl">⚡</span>
              <span className="text-4xl md:text-6xl font-black italic text-blue-500/20 uppercase tracking-tighter hover:text-blue-500/40 transition-colors">Fortunis11</span>
              <span className="text-blue-500/40 text-2xl">⚡</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Activity / Pulse Section */}
      <div className="max-w-7xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 px-4 md:px-0">
        <div className="flex flex-col gap-3 group">
          <h3 className="text-blue-500 font-bold tracking-[0.3em] uppercase text-[10px]">Current Project</h3>
          <p className="text-white text-xl font-black italic">Building Digital Legacy</p>
          <div className="w-full h-1.5 bg-blue-900/30 rounded-full mt-2 overflow-hidden border border-white/5">
            <div className="w-[75%] h-full bg-blue-600 shadow-[0_0_10px_#2563eb]"></div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-pink-500 font-bold tracking-[0.3em] uppercase text-[10px]">Class Status</h3>
          <p className="text-white text-xl font-black italic uppercase">Locked and Loaded</p>
          <p className="text-blue-200/40 text-sm font-medium">Preparing for the next big mission.</p>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-blue-400 font-bold tracking-[0.3em] uppercase text-[10px]">Uptime</h3>
          <p className="text-white text-xl font-black italic uppercase">24/7 Brotherhood</p>
          <p className="text-blue-200/40 text-sm font-medium">Synced since Day 01 at Campus.</p>
        </div>
      </div>

    </main>
  )
}