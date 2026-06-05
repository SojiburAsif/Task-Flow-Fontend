"use client"

import React, { useEffect, useState } from 'react'
import { 
  Code2, 
  Cloud, 
  Truck, 
  Cpu, 
  PhoneCall, 
  Stethoscope, 
  ShieldCheck, 
  Layers, 
  ShoppingBag, 
  GraduationCap, 
  Briefcase, 
  Printer,
  ArrowRight,
  Grid
} from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import { useTheme } from '@/components/provider/theme-provider'

// ক্যাটাগরি ডেটা অবজেক্ট
const categories = [
  { id: 1, name: "Software Company", count: "607 Jobs", icon: Code2, accent: "sky" },
  { id: 2, name: "Cloud Computing", count: "960 Jobs", icon: Cloud, accent: "blue" },
  { id: 3, name: "Logistics/Shipping", count: "438 Jobs", icon: Truck, accent: "amber" },
  { id: 4, name: "Engineering Services", count: "644 Jobs", icon: Cpu, accent: "orange" },
  { id: 5, name: "Telecom/ Internet", count: "380 Jobs", icon: PhoneCall, accent: "green" },
  { id: 6, name: "Healthcare/Pharma", count: "472 Jobs", icon: Stethoscope, accent: "rose" },
  { id: 7, name: "Finance/Insurance", count: "654 Jobs", icon: ShieldCheck, accent: "emerald" },
  { id: 8, name: "Product Software", count: "732 Jobs", icon: Layers, accent: "violet" },
  { id: 9, name: "Diversified/Retail", count: "610 Jobs", icon: ShoppingBag, accent: "pink" },
  { id: 10, name: "Education", count: "960 Jobs", icon: GraduationCap, accent: "teal" },
  { id: 11, name: "Banking/BPO", count: "740 Jobs", icon: Briefcase, accent: "indigo" },
  { id: 12, name: "Printing & Packaging", count: "425 Jobs", icon: Printer, accent: "slate" },
]

// Framer Motion অ্যানিমেশন ভ্যারিয়েন্টস
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

