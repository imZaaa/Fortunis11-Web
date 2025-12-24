"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function AdminPage() {
  const [uploading, setUploading] = useState(false)
  const [mediaType, setMediaType] = useState('image') 
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [youtubeLink, setYoutubeLink] = useState('')
  const [caption, setCaption] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })
  
  // State baru buat list media bray
  const [existingMedia, setExistingMedia] = useState([])
  const [loadingMedia, setLoadingMedia] = useState(true)

  useEffect(() => {
    fetchExistingMedia()
  }, [])

  // Cleanup Preview URL
  useEffect(() => {
    return () => {
      if (previewUrl && !previewUrl.startsWith('http')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const fetchExistingMedia = async () => {
    setLoadingMedia(true)
    const { data, error } = await supabase
      .from('archive_media')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error) setExistingMedia(data)
    setLoadingMedia(false)
  }

  const getYoutubeEmbedUrl = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
    setMediaType(selectedFile.type.startsWith('video') ? 'video' : 'image')
  }

  const handleUpload = async () => {
    if (!caption) return setStatus({ type: 'error', message: 'Caption wajib diisi, Commander!' })
    
    setUploading(true)
    setStatus({ type: 'loading', message: 'Initiating upload sequence...' })

    try {
      let finalMediaUrl = ''
      let finalMediaType = mediaType

      if (mediaType === 'youtube') {
        const embedUrl = getYoutubeEmbedUrl(youtubeLink)
        if (!embedUrl) throw new Error('Link YouTube invalid bray!')
        finalMediaUrl = embedUrl
      } else {
        if (!file) throw new Error('Pilih filenya dulu bray!')
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `archive/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('archive_bucket')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('archive_bucket')
          .getPublicUrl(filePath)
        
        finalMediaUrl = publicUrl
      }

      const { error: dbError } = await supabase
        .from('archive_media')
        .insert([{ 
          media_type: finalMediaType,
          media_url: finalMediaUrl,
          caption: caption
        }])

      if (dbError) throw dbError

      setStatus({ type: 'success', message: 'Mission Accomplished! Media archived.' })
      setFile(null)
      setPreviewUrl(null)
      setCaption('')
      setYoutubeLink('')
      fetchExistingMedia() // Refresh list setelah upload
      setTimeout(() => setStatus({ type: '', message: '' }), 3000)

    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Upload failed!' })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (item) => {
    const confirmDelete = confirm('Yakin mau hapus memori ini bray? Gak bisa balik lagi lho!')
    if (!confirmDelete) return

    try {
      setStatus({ type: 'loading', message: 'Initiating deletion sequence...' })

      // 1. HAPUS DI STORAGE (Jika bukan YouTube)
      if (item.media_type !== 'youtube') {
        // Ambil nama file dengan cara yang lebih aman bray
        // Kita cari string setelah 'archive_bucket/'
        const pathParts = item.media_url.split('archive_bucket/')
        if (pathParts.length > 1) {
          const filePath = pathParts[1].split('?')[0] // Buang query params kalau ada
          
          console.log("Target hapus storage:", filePath) // Debugging

          const { error: storageError } = await supabase.storage
            .from('archive_bucket')
            .remove([filePath])
          
          if (storageError) {
            console.error("Storage Error:", storageError)
            // Kita lanjut aja tetep hapus DB atau stop? 
            // Biasanya mending stop biar data sinkron
            throw new Error(`Gagal hapus file di storage: ${storageError.message}`)
          }
        }
      }

      // 2. HAPUS DI DATABASE
      console.log("Target hapus DB ID:", item.id) // Debugging
      
      const { error: dbError } = await supabase
        .from('archive_media')
        .delete()
        .eq('id', item.id)

      if (dbError) {
        console.error("DB Error:", dbError)
        throw dbError
      }

      // 3. UPDATE UI (Cuma kalau beneran sukses)
      setExistingMedia((prev) => prev.filter(m => m.id !== item.id))
      setStatus({ type: 'success', message: 'Target eliminated from archive!' })
      
      setTimeout(() => setStatus({ type: '', message: '' }), 3000)

    } catch (error) {
      console.error("Full Error Context:", error)
      setStatus({ type: 'error', message: `Mission Failed: ${error.message}` })
      alert(`Gagal total bray! Cek console. Error: ${error.message}`)
    }
  }

  return (
    <main className="min-h-screen p-6 md:p-12 relative overflow-x-hidden bg-[#020617]">
      <div className="fixed top-20 right-0 p-4 opacity-[0.03] text-[20rem] font-black text-blue-500 -rotate-12 pointer-events-none select-none z-0">ADMIN</div>

      <div className="relative z-10 w-full max-w-2xl mx-auto bg-blue-950/30 border border-blue-500/30 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] shadow-2xl mb-20">
        {/* Header */}
        <div className="text-center mb-10">
           <Link href="/" className="text-zinc-500 hover:text-blue-400 transition-colors text-[10px] font-bold uppercase tracking-[0.3em] mb-2 block">← Abort Mission</Link>
           <h1 className="text-4xl md:text-5xl font-black italic text-white uppercase tracking-tighter">Upload <span className="text-blue-600">Deck</span></h1>
           <p className="text-blue-200/60 font-mono text-sm mt-2">// Secure channel established. Ready for input.</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-black/40 p-1 rounded-full mb-8 border border-blue-500/20">
          <button onClick={() => setMediaType('image')} className={`flex-1 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${mediaType !== 'youtube' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-500 hover:text-zinc-300'}`}>File Upload</button>
          <button onClick={() => setMediaType('youtube')} className={`flex-1 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${mediaType === 'youtube' ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20' : 'text-zinc-500 hover:text-zinc-300'}`}>YouTube Link</button>
        </div>

        {/* Form Input */}
        <div className="space-y-6">
          {mediaType === 'youtube' ? (
            <input 
              type="text" 
              placeholder="Paste YouTube URL here..."
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              className="w-full bg-blue-950/40 border border-pink-500/30 rounded-2xl py-4 px-6 text-white font-mono text-sm focus:outline-none focus:border-pink-500 transition-all"
            />
          ) : (
            <div className="relative group">
               <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
               <div className={`bg-blue-950/40 border-2 border-dashed ${file ? 'border-blue-500' : 'border-blue-500/30'} rounded-3xl p-8 text-center transition-all overflow-hidden`}>
                  {previewUrl ? (
                    mediaType === 'video' ? 
                      <video src={previewUrl} className="w-full h-64 object-cover rounded-2xl" /> :
                      <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover rounded-2xl" />
                  ) : (
                    <div className="py-10">
                       <p className="text-4xl mb-4">📂</p>
                       <p className="text-blue-400 font-bold uppercase tracking-widest text-xs">Drop files or click</p>
                    </div>
                  )}
               </div>
            </div>
          )}

          <textarea 
            placeholder="Enter mission briefing (Caption)..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full bg-blue-950/40 border border-blue-500/30 rounded-2xl py-4 px-6 text-white font-mono text-sm focus:outline-none focus:border-blue-500 h-32 resize-none"
          ></textarea>

          {status.message && (
             <div className={`text-center font-mono text-xs font-bold uppercase tracking-widest animate-pulse ${status.type === 'error' ? 'text-red-500' : status.type === 'success' ? 'text-green-500' : 'text-blue-400'}`}>
                {status.message}
             </div>
          )}

          <button 
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {uploading ? 'Deploying...' : 'Deploy to Archive'}
          </button>
        </div>
      </div>

      {/* --- SECTION: MANAGE ARCHIVE --- */}
      <div className="relative z-10 max-w-5xl mx-auto mb-20">
        <div className="flex items-center gap-6 mb-10">
            <h2 className="text-white font-black italic text-2xl uppercase tracking-tighter">Manage <span className="text-blue-500">Archive</span></h2>
            <div className="h-[1px] flex-1 bg-blue-500/20"></div>
        </div>

        {loadingMedia ? (
          <p className="text-center font-mono text-blue-500 text-xs animate-pulse">SCANNING_DATABASE...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {existingMedia.map((item) => (
              <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-white/5 bg-white/5">
                {item.media_type === 'youtube' ? (
                  <div className="w-full h-full flex items-center justify-center bg-red-950/20 text-red-500 text-[10px] font-mono p-2 text-center">YOUTUBE_LINK</div>
                ) : item.media_type === 'video' ? (
                  <video src={item.media_url} className="w-full h-full object-cover opacity-50" />
                ) : (
                  <img src={item.media_url} className="w-full h-full object-cover opacity-50" />
                )}
                
                {/* Overlay Hapus */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                  <p className="text-[8px] text-white/60 font-mono mb-2 line-clamp-2 text-center">{item.caption}</p>
                  <button 
                    onClick={() => handleDelete(item)}
                    className="bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase px-4 py-2 rounded-full transition-all active:scale-90"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}