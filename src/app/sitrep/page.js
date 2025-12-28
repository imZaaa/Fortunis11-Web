"use client"
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

export default function SitrepPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)

  // 1. Fungsi Cek Izin Akses (Pake token di browser bray)
  const checkPermission = useCallback(async () => {
    try {
      let token = localStorage.getItem('vault_token')
      if (!token) {
        token = `agent-${Math.random().toString(36).substring(2, 15)}`
        localStorage.setItem('vault_token', token)
      }

      const { data } = await supabase
        .from('access_permissions')
        .select('is_granted')
        .eq('agent_token', token)
        .single()
        
      if (data?.is_granted) setHasAccess(true)
    } finally {
      setLoading(false)
    }
  }, [])

  // 2. Tarik Pesan Board (Initial Load)
  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from('anonymous_messages')
      .select('*')
      .order('created_at', { ascending: false })
      
    setMessages(data || [])
  }, [])

  // 3. REAL-TIME ENGINE: Kunci biar pesan muncul tanpa refresh!
  useEffect(() => {
    checkPermission()
    fetchMessages()
    
    // Subscribe ke tabel database secara real-time
    const channel = supabase.channel('sitrep_realtime')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'anonymous_messages' }, 
        (payload) => {
          // Begitu ada pesan baru di DB, langsung inject ke layar bray
          setMessages((prev) => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [checkPermission, fetchMessages])

  const sendMessage = async () => {
    if (!input) return
    const { error } = await supabase.from('anonymous_messages').insert([{ content: input }])
    if (!error) setInput('') // Input dikosongin, tampilan bakal di-update otomatis lewat real-time
  }

  return (
    <main className="min-h-screen p-4 md:p-8 text-white font-mono flex flex-col items-center">

        <div className="fixed top-20 right-0 p-4 opacity-[0.03] text-[10rem] md:text-[20rem] font-black text-blue-500 -rotate-12 pointer-events-none select-none z-0">
            BOARD
        </div>
      
      {/* Header SITREP */}
      <div className="text-center mb-10">
        <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-white">
          <span className="text-blue-600">MI</span> BOARD
        </h1>

      </div>

      {/* --- BOARD ULTRA LEBAR --- */}
      <div className="relative w-full max-w-[98%] bg-zinc-950/40 border-2 border-zinc-800/40 rounded-[3rem] p-6 md:p-10 shadow-2xl min-h-[70vh] backdrop-blur-md overflow-hidden mb-40">
        {/* Ornamen Papan Tulis */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <AnimatePresence mode='popLayout'>
                {messages.map((msg) => (
                <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className="p-6 bg-blue-950/20 border border-blue-500/10 rounded-[2rem] shadow-xl hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between group"
                >
                    <p className="text-sm md:text-base text-blue-100/90 leading-relaxed font-medium break-words">
                    {msg.content}
                    </p>
                    
                    {/* --- BAGIAN GARIS DAN WAKTU --- */}
                    <div className="mt-6">
                    <div className="w-6 h-[2px] bg-blue-600/50 group-hover:w-full transition-all duration-700"></div>
                    
                    {/* TANGGAL DAN JAM DI BAWAH GARIS BRAY */}
                    <p className="text-[10px] font-mono text-zinc-500 mt-2 uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                        {new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}, {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    </div>
                </motion.div>
                ))}
            </AnimatePresence>
            </div>

        {messages.length === 0 && !loading && (
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <p className="text-zinc-600 font-black italic uppercase tracking-[1em] text-2xl select-none">
              Waiting for Signals...
            </p>
          </div>
        )}
      </div>

     {/* --- INPUT CONSOLE (FIX RESPONSIVE BRAY!) --- */}
      <div className="fixed bottom-6 md:bottom-10 left-0 w-full px-4 md:px-6 z-50">
        <div className="max-w-4xl mx-auto">
          {hasAccess ? (
            <div className="flex items-center gap-2 md:gap-4 bg-black/80 p-2 md:p-3 rounded-full border border-blue-500/20 backdrop-blur-3xl shadow-2xl">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Post signal..."
                className="flex-1 bg-transparent px-4 md:px-8 outline-none text-[11px] md:text-sm text-white placeholder:text-blue-500/20 font-bold min-w-0"
              />
              <button 
                onClick={sendMessage} 
                className="bg-blue-600 px-6 md:px-10 py-3 md:py-4 rounded-full hover:bg-blue-500 font-black text-[10px] md:text-xs uppercase transition-all active:scale-90 shrink-0 shadow-lg shadow-blue-600/30"
              >
                Post
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 md:gap-4 bg-zinc-950/90 p-6 md:p-8 rounded-[2.5rem] border border-red-500/20 backdrop-blur-2xl text-center">
              <p className="text-red-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
                Access Restricted: Authorization required
              </p>
              <button 
                onClick={async () => {
                  const token = localStorage.getItem('vault_token')
                  const { error } = await supabase.from('access_permissions').insert([{ agent_token: token, is_granted: false }])
                  if (!error) alert("Access request sent to Command Center.")
                }}
                className="px-8 md:px-10 py-2.5 md:py-3 bg-white/5 hover:bg-white hover:text-black rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
              >
                Request Access
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}