"use client"

import React, { useEffect, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { 
  Mail, 
  ShieldCheck, 
  Zap, 
  Users, 
  Award,
  ArrowUpRight
} from 'lucide-react'

// অ্যাডমিন / কোর টিম মেম্বারদের ডেটা অবজেক্ট
const admins = [
  {
    id: 1,
    name: "Md Asif",
    role: "Lead Full-Stack Engineer",
    bio: "Specialized in MERN Stack, Next.js, and Cloud Architecture. Designing scalable system workflows.",
    imageBg: "from-purple-600 to-indigo-600",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    mail: "mailto:asif@example.com"
  },
  {
    id: 2,
    name: "Faria Tabassum",
    role: "Lead UI/UX Architect",
    bio: "Crafting premium, user-centric interfaces and interactive user experiences for modern SaaS.",
    imageBg: "from-pink-500 to-rose-600",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    mail: "mailto:faria@example.com"
  },
  {
    id: 3,
    name: "Atiquzzaman",
    role: "DevOps & Security Analyst",
    bio: "Managing continuous deployment, system optimization, and database security infrastructures.",
    imageBg: "from-blue-600 to-cyan-500",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    mail: "mailto:atiq@example.com"
  }
]

// সিস্টেমের কোর ফিচার / মিশন হাইলাইটস
const highlights = [
  { icon: ShieldCheck, title: "Secure Infrastructure", desc: "Enterprise-grade safety for your team tasks." },
  { icon: Zap, title: "Real-time Execution", desc: "Zero delay synchronization across platforms." },
  { icon: Users, title: "Seamless Collaboration", desc: "Empowering thousands of active workspaces." },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants: Variants = {
  hidden: { y: 25, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 16 },
  },
}

export default function About() {
  const [mounted, setMounted] = useState(false)

  // লিন্টার এবং হাইড্রেশন সেফ Asynchronous মাউন্ট স্টেট
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [])

  // হাইড্রেশন এরর এড়াতে মাউন্ট হওয়ার আগে কিছুই রেন্ডার না করা ভালো, অথবা স্কেলিটন দেখানো যেতে পারে
  if (!mounted) return null;

  return (
    <section className="w-full py-24 relative overflow-hidden transition-colors duration-300 bg-gradient-to-b from-white via-purple-50/30 to-white text-zinc-950 dark:from-black dark:via-zinc-950/50 dark:to-black dark:text-white">
      
      {/* Background Radial Glow Effects */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] bg-[radial-gradient(circle_at_top,rgba(147,51,234,0.06),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[500px] bg-[radial-gradient(circle_at_bottom,rgba(168,85,247,0.04),transparent_60%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ================= Part 1: Platform Vision & Intro ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-28">
          
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide backdrop-blur-sm border-purple-200/40 bg-purple-50/60 text-purple-700 dark:border-purple-900/30 dark:bg-purple-950/30 dark:text-purple-300">
              <Award size={13} className="text-purple-600 dark:text-purple-400" /> Who We Are
            </div>
            
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl leading-[1.15]">
              Driving the Future of <br />
              <span className="text-purple-600 dark:text-purple-400">Task Management</span>
            </h2>
            
            <p className="text-sm font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
              TaskFlow is engineered to remove workspace friction. We provide modern engineering teams and retail networks with automated scheduling, smart analytics, and seamless administrative power to track progress effortlessly.
            </p>
          </div>

          {/* Right Side Vision Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {highlights.map((card, i) => {
              const IconComp = card.icon;
              return (
                <div 
                  key={i}
                  className="group p-6 rounded-2xl border text-left transition-all duration-300 bg-white border-purple-100/50 hover:shadow-xl hover:shadow-purple-500/5 hover:border-purple-200 dark:bg-zinc-950/40 dark:border-zinc-800/60 dark:hover:border-purple-500/30 dark:hover:bg-zinc-950"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-transform duration-300 group-hover:scale-110 dark:bg-purple-950/50 dark:text-purple-400">
                    <IconComp size={18} />
                  </div>
                  <h3 className="mt-4 text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{card.title}</h3>
                  <p className="mt-1.5 text-xs font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">{card.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* ================= Part 2: Admin / Team Showcase Panel ================= */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">
            Executive Council
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-4xl text-zinc-900 dark:text-white">
            Meet Our <span className="text-purple-600 dark:text-purple-400">Administrators</span>
          </h2>
        </div>

        {/* Animated Admins Card Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
        >
          {admins.map((admin) => (
            <motion.div
              key={admin.id}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group flex flex-col rounded-2xl border p-5 text-left transition-all duration-300 relative overflow-hidden bg-white border-purple-100/40 hover:shadow-2xl hover:shadow-purple-500/5 hover:border-purple-300/50 dark:bg-zinc-950/40 dark:border-zinc-800/60 dark:hover:border-purple-500/30 dark:hover:bg-zinc-950"
            >
              {/* Profile Wrapper with Modern Abstract Avatar Display */}
              <div className="flex items-center gap-4 mb-5">
                {/* Gradient Rounded Avatar Container */}
                <div className={`h-14 w-14 rounded-xl bg-gradient-to-tr ${admin.imageBg} flex items-center justify-center text-white text-lg font-black shadow-md shrink-0 uppercase tracking-wider`}>
                  {admin.name.split(" ").map(n => n[0]).join("")}
                </div>
                
                <div className="overflow-hidden">
                  <h3 className="text-base font-bold tracking-tight truncate text-zinc-900 dark:text-zinc-100">
                    {admin.name}
                  </h3>
                  <p className="text-xs font-semibold text-purple-600 mt-0.5 tracking-wide dark:text-purple-400">
                    {admin.role}
                  </p>
                </div>
              </div>

              {/* Bio Description */}
              <p className="text-xs font-medium leading-relaxed mb-6 grow text-zinc-500 dark:text-zinc-400">
                {admin.bio}
              </p>

              {/* Action/Social Icons Row */}
              <div className="flex items-center justify-between border-t pt-4 w-full border-zinc-100 dark:border-zinc-800/60">
                <div className="flex items-center gap-2.5">
                  <a 
                    href={admin.github} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-purple-500/40 dark:hover:bg-purple-950/30 dark:hover:text-purple-400"
                    aria-label="GitHub"
                  >
                    <span className="text-[10px] font-black tracking-[0.1em]">GH</span>
                  </a>
                  <a 
                    href={admin.linkedin} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-purple-500/40 dark:hover:bg-purple-950/30 dark:hover:text-purple-400"
                    aria-label="LinkedIn"
                  >
                    <span className="text-[10px] font-black tracking-[0.1em]">IN</span>
                  </a>
                  <a 
                    href={admin.twitter} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-purple-500/40 dark:hover:bg-purple-950/30 dark:hover:text-purple-400"
                    aria-label="Twitter / X"
                  >
                    <span className="text-[10px] font-black tracking-[0.1em]">X</span>
                  </a>
                  <a 
                    href={admin.mail} 
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-purple-500/40 dark:hover:bg-purple-950/30 dark:hover:text-purple-400"
                    aria-label="Email"
                  >
                    <Mail size={13} strokeWidth={2.5} />
                  </a>
                </div>

                {/* Profile Arrow Glimpse */}
                <span className="opacity-0 translate-y-1 text-purple-600 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0.5 dark:text-purple-400">
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}