"use client"

import React, { useEffect, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { 
  Paintbrush, 
  Code2, 
  Layers, 
  Globe, 
  Cpu, 
  Megaphone, 
  ShieldAlert,
} from 'lucide-react'
import { useTheme } from '@/components/provider/theme-provider'

// ইমেজের মতো আইকন এবং ডাইনামিক কালার কম্বিনেশন
const openings = [
  { id: 1, title: "Web Designing", count: "302 Jobs", icon: Paintbrush, accent: "emerald" },
  { id: 2, title: "Software Enginner", count: "420 Jobs", icon: Code2, accent: "orange" },
  { id: 3, title: "UI/UX Graphics", count: "180 Jobs", icon: Layers, accent: "rose" },
  { id: 4, title: "Digital Marketing", count: "295 Jobs", icon: Megaphone, accent: "amber" },
  { id: 5, title: "Web Development", count: "510 Jobs", icon: Globe, accent: "indigo" },
  { id: 6, title: "App Development", count: "145 Jobs", icon: Cpu, accent: "pink" },
  { id: 7, title: "Cyber Security", count: "85 Jobs", icon: ShieldAlert, accent: "slate" },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
}

const itemVariants: Variants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 110, damping: 14 },
  },
}

export default function Oppning() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = mounted && resolvedTheme === "dark"

  // লিন্টার সেফ এসিনক্রোনাস মাউন্ট স্টেট
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [])

  return (
    <section className={`w-full py-20 transition-colors duration-300 ${isDark ? "bg-black text-white" : "bg-white text-zinc-950"}`}>
      
      <div
        className={`relative w-full px-4 pb-24 pt-16 transition-all duration-500 sm:px-6 lg:px-8 ${
          isDark
            ? "border-b border-zinc-900 bg-[linear-gradient(180deg,#111111_0%,#050505_100%)]"
            : "border-b border-zinc-200 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_45%,#f4f7fb_100%)]"
        }`}
        style={{
          clipPath: mounted ? 'polygon(0 0, 100% 0, 100% 84%, 86% 100%, 14% 100%, 0 84%)' : 'none'
        }}
      >
        <div className={`pointer-events-none absolute inset-0 -z-10 ${isDark ? "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_40%)]" : "bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.06),transparent_42%)]"}`} />

        <div className="mx-auto max-w-7xl">
          
          {/* Header Section */}
          <div className="mb-12 text-center">
            <p className={`text-xs font-bold uppercase tracking-[0.3em] ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              Current Openings
            </p>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className={`mx-auto mt-3 max-w-2xl text-2xl font-extrabold leading-snug tracking-tight sm:text-4xl ${
                isDark ? "text-white" : "text-zinc-950"
              }`}
            >
              We Have Worked with 10,000+ <br className="sm:hidden" /> Trusted Companies
            </motion.h2>
          </div>

          {/* কার্ড কন্টেইনার লেআউট: 
            ইমেজের মতো ডেক্সটপে প্রথম লাইনে ৪টি এবং পরের লাইনে ৩টি কার্ড অটো-সেন্টার হবে।
          */}
          <motion.div 
            className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={containerVariants}
          >
            {openings.map((item) => {
              const IconComponent = item.icon;
              const accentClasses: Record<string, { icon: string; card: string; border: string }> = {
                emerald: {
                  icon: isDark ? "text-emerald-300" : "text-emerald-700",
                  card: isDark ? "bg-emerald-500/10" : "bg-emerald-50",
                  border: isDark ? "border-emerald-500/20" : "border-emerald-200",
                },
                orange: {
                  icon: isDark ? "text-orange-300" : "text-orange-700",
                  card: isDark ? "bg-orange-500/10" : "bg-orange-50",
                  border: isDark ? "border-orange-500/20" : "border-orange-200",
                },
                rose: {
                  icon: isDark ? "text-rose-300" : "text-rose-700",
                  card: isDark ? "bg-rose-500/10" : "bg-rose-50",
                  border: isDark ? "border-rose-500/20" : "border-rose-200",
                },
                amber: {
                  icon: isDark ? "text-amber-300" : "text-amber-700",
                  card: isDark ? "bg-amber-500/10" : "bg-amber-50",
                  border: isDark ? "border-amber-500/20" : "border-amber-200",
                },
                indigo: {
                  icon: isDark ? "text-indigo-300" : "text-indigo-700",
                  card: isDark ? "bg-indigo-500/10" : "bg-indigo-50",
                  border: isDark ? "border-indigo-500/20" : "border-indigo-200",
                },
                pink: {
                  icon: isDark ? "text-pink-300" : "text-pink-700",
                  card: isDark ? "bg-pink-500/10" : "bg-pink-50",
                  border: isDark ? "border-pink-500/20" : "border-pink-200",
                },
                slate: {
                  icon: isDark ? "text-slate-300" : "text-slate-700",
                  card: isDark ? "bg-slate-500/10" : "bg-slate-50",
                  border: isDark ? "border-slate-500/20" : "border-slate-200",
                },
              }

              const accent = accentClasses[item.accent]

              return (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{ y: -6, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`group flex items-center gap-4 border p-5 text-left transition-all duration-300 cursor-pointer select-none ${
                    isDark
                      ? "border-zinc-900 bg-zinc-950/80 hover:border-zinc-700 hover:bg-zinc-900"
                      : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                  }`}
                >
                  {/* লোগো/আইকন বক্স */}
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center border ${accent.border} ${accent.card}`}>
                    <IconComponent size={18} strokeWidth={2.2} className={accent.icon} />
                  </div>

                  {/* টেক্সট কন্টেন্ট */}
                  <div className="flex flex-col text-left overflow-hidden">
                    <h3 className={`truncate text-sm font-bold tracking-tight ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
                      {item.title}
                    </h3>
                    <p className={`mt-0.5 text-xs font-semibold tracking-wide ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                      {item.count}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

        </div>
      </div>
    </section>
  )
}