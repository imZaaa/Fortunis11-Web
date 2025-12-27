import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Digital Command Center: The MI-23 Legacy',
  description: 'Website resmi angkatan Fortunis 11 - Manajemen Informatika',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-[#020617] text-white antialiased min-h-screen relative`}>
        
        {/* --- ORNAMEN OPTIMIZED VERSION --- */}
        
        {/* 1 & 2. Gabungin Grid & Dot Matrix biar cuma 1 layer bray (Lebih Enteng!) */}
        <div className="fixed inset-0 z-[-1] pointer-events-none opacity-40">
           {/* Grid Line - Pake CSS pattern biasa aja biar gak berat */}
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
           
           {/* Dot Matrix - Dijadiin satu biar GPU gak pusing */}
           <div className="absolute inset-0 opacity-[0.2]" 
             style={{ backgroundImage: `radial-gradient(#3b82f6 0.5px, transparent 0.5px)`, backgroundSize: '32px 32px' }}>
           </div>
        </div>
        
        {/* 3. Ambient Glow - Kurangi blur & animasi pulse biar CPU adem */}
        <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full z-[-1]"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full z-[-1]"></div>

        {/* 4. Light Beam - Static aja bray, jangan di-animate kalau di layout utama */}
        <div className="fixed inset-0 z-[-1] opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[1px] h-full bg-blue-500 rotate-12"></div>
          <div className="absolute top-0 right-1/3 w-[1px] h-full bg-indigo-500 -rotate-12"></div>
        </div>

        <Navbar />

        <div className="pt-28 relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}