export default function Category() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = mounted && resolvedTheme === "dark"

  // ফিক্সড useEffect: সিঙ্ক্রোনাসলি setState কল না করে অ্যাসিনক্রোনাস ফ্রেমে পুশ করা হয়েছে
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  return (
    <section className={`relative w-full overflow-hidden py-24 transition-colors duration-300 ${isDark ? "bg-black text-white" : "bg-zinc-50 text-zinc-950"}`}>
      
      {/* Background Geometric Grid Effects (Matching other pages) */}
      <div className="absolute inset-0 z-0 bg-transparent dark:bg-transparent" />
      <div className={`absolute inset-0 z-0 opacity-[0.03] ${isDark ? "bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]" : "bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)]"} bg-[size:4rem_4rem]`} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* =========================================
            SECTION HEADER (Sharp Design)
        ============================================= */}
        <div className="mb-16 flex flex-col items-center text-center">
          <div className={`mb-4 flex items-center gap-2 border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] rounded-none ${
            isDark 
              ? "border-purple-500/30 bg-purple-500/10 text-purple-400" 
              : "border-purple-200 bg-purple-50 text-purple-700"
          }`}>
            <Grid size={12} className={isDark ? "text-purple-400" : "text-purple-600"} /> Popular Categories
          </div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-5xl ${
              isDark ? "text-white" : "text-zinc-950"
            }`}
          >
            Browse Top <span className="text-purple-600 dark:text-purple-400">Categories</span>
          </motion.h2>
          <p className={`mt-4 max-w-xl text-sm font-medium ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            Discover leading industries and connect with thousands of active job opportunities right now.
          </p>
        </div>

        {/* =========================================
            CATEGORIES GRID (Sharp Brutalist Cards)
        ============================================= */}
        <motion.div 
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {categories.map((category) => {
            const IconComponent = category.icon;
            
            // ডাইনামিক শার্প কালার টোন (No Rounded, Sharp Borders)
            const accentClasses: Record<string, { container: string; icon: string; hover: string; line: string }> = {
              sky: {
                container: isDark ? "border-sky-500/20 bg-sky-500/10" : "border-sky-200 bg-sky-50",
                icon: isDark ? "text-sky-400" : "text-sky-600",
                hover: isDark ? "hover:border-sky-500/50" : "hover:border-sky-400",
                line: "bg-sky-500",
              },
              blue: {
                container: isDark ? "border-blue-500/20 bg-blue-500/10" : "border-blue-200 bg-blue-50",
                icon: isDark ? "text-blue-400" : "text-blue-600",
                hover: isDark ? "hover:border-blue-500/50" : "hover:border-blue-400",
                line: "bg-blue-500",
              },
              amber: {
                container: isDark ? "border-amber-500/20 bg-amber-500/10" : "border-amber-200 bg-amber-50",
                icon: isDark ? "text-amber-400" : "text-amber-600",
                hover: isDark ? "hover:border-amber-500/50" : "hover:border-amber-400",
                line: "bg-amber-500",
              },
              orange: {
                container: isDark ? "border-orange-500/20 bg-orange-500/10" : "border-orange-200 bg-orange-50",
                icon: isDark ? "text-orange-400" : "text-orange-600",
                hover: isDark ? "hover:border-orange-500/50" : "hover:border-orange-400",
                line: "bg-orange-500",
              },
              green: {
                container: isDark ? "border-emerald-500/20 bg-emerald-500/10" : "border-emerald-200 bg-emerald-50",
                icon: isDark ? "text-emerald-400" : "text-emerald-600",
                hover: isDark ? "hover:border-emerald-500/50" : "hover:border-emerald-400",
                line: "bg-emerald-500",
              },
              rose: {
                container: isDark ? "border-rose-500/20 bg-rose-500/10" : "border-rose-200 bg-rose-50",
                icon: isDark ? "text-rose-400" : "text-rose-600",
                hover: isDark ? "hover:border-rose-500/50" : "hover:border-rose-400",
                line: "bg-rose-500",
              },
              emerald: {
                container: isDark ? "border-emerald-500/20 bg-emerald-500/10" : "border-emerald-200 bg-emerald-50",
                icon: isDark ? "text-emerald-400" : "text-emerald-600",
                hover: isDark ? "hover:border-emerald-500/50" : "hover:border-emerald-400",
                line: "bg-emerald-500",
              },
              violet: {
                container: isDark ? "border-violet-500/20 bg-violet-500/10" : "border-violet-200 bg-violet-50",
                icon: isDark ? "text-violet-400" : "text-violet-600",
                hover: isDark ? "hover:border-violet-500/50" : "hover:border-violet-400",
                line: "bg-violet-500",
              },
              pink: {
                container: isDark ? "border-pink-500/20 bg-pink-500/10" : "border-pink-200 bg-pink-50",
                icon: isDark ? "text-pink-400" : "text-pink-600",
                hover: isDark ? "hover:border-pink-500/50" : "hover:border-pink-400",
                line: "bg-pink-500",
              },
              teal: {
                container: isDark ? "border-teal-500/20 bg-teal-500/10" : "border-teal-200 bg-teal-50",
                icon: isDark ? "text-teal-400" : "text-teal-600",
                hover: isDark ? "hover:border-teal-500/50" : "hover:border-teal-400",
                line: "bg-teal-500",
              },
              indigo: {
                container: isDark ? "border-indigo-500/20 bg-indigo-500/10" : "border-indigo-200 bg-indigo-50",
                icon: isDark ? "text-indigo-400" : "text-indigo-600",
                hover: isDark ? "hover:border-indigo-500/50" : "hover:border-indigo-400",
                line: "bg-indigo-500",
              },
              slate: {
                container: isDark ? "border-zinc-500/20 bg-zinc-500/10" : "border-zinc-300 bg-zinc-100",
                icon: isDark ? "text-zinc-300" : "text-zinc-700",
                hover: isDark ? "hover:border-zinc-500/50" : "hover:border-zinc-400",
                line: "bg-zinc-500",
              },
            }

            const accent = accentClasses[category.accent]

            return (
              <motion.div
                key={category.id}
                variants={itemVariants}
                className={`group relative flex min-h-48 flex-col items-center justify-center border p-8 text-center transition-all duration-300 cursor-pointer select-none shadow-none hover:shadow-xl hover:-translate-y-1 rounded-none ${accent.hover}
                  ${isDark 
                    ? "border-zinc-800 bg-zinc-950/80" 
                    : "border-zinc-200 bg-white"
                  }`}
              >
                {/* Icon Container (Sharp Geometry) */}
                <div className={`flex h-14 w-14 items-center justify-center border transition-all duration-300 rounded-none ${accent.container}`}>
                  <IconComponent size={22} strokeWidth={2} className={`transition-transform duration-300 group-hover:scale-110 ${accent.icon}`} />
                </div>
                
                {/* Category Name */}
                <h3 className={`mt-5 text-base font-bold tracking-tight transition-colors duration-200 ${isDark ? "text-zinc-100 group-hover:text-white" : "text-zinc-900"}`}>
                  {category.name}
                </h3>

                {/* Job Count */}
                <p className={`mt-2 text-[10px] font-black uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                  {category.count}
                </p>

                {/* Bottom Decorative Hover Line */}
                <div className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full ${accent.line}`} />
              </motion.div>
            )
          })}
        </motion.div>

        {/* =========================================
            BOTTOM CTA BUTTON
        ============================================= */}
        <div className="mt-16 text-center">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`inline-flex items-center gap-2 border px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-200 group rounded-none
              ${isDark 
                ? "border-purple-500 bg-purple-600 text-black hover:bg-purple-500" 
                : "border-purple-600 bg-purple-600 text-white hover:bg-purple-700 hover:border-purple-700"
              }`}
          >
            Browse All Categories
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
          </motion.button>
        </div>

      </div>
    </section>
  )
}