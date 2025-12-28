"use client"
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import Swal from 'sweetalert2' // Import SweetAlert2 bray

export default function SitrepPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)

  // Konfigurasi SweetAlert seragam bray
  const toast = {
    background: '#0B1024',
    color: '#fff',
    confirmButtonColor: '#2563eb'
  }

  const formatContent = (text) => {
    const words = text.split(' ');
    let result = '';
    let currentLine = '';

    words.forEach(word => {
      if ((currentLine + word).length > 40) {
        result += currentLine.trim() + '\n';
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    });
    return result + currentLine.trim();
  }

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

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from('anonymous_messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data || [])
  }, [])

  useEffect(() => {
    checkPermission()
    fetchMessages()
    const channel = supabase.channel('sitrep_realtime')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'anonymous_messages' }, 
        (payload) => {
          setMessages((prev) => [payload.new, ...prev])
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [checkPermission, fetchMessages])

  const sendMessage = async () => {
    if (!input) return
    const { error } = await supabase.from('anonymous_messages').insert([{ content: input }])
    if (!error) setInput('')
  }

  return (
    <main className="min-h-screen p-4 md:p-8 text-white font-mono flex flex-col items-center overflow-x-hidden">
      
      <div className="fixed top-20 right-0 p-4 opacity-[0.03] text-[10rem] md:text-[20rem] font-black text-blue-500 -rotate-12 pointer-events-none select-none z-0">
          BOARD
      </div>
      
      <div className="text-center mb-10 relative z-10">
        <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-white">
          <span className="text-blue-600">MI</span> BOARD
        </h1>
      </div>

      <div className="relative w-full max-w-[98%] bg-zinc-950/40 border-2 border-zinc-800/40 rounded-[3rem] p-6 md:p-10 shadow-2xl min-h-[70vh] backdrop-blur-md mb-40">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        
        <div className="relative z-10 columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            <AnimatePresence mode='popLayout'>
                {messages.map((msg) => (
                <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className="break-inside-avoid bg-[#0B1024] border border-blue-900/30 p-6 rounded-[2rem] shadow-xl hover:border-blue-500/50 transition-all duration-300 group"
                >
                    <p className="text-xs md:text-sm text-blue-100/90 leading-relaxed font-bold break-words whitespace-pre-wrap">
                      {formatContent(msg.content)}
                    </p>
                    
                    <div className="mt-4 border-t border-blue-900/20 pt-3">
                      <div className="w-6 h-[2px] bg-blue-600/50 group-hover:w-12 transition-all duration-500"></div>
                      <p className="text-[9px] font-mono text-blue-400/50 mt-2 uppercase tracking-widest">
                          {new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}, {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                </motion.div>
                ))}
            </AnimatePresence>
        </div>

        {messages.length === 0 && !loading && (
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <p className="text-zinc-600 font-black italic uppercase tracking-[1em] text-2xl select-none text-center">
              Waiting for Signals...
            </p>
          </div>
        )}
      </div>

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
                  if (!error) {
                    Swal.fire({ 
                      ...toast, 
                      icon: 'info', 
                      title: 'Request Sent!', 
                      text: "Access request sent to Command Center, bray. Tunggu di-approve ya!" 
                    })
                  }
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