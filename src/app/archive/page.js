"use client"

import { useEffect, useState, useMemo, useCallback } from 'react' // Tambah useMemo & useCallback bray
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { motion, AnimatePresence } from 'framer-motion'

export default function ArchivePage() {
  const [mediaItems, setMediaItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false) // State buat load more
  const [selectedItem, setSelectedItem] = useState(null)
  const [hasMore, setHasMore] = useState(true) // Cek masih ada data gak di server
  const [page, setPage] = useState(0)
  
  const ITEMS_PER_PAGE = 12 // Tarik 12 data aja sekali jalan biar enteng bray

  // Pakai useCallback biar fungsi gak dibikin ulang terus pas render
  const fetchMedia = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    const from = page * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, error } = await supabase
      .from('archive_media')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to) // INI KUNCINYA BRAY! Narik data bertahap.

    if (!error && data) {
      if (isInitial) {
        setMediaItems(data);
      } else {
        setMediaItems(prev => [...prev, ...data]); // Gabungin data lama ama baru
      }
      
      // Kalau data yang balik kurang dari ITEMS_PER_PAGE, berarti udah abis
      if (data.length < ITEMS_PER_PAGE) setHasMore(false);
    }

    setLoading(false);
    setLoadingMore(false);
  }, [page]);

  useEffect(() => {
    fetchMedia(page === 0);
  }, [fetchMedia, page]);

  // USE MEMO: Biar filter ini gak dijalanin terus tiap ada perubahan kecil bray. 
  // Browser jadi gak capek mikir.
  const categorizedMedia = useMemo(() => {
    return {
      photos: mediaItems.filter(item => item.media_type === 'image' || (!['video', 'youtube'].includes(item.media_type))),
      videos: mediaItems.filter(item => item.media_type === 'video'),
      youtubeLinks: mediaItems.filter(item => item.media_type === 'youtube')
    }
  }, [mediaItems]);

  const { photos, videos, youtubeLinks } = categorizedMedia;

  // HELPER AUTO KOMPRES (Tetep aman bray)
  const getOptimizedUrl = (url, type, isModal = false) => {
    if (type !== 'image') return url;
    const width = isModal ? 1200 : 600;
    const quality = isModal ? 80 : 60;
    return `${url}?width=${width}&quality=${quality}`;
  }

  // LOGIK RENDER MEDIA
  const renderMediaContent = (item, isModal = false) => {
    const mediaClasses = isModal 
      ? "max-w-full max-h-[75vh] object-contain mx-auto block rounded-xl shadow-2xl" 
      : "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105";
    
    if (item.media_type === 'youtube') {
        return (
            <iframe 
                src={item.media_url} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className={`aspect-video w-full ${isModal ? 'max-w-4xl mx-auto shadow-2xl' : 'pointer-events-none'}`}
                loading="lazy"
            ></iframe>
        )
    } else if (item.media_type === 'video') {
        return (
            <video 
                src={item.media_url} 
                className={mediaClasses} 
                controls={isModal} 
                autoPlay={isModal} 
                loop 
                muted={!isModal} 
                playsInline 
                preload="metadata"
            />
        )
    } else {
        return (
            <img 
                src={getOptimizedUrl(item.media_url, 'image', isModal)} 
                alt={item.caption} 
                className={mediaClasses}
                loading="lazy"
            />
        )
    }
  }

  if (loading && page === 0) return (
    <div className="min-h-screen bg-[#020617] p-12 flex flex-col items-center justify-center">
      <div className="w-20 h-20 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin mb-4"></div>
      <p className="text-pink-500 font-mono italic animate-pulse tracking-widest text-sm">Sedang Sinkron Data...</p>
    </div>
  )

  return (
    <main className="min-h-screen p-6 md:p-12 lg:p-20 relative overflow-x-hidden">
      {/* Background Text */}
      <div className="fixed top-20 left-0 p-4 opacity-[0.03] text-[15rem] font-black text-pink-500 rotate-12 pointer-events-none select-none z-0">VAULT</div>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-24 relative z-10 text-center">
          <h2 className="text-pink-500 text-xs font-bold uppercase tracking-[0.5em] mb-4 font-mono">Classified Memories</h2>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white">
            THE <span className="text-pink-600 drop-shadow-[0_0_20px_rgba(236,72,153,0.4)]">VAULT</span>
          </h1>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 pb-20 space-y-32">
        
        {/* --- SECTION: YOUTUBE --- */}
        {youtubeLinks.length > 0 && (
            <section>
                <div className="flex items-center gap-6 mb-12">
                    <h3 className="text-red-500 font-mono font-black italic tracking-[0.4em] uppercase text-2xl whitespace-nowrap">Youtube</h3>
                    <div className="h-[1px] w-full bg-gradient-to-r from-red-500/50 to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {youtubeLinks.map((item, index) => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: 0.1 }}
                            onClick={() => setSelectedItem(item)}
                            className="group relative rounded-[2rem] overflow-hidden bg-red-950/10 border border-red-500/20 backdrop-blur-md cursor-pointer hover:border-red-500 transition-all duration-500 shadow-2xl"
                        >
                            <div className="aspect-video relative overflow-hidden">
                                {renderMediaContent(item)}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-60"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-red-600/40 backdrop-blur-xl rounded-full flex items-center justify-center border border-red-500/40 group-hover:scale-110 transition-transform">
                                    <span className="text-white text-2xl">▶</span>
                                </div>
                            </div>
                            <div className="p-6 bg-black/40">
                                <h4 className="text-white font-bold text-xl italic line-clamp-2">{item.caption}</h4>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        )}

        {/* --- SECTION: VIDEOS --- */}
        {videos.length > 0 && (
            <section>
                <div className="flex items-center gap-6 mb-12">
                    <h3 className="text-purple-500 font-mono font-black italic tracking-[0.4em] uppercase text-2xl whitespace-nowrap">Videos</h3>
                    <div className="h-[1px] w-full bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                </div>
                <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 1024: 3}}>
                    <Masonry gutter="24px">
                        {videos.map((item) => (
                            <div key={item.id} onClick={() => setSelectedItem(item)} className="group relative rounded-[2rem] overflow-hidden border border-purple-500/20 cursor-pointer bg-purple-950/5">
                                <div className="relative">
                                    {renderMediaContent(item)}
                                    <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <div className="w-14 h-14 bg-purple-600/40 backdrop-blur-md rounded-full flex items-center justify-center border border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                                            <span className="text-white text-xl">▶</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                                    <p className="text-white font-bold italic">{item.caption}</p>
                                </div>
                            </div>
                        ))}
                    </Masonry>
                </ResponsiveMasonry>
            </section>
        )}

        {/* --- SECTION: PHOTOS --- */}
        {photos.length > 0 && (
            <section>
                <div className="flex items-center gap-6 mb-12">
                    <h3 className="text-blue-500 font-mono font-black italic tracking-[0.4em] uppercase text-2xl whitespace-nowrap">Photos</h3>
                    <div className="h-[1px] w-full bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                </div>
                <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 1024: 3}}>
                    <Masonry gutter="24px">
                        {photos.map((item) => (
                            <motion.div 
                                key={item.id}
                                whileHover={{ y: -10 }}
                                onClick={() => setSelectedItem(item)}
                                className="group relative rounded-[2.5rem] overflow-hidden border border-blue-400/20 cursor-pointer bg-blue-950/5"
                            >
                                {renderMediaContent(item)}
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-all p-8 flex flex-col justify-end">
                                    <p className="text-white font-bold italic line-clamp-3">{item.caption}</p>
                                </div>
                            </motion.div>
                        ))}
                    </Masonry>
                </ResponsiveMasonry>
            </section>
        )}

        {/* TOMBOL LOAD MORE - BIAR LANCAR JAYA BRAY */}
        {hasMore && (
          <div className="flex justify-center pt-10">
            <button 
              onClick={() => setPage(prev => prev + 1)}
              disabled={loadingMore}
              className="px-8 py-3 bg-pink-600/20 border border-pink-500/40 text-pink-500 rounded-full font-mono text-xs uppercase tracking-[0.2em] hover:bg-pink-600 hover:text-white transition-all active:scale-95 disabled:opacity-50"
            >
              {loadingMore ? 'Decryption in progress...' : 'Load More Memories'}
            </button>
          </div>
        )}
      </div>

      {/* MODAL LIGHTBOX */}
      <AnimatePresence>
        {selectedItem && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/98 backdrop-blur-3xl"
                onClick={() => setSelectedItem(null)}
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="relative max-w-6xl w-full flex flex-col items-center"
                    onClick={(e) => e.stopPropagation()} 
                >
                    <div className="w-full flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <span className={`w-3 h-3 rounded-full animate-pulse ${selectedItem.media_type === 'youtube' ? 'bg-red-500' : selectedItem.media_type === 'video' ? 'bg-purple-500' : 'bg-blue-500'}`}></span>
                            <p className="text-xs font-mono text-white/60 uppercase tracking-widest italic">{selectedItem.media_type} Original_View</p>
                        </div>
                        <button onClick={() => setSelectedItem(null)} className="text-white/40 hover:text-white font-mono text-sm bg-white/5 px-6 py-2 rounded-full border border-white/10 transition-all active:scale-95">CLOSE [X]</button>
                    </div>

                    <div className="w-full flex justify-center items-center overflow-hidden">
                        {renderMediaContent(selectedItem, true)}
                    </div>
                    
                    <div className="mt-8 w-full max-w-4xl text-center md:text-left">
                        <p className="text-white text-2xl md:text-4xl font-black italic leading-tight tracking-tight">{selectedItem.caption}</p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-blue-400">{new Date(selectedItem.created_at).toDateString()}</span>
                            <div className="hidden md:block h-[1px] flex-1 bg-white/10"></div>
                            <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">Vault_Access_Granted</p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
      
      {/* Footer Back Button */}
      <div className="max-w-7xl mx-auto mt-20 pb-20 text-center relative z-[50]">
        <Link 
          href="/" 
          className="inline-block px-10 py-4 border border-zinc-800 rounded-full text-zinc-600 hover:text-white hover:border-white transition-all text-xs font-black uppercase tracking-[0.3em] cursor-pointer"
        >
          ← Back to Base
        </Link>
      </div>
    </main>
  )
}