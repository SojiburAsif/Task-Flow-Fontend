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
  { id: 2, title: "Software Engineer", count: "420 Jobs", icon: Code2, accent: "orange" },
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
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 120, damping: 15 },
  },
}

export default function Openings() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = mounted && resolvedTheme === "dark"

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [])

  return (
    <section className={`relative w-full py-24 transition-colors duration-300 ${isDark ? "bg-black text-white" : "bg-zinc-50 text-zinc-950"}`}>
      
      {/* Background Gradient & Grid Effects */}
      <div className="absolute inset-0 z-0 bg-transparent dark:bg-transparent" />
      <div className={`absolute inset-0 z-0 opacity-[0.03] ${isDark ? "bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]" : "bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)]"} bg-[size:4rem_4rem]`} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* =========================================
            HEADER SECTION (Sharp Design)
        ============================================= */}
        <div className="mb-16 flex flex-col items-center text-center">
          <span className={`mb-4 inline-flex border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] rounded-none ${
            isDark 
              ? "border-purple-500/30 bg-purple-500/10 text-purple-400" 
              : "border-purple-200 bg-purple-50 text-purple-700"
          }`}>
            Current Openings
          </span>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-5xl ${
              isDark ? "text-white" : "text-zinc-950"
            }`}
          >
            We Have Worked With 10,000+ <br className="hidden sm:block" /> Trusted Companies
          </motion.h2>
          <p className={`mt-4 max-w-xl text-sm font-medium ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            Explore our diverse range of opportunities and join the industry leaders shaping the future of technology and business.
          </p>
        </div>

        {/* =========================================
            CARDS GRID SECTION
        ============================================= */}
        <motion.div 
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {openings.map((item) => {
            const IconComponent = item.icon;
            
            // ডাইনামিক শার্প কালার টোন
            const accentClasses: Record<string, { icon: string; card: string; border: string; line: string; hoverBorder: string }> = {
              emerald: {
                icon: isDark ? "text-emerald-400" : "text-emerald-600",
                card: isDark ? "bg-emerald-500/10" : "bg-emerald-50",
                border: isDark ? "border-emerald-500/20" : "border-emerald-200",
                line: isDark ? "bg-emerald-500" : "bg-emerald-500",
                hoverBorder: isDark ? "hover:border-emerald-500/50" : "hover:border-emerald-400",
              },
              orange: {
                icon: isDark ? "text-orange-400" : "text-orange-600",
                card: isDark ? "bg-orange-500/10" : "bg-orange-50",
                border: isDark ? "border-orange-500/20" : "border-orange-200",
                line: isDark ? "bg-orange-500" : "bg-orange-500",
                hoverBorder: isDark ? "hover:border-orange-500/50" : "hover:border-orange-400",
              },
              rose: {
                icon: isDark ? "text-rose-400" : "text-rose-600",
                card: isDark ? "bg-rose-500/10" : "bg-rose-50",
                border: isDark ? "border-rose-500/20" : "border-rose-200",
                line: isDark ? "bg-rose-500" : "bg-rose-500",
                hoverBorder: isDark ? "hover:border-rose-500/50" : "hover:border-rose-400",
              },
              amber: {
                icon: isDark ? "text-amber-400" : "text-amber-600",
                card: isDark ? "bg-amber-500/10" : "bg-amber-50",
                border: isDark ? "border-amber-500/20" : "border-amber-200",
                line: isDark ? "bg-amber-500" : "bg-amber-500",
                hoverBorder: isDark ? "hover:border-amber-500/50" : "hover:border-amber-400",
              },
              indigo: {
                icon: isDark ? "text-indigo-400" : "text-indigo-600",
                card: isDark ? "bg-indigo-500/10" : "bg-indigo-50",
                border: isDark ? "border-indigo-500/20" : "border-indigo-200",
                line: isDark ? "bg-indigo-500" : "bg-indigo-500",
                hoverBorder: isDark ? "hover:border-indigo-500/50" : "hover:border-indigo-400",
              },
              pink: {
                icon: isDark ? "text-pink-400" : "text-pink-600",
                card: isDark ? "bg-pink-500/10" : "bg-pink-50",
                border: isDark ? "border-pink-500/20" : "border-pink-200",
                line: isDark ? "bg-pink-500" : "bg-pink-500",
                hoverBorder: isDark ? "hover:border-pink-500/50" : "hover:border-pink-400",
              },
              slate: {
                icon: isDark ? "text-zinc-300" : "text-zinc-700",
                card: isDark ? "bg-zinc-500/10" : "bg-zinc-100",
                border: isDark ? "border-zinc-500/20" : "border-zinc-300",
                line: isDark ? "bg-zinc-500" : "bg-zinc-600",
                hoverBorder: isDark ? "hover:border-zinc-500/50" : "hover:border-zinc-400",
              },
            }

            const accent = accentClasses[item.accent]

            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className={`group relative flex items-center gap-5 border p-5 text-left transition-all duration-300 cursor-pointer select-none rounded-none shadow-none hover:shadow-lg hover:-translate-y-1 ${accent.hoverBorder} ${
                  isDark
                    ? "border-zinc-800 bg-zinc-950/80"
                    : "border-zinc-200 bg-white"
                }`}
              >
                {/* Sharp Geometric Icon Container */}
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center border rounded-none ${accent.border} ${accent.card}`}>
                  <IconComponent size={22} strokeWidth={2} className={accent.icon} />
                </div>
                
                {/* Text Content */}
                <div className="flex flex-col text-left overflow-hidden">
                  <h3 className={`truncate text-base font-bold tracking-tight transition-colors ${isDark ? "text-zinc-100 group-hover:text-white" : "text-zinc-900"}`}>
                    {item.title}
                  </h3>
                  <p className={`mt-1 text-xs font-bold uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                    {item.count}
                  </p>
                </div>

                {/* Bottom Decorative Hover Line */}
                <div className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full ${accent.line}`} />
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}