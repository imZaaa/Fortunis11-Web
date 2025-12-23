"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function Template({ children }) {
  // 1. Daftar kumpulan gaya animasi (Presets) bray
  const animations = [
    { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },      // Slide Up
    { initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 } },    // Slide Right
    { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 } },     // Slide Left
    { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } }, // Zoom In
    { initial: { opacity: 0, rotate: -3 }, animate: { opacity: 1, rotate: 0 } } // Slight Tilt
  ]

  // 2. Set default animasi biar gak error pas pertama load
  const [variant, setVariant] = useState(animations[0])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // 3. Pilih acak pas udah masuk ke browser (Client-side) bray
    const randomAnim = animations[Math.floor(Math.random() * animations.length)]
    setVariant(randomAnim)
    setMounted(true)
  }, [])

  // Biar gak ada "flash" konten kaku, kita tunggu sampe mounted bray
  if (!mounted) return <div className="opacity-0">{children}</div>

  return (
    <motion.div
      initial={variant.initial}
      animate={variant.animate}
      transition={{ 
        ease: "easeInOut", 
        duration: 0.6 
      }}
    >
      {children}
    </motion.div>
  )
}