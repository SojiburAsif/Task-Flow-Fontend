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

// Framer Motion অ্যানিমেশন ভ্যারিয়েন্টস
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
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
}

export default function Category() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = mounted && resolvedTheme === "dark"

  // ফিক্সড useEffect: সিঙ্ক্রোনাসলি setState কল না করে অ্যাসিনক্রোনাস ফ্রেমে পুশ করা হয়েছে
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  return (
    <section className={`relative w-full overflow-hidden py-24 transition-colors duration-300 ${isDark ? "bg-black text-white" : "bg-white text-zinc-950"}`}>
      <div className={`pointer-events-none absolute inset-0 -z-10 ${isDark ? "bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.08),transparent_45%)]" : "bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.05),transparent_40%)]"}`} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className={`mb-4 inline-flex items-center gap-2 border px-4 py-1.5 text-xs font-semibold tracking-wide backdrop-blur-sm ${
            isDark 
              ? "border-purple-900/30 bg-black text-purple-300" 
              : "border-purple-200/50 bg-white text-purple-700"
          }`}>
            <Grid size={13} className={isDark ? "text-zinc-400" : "text-purple-500"} /> Popular Categories
          </div>
          
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Browse Top <span className={isDark ? "text-purple-400" : "text-purple-600"}>Categories</span>
          </h2>
        </div>

        {/* Categories Grid Layout with Motion */}
        <motion.div 
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {categories.map((category) => {
            const IconComponent = category.icon;
            const accentClasses: Record<string, { container: string; icon: string; hover: string }> = {
              sky: {
                container: isDark ? "border-sky-500/20 bg-sky-500/10" : "border-sky-100 bg-sky-50",
                icon: isDark ? "text-sky-300" : "text-sky-600",
                hover: "group-hover:border-sky-400 group-hover:bg-sky-500 group-hover:text-white",
              },
              blue: {
                container: isDark ? "border-blue-500/20 bg-blue-500/10" : "border-blue-100 bg-blue-50",
                icon: isDark ? "text-blue-300" : "text-blue-600",
                hover: "group-hover:border-blue-400 group-hover:bg-blue-500 group-hover:text-white",
              },
              amber: {
                container: isDark ? "border-amber-500/20 bg-amber-500/10" : "border-amber-100 bg-amber-50",
                icon: isDark ? "text-amber-300" : "text-amber-600",
                hover: "group-hover:border-amber-400 group-hover:bg-amber-500 group-hover:text-white",
              },
              orange: {
                container: isDark ? "border-orange-500/20 bg-orange-500/10" : "border-orange-100 bg-orange-50",
                icon: isDark ? "text-orange-300" : "text-orange-600",
                hover: "group-hover:border-orange-400 group-hover:bg-orange-500 group-hover:text-white",
              },
              green: {
                container: isDark ? "border-emerald-500/20 bg-emerald-500/10" : "border-emerald-100 bg-emerald-50",
                icon: isDark ? "text-emerald-300" : "text-emerald-600",
                hover: "group-hover:border-emerald-400 group-hover:bg-emerald-500 group-hover:text-white",
              },
              rose: {
                container: isDark ? "border-rose-500/20 bg-rose-500/10" : "border-rose-100 bg-rose-50",
                icon: isDark ? "text-rose-300" : "text-rose-600",
                hover: "group-hover:border-rose-400 group-hover:bg-rose-500 group-hover:text-white",
              },
              emerald: {
                container: isDark ? "border-emerald-500/20 bg-emerald-500/10" : "border-emerald-100 bg-emerald-50",
                icon: isDark ? "text-emerald-300" : "text-emerald-600",
                hover: "group-hover:border-emerald-400 group-hover:bg-emerald-500 group-hover:text-white",
              },
              violet: {
                container: isDark ? "border-violet-500/20 bg-violet-500/10" : "border-violet-100 bg-violet-50",
                icon: isDark ? "text-violet-300" : "text-violet-600",
                hover: "group-hover:border-violet-400 group-hover:bg-violet-500 group-hover:text-white",
              },
              pink: {
                container: isDark ? "border-pink-500/20 bg-pink-500/10" : "border-pink-100 bg-pink-50",
                icon: isDark ? "text-pink-300" : "text-pink-600",
                hover: "group-hover:border-pink-400 group-hover:bg-pink-500 group-hover:text-white",
              },
              teal: {
                container: isDark ? "border-teal-500/20 bg-teal-500/10" : "border-teal-100 bg-teal-50",
                icon: isDark ? "text-teal-300" : "text-teal-600",
                hover: "group-hover:border-teal-400 group-hover:bg-teal-500 group-hover:text-white",
              },
              indigo: {
                container: isDark ? "border-indigo-500/20 bg-indigo-500/10" : "border-indigo-100 bg-indigo-50",
                icon: isDark ? "text-indigo-300" : "text-indigo-600",
                hover: "group-hover:border-indigo-400 group-hover:bg-indigo-500 group-hover:text-white",
              },
              slate: {
                container: isDark ? "border-slate-500/20 bg-slate-500/10" : "border-slate-100 bg-slate-50",
                icon: isDark ? "text-slate-300" : "text-slate-600",
                hover: "group-hover:border-slate-400 group-hover:bg-slate-500 group-hover:text-white",
              },
            }

            const accent = accentClasses[category.accent]

            return (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`group flex min-h-55 flex-col items-center justify-center border p-8 text-center transition-all duration-300 cursor-pointer select-none
                  ${isDark 
                    ? "border-zinc-900/70 bg-zinc-950/60 hover:shadow-2xl hover:shadow-black/20" 
                    : "border-zinc-200 bg-white hover:shadow-2xl hover:shadow-zinc-200/60"
                  }`}
              >
                {/* Icon Container */}
                <div className={`flex h-14 w-14 items-center justify-center border transition-all duration-300 ${accent.container} ${accent.hover}`}
                >
                  <IconComponent size={20} strokeWidth={1.8} className={`transition-transform duration-300 group-hover:scale-105 ${accent.icon}`} />
                </div>
                

                {/* Category Name */}
                <h3 className={`mt-5 text-lg font-bold tracking-tight transition-colors duration-200 ${isDark ? "text-zinc-200 group-hover:text-white" : "text-zinc-900 group-hover:text-zinc-950"}`}>
                  {category.name}
                </h3>

                {/* Job Count */}
                <p className={`mt-2 text-sm font-semibold tracking-wide ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                  {category.count}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA Button */}
        <div className="mt-16 text-center">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`inline-flex items-center gap-2 border px-7 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 group
              ${isDark 
                ? "border-purple-500/30 bg-purple-600 text-black hover:bg-purple-500" 
                : "border-zinc-900 bg-zinc-950 text-white hover:bg-zinc-900"
              }`}
          >
            Browse All Categories
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
          </motion.button>
        </div>

      </div>
    </section>
  )
}