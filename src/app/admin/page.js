"use client"

import { useState, useEffect } from 'react' // Tambah useEffect bray
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AdminPage() {
  const [uploading, setUploading] = useState(false)
  const [mediaType, setMediaType] = useState('image') // 'image', 'video', 'youtube'
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [youtubeLink, setYoutubeLink] = useState('')
  const [caption, setCaption] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })

  // Cleanup Preview URL biar gak makan RAM bray (Memory Leak Prevention)
  useEffect(() => {
    return () => {
      if (previewUrl && !previewUrl.startsWith('http')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  // Helper: Ubah link YouTube biasa jadi link embed bray
  const getYoutubeEmbedUrl = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null
  }

  // Handle pilih file & bikin preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return
    
    // Revoke URL lama kalo user ganti-ganti file
    if (previewUrl) URL.revokeObjectURL(previewUrl)

    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
    
    // Auto switch mediaType berdasarkan file yang dipilih
    if (selectedFile.type.startsWith('video')) {
      setMediaType('video')
    } else {
      setMediaType('image')
    }
  }

  // LOGIKA UPLOAD UTAMA BRAY!
  const handleUpload = async () => {
    // Validasi dasar
    if (!caption) return setStatus({ type: 'error', message: 'Caption wajib diisi, Commander!' })
    
    setUploading(true)
    setStatus({ type: 'loading', message: 'Initiating upload sequence...' })

    try {
      let finalMediaUrl = ''
      let finalMediaType = mediaType

      if (mediaType === 'youtube') {
        // Logic YouTube
        const embedUrl = getYoutubeEmbedUrl(youtubeLink)
        if (!embedUrl) throw new Error('Link YouTube invalid bray!')
        finalMediaUrl = embedUrl
        finalMediaType = 'youtube'
      } else {
        // Logic File (Image/Video) ke Supabase Storage
        if (!file) throw new Error('Pilih filenya dulu bray!')
        
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `archive/${fileName}`

        setStatus({ type: 'loading', message: 'Uploading to secure storage...' })
        
        // 1. Upload ke Bucket 'archive_bucket'
        const { error: uploadError } = await supabase.storage
          .from('archive_bucket') // Pastiin nama bucket lu ini ya bray!
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) throw uploadError

        // 2. Ambil Public URL nya
        const { data: { publicUrl } } = supabase.storage
          .from('archive_bucket')
          .getPublicUrl(filePath)
        
        finalMediaUrl = publicUrl
      }

      // 3. Simpen data ke Tabel Database 'archive_media'
      setStatus({ type: 'loading', message: 'Syncing with database core...' })
      const { error: dbError } = await supabase
        .from('archive_media') // Pastiin nama tabel lu ini!
        .insert([{ 
          media_type: finalMediaType,
          media_url: finalMediaUrl,
          caption: caption
        }])

      if (dbError) throw dbError

      // Sukses! Reset form.
      setStatus({ type: 'success', message: 'Mission Accomplished! Media archived.' })
      setFile(null)
      setPreviewUrl(null)
      setCaption('')
      setYoutubeLink('')
      setTimeout(() => setStatus({ type: '', message: '' }), 3000)

    } catch (error) {
      console.error("Upload Error:", error)
      setStatus({ type: 'error', message: error.message || 'Upload failed!' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen p-6 md:p-12 relative overflow-hidden flex items-center justify-center">
       <div className="fixed top-20 right-0 p-4 opacity-[0.03] text-[20rem] font-black text-blue-500 -rotate-12 pointer-events-none select-none z-0">ADMIN</div>

      <div className="relative z-10 w-full max-w-2xl bg-blue-950/30 border border-blue-500/30 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-10">
           <Link href="/" className="text-zinc-500 hover:text-blue-400 transition-colors text-[10px] font-bold uppercase tracking-[0.3em] mb-2 block">← Abort Mission</Link>
           <h1 className="text-4xl md:text-5xl font-black italic text-white uppercase tracking-tighter">Upload <span className="text-blue-600">Deck</span></h1>
           <p className="text-blue-200/60 font-mono text-sm mt-2">// Secure channel established. Ready for input.</p>
        </div>

        {/* Tabs Pilihan Tipe */}
        <div className="flex bg-black/40 p-1 rounded-full mb-8 border border-blue-500/20">
          <button 
            onClick={() => {
              setMediaType('image')
              setYoutubeLink('')
            }} 
            className={`flex-1 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${mediaType !== 'youtube' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            File Upload
          </button>
          <button 
            onClick={() => {
              setMediaType('youtube')
              setFile(null)
              setPreviewUrl(null)
            }} 
            className={`flex-1 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${mediaType === 'youtube' ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            YouTube Link
          </button>
        </div>

        {/* Form Input */}
        <div className="space-y-6">
          
          {/* Input Area Berdasarkan Tipe */}
          {mediaType === 'youtube' ? (
            <input 
              type="text" 
              placeholder="Paste YouTube URL here..."
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              className="w-full bg-blue-950/40 border border-pink-500/30 rounded-2xl py-4 px-6 text-white font-mono text-sm focus:outline-none focus:border-pink-500 transition-all placeholder:text-pink-500/30"
            />
          ) : (
            <div className="relative group">
               <input 
                 type="file" 
                 accept="image/*,video/*" 
                 onChange={handleFileChange} 
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
               />
               <div className={`bg-blue-950/40 border-2 border-dashed ${file ? 'border-blue-500' : 'border-blue-500/30'} rounded-3xl p-8 text-center group-hover:border-blue-500 transition-all overflow-hidden relative`}>
                  {previewUrl ? (
                    mediaType === 'video' ? 
                      <video src={previewUrl} className="w-full h-64 object-cover rounded-2xl shadow-lg" controls /> :
                      <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover rounded-2xl shadow-lg" />
                  ) : (
                    <div className="py-10">
                       <p className="text-4xl mb-4">📂</p>
                       <p className="text-blue-400 font-bold uppercase tracking-widest text-xs">Drag & Drop or Click to browse</p>
                       <p className="text-blue-500/40 text-[10px] mt-2 font-mono">Supports Images & Videos</p>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* Caption Input */}
          <textarea 
            placeholder="Enter mission briefing (Caption)..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full bg-blue-950/40 border border-blue-500/30 rounded-2xl py-4 px-6 text-white font-mono text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-blue-500/30 h-32 resize-none"
          ></textarea>

          {/* Status Message */}
          {status.message && (
             <div className={`text-center font-mono text-xs font-bold uppercase tracking-widest animate-pulse ${status.type === 'error' ? 'text-red-500' : status.type === 'success' ? 'text-green-500' : 'text-blue-400'}`}>
                {status.message}
             </div>
          )}

          {/* Deploy Button */}
          <button 
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          >
            {uploading ? (
               <div className="flex items-center justify-center gap-3">
                 <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                 <span>Deploying...</span>
               </div>
            ) : 'Deploy to Archive'}
            {uploading && <motion.div className="absolute bottom-0 left-0 h-1 bg-white/50" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 3, ease: "linear", repeat: Infinity }} />}
          </button>

        </div>
      </div>
    </main>
  )
}