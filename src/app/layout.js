import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Fortunis 11',
  description: 'Website resmi angkatan Fortunis 11 - Manajemen Informatika',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#020617] text-white antialiased min-h-screen relative overflow-x-hidden">
        
        {/* --- ORNAMEN SUPER GEZZ --- */}
        
        {/* 1. Grid Line Utama - Lebih Terang */}
        <div className="fixed inset-0 z-[-1] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        {/* 2. Dot Matrix Pattern (Titik-titik tech) */}
        <div className="fixed inset-0 z-[-1] opacity-[0.15]" 
          style={{ backgroundImage: `radial-gradient(#3b82f6 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }}>
        </div>
        
        {/* 3. Moving Ambient Glow (Cahaya Biru & Ungu yang lebih tebel) */}
        <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 blur-[130px] rounded-full z-[-1] animate-pulse"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-indigo-500/15 blur-[150px] rounded-full z-[-1]"></div>

        {/* 4. Light Beam (Garis cahaya diagonal biar gak kaku) */}
        <div className="fixed inset-0 z-[-1] opacity-20">
          <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent rotate-12"></div>
          <div className="absolute top-0 right-1/3 w-[1px] h-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent -rotate-12"></div>
        </div>

        <Navbar />

        <div className="pt-28 relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}