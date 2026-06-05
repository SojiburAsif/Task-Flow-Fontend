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
    transition: { staggerChildren: 0.1 },
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

export default function About() {
  const [mounted, setMounted] = useState(false)

  // লিন্টার এবং হাইড্রেশন সেফ Asynchronous মাউন্ট স্টেট
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [])

  // হাইড্রেশন এরর এড়াতে মাউন্ট হওয়ার আগে কিছুই রেন্ডার না করা ভালো
  if (!mounted) return null;

  // ডাইনামিক ডার্ক মোড চেক (Tailwind class context-এর জন্য)
  const isDarkClass = "dark:bg-black dark:text-white";

  return (
    <section className={`relative w-full py-24 overflow-hidden transition-colors duration-300 bg-zinc-50 text-zinc-950 ${isDarkClass}`}>
      
      {/* Background Geometric Grid Effects (Matching Openings Page) */}
      <div className="absolute inset-0 z-0 bg-transparent dark:bg-transparent" />
      <div className="absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ================= Part 1: Platform Vision & Intro ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-28">
          
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 border border-purple-500/30 bg-purple-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-purple-700 rounded-none dark:border-purple-500/40 dark:bg-purple-500/10 dark:text-purple-400">
              <Award size={13} className="text-purple-600 dark:text-purple-400" /> Who We Are
            </div>
            
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl leading-[1.15]">
              Driving the Future of <br />
              <span className="text-purple-600 dark:text-purple-400">Task Management</span>
            </h2>
            
            <p className="text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-400">
              TaskFlow is engineered to remove workspace friction. We provide modern engineering teams and retail networks with automated scheduling, smart analytics, and seamless administrative power to track progress effortlessly.
            </p>
          </div>

          {/* Right Side Vision Cards (Sharp Design) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {highlights.map((card, i) => {
              const IconComp = card.icon;
              return (
                <div 
                  key={i}
                  className="group relative flex flex-col justify-between p-6 border text-left transition-all duration-300 bg-white border-zinc-200 hover:-translate-y-1 hover:shadow-xl hover:border-purple-400 rounded-none dark:bg-zinc-950 dark:border-zinc-800 dark:hover:border-purple-500/50"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center border border-purple-200 bg-purple-50 text-purple-600 transition-transform duration-300 group-hover:scale-110 rounded-none dark:border-purple-900/50 dark:bg-purple-900/20 dark:text-purple-400">
                      <IconComp size={20} strokeWidth={2} />
                    </div>
                    <h3 className="mt-5 text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{card.title}</h3>
                    <p className="mt-2 text-xs font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">{card.desc}</p>
                  </div>
                  {/* Hover Line Effect */}
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-purple-600 transition-all duration-500 group-hover:w-full dark:bg-purple-500" />
                </div>
              )
            })}
          </div>
        </div>

        {/* ================= Part 2: Admin / Team Showcase Panel ================= */}
        <div className="text-center mb-16">
          <span className="inline-flex border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-500 rounded-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            Executive Council
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl text-zinc-900 dark:text-white">
            Meet Our <span className="text-purple-600 dark:text-purple-400">Administrators</span>
          </h2>
        </div>

        {/* Animated Admins Card Grid (Sharp & Brutalist) */}
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
              className="group relative flex flex-col border p-6 text-left transition-all duration-300 bg-white border-zinc-200 hover:shadow-xl hover:-translate-y-1 hover:border-purple-400 rounded-none dark:bg-zinc-950 dark:border-zinc-800 dark:hover:border-purple-500/50"
            >
              {/* Profile Wrapper */}
              <div className="flex items-center gap-4 mb-5">
                {/* Sharp Geometric Avatar Container */}
                <div className={`h-16 w-16 bg-gradient-to-tr ${admin.imageBg} flex items-center justify-center text-white text-xl font-black shadow-none shrink-0 uppercase tracking-wider rounded-none border border-zinc-200 dark:border-zinc-800`}>
                  {admin.name.split(" ").map(n => n[0]).join("")}
                </div>
                
                <div className="overflow-hidden">
                  <h3 className="text-lg font-bold tracking-tight truncate text-zinc-900 transition-colors group-hover:text-purple-600 dark:text-zinc-100 dark:group-hover:text-purple-400">
                    {admin.name}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-wider text-purple-600 mt-1 dark:text-purple-400">
                    {admin.role}
                  </p>
                </div>
              </div>

              {/* Bio Description */}
              <p className="text-sm font-medium leading-relaxed mb-6 grow text-zinc-600 dark:text-zinc-400">
                {admin.bio}
              </p>

              {/* Action/Social Icons Row (Sharp Design) */}
              <div className="flex items-center justify-between border-t pt-5 w-full border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <a 
                    href={admin.github} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex h-10 w-10 items-center justify-center border border-zinc-200 bg-zinc-50 text-zinc-500 transition-all hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600 rounded-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-purple-500/50 dark:hover:bg-purple-900/20 dark:hover:text-purple-400"
                    aria-label="GitHub"
                  >
                    <span className="text-[10px] font-black tracking-[0.1em]">GH</span>
                  </a>
                  <a 
                    href={admin.linkedin} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex h-10 w-10 items-center justify-center border border-zinc-200 bg-zinc-50 text-zinc-500 transition-all hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600 rounded-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-purple-500/50 dark:hover:bg-purple-900/20 dark:hover:text-purple-400"
                    aria-label="LinkedIn"
                  >
                    <span className="text-[10px] font-black tracking-[0.1em]">IN</span>
                  </a>
                  <a 
                    href={admin.twitter} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex h-10 w-10 items-center justify-center border border-zinc-200 bg-zinc-50 text-zinc-500 transition-all hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600 rounded-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-purple-500/50 dark:hover:bg-purple-900/20 dark:hover:text-purple-400"
                    aria-label="Twitter / X"
                  >
                    <span className="text-[10px] font-black tracking-[0.1em]">X</span>
                  </a>
                  <a 
                    href={admin.mail} 
                    className="flex h-10 w-10 items-center justify-center border border-zinc-200 bg-zinc-50 text-zinc-500 transition-all hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600 rounded-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-purple-500/50 dark:hover:bg-purple-900/20 dark:hover:text-purple-400"
                    aria-label="Email"
                  >
                    <Mail size={14} strokeWidth={2.5} />
                  </a>
                </div>

                {/* Profile Arrow Glimpse */}
                <span className="opacity-0 translate-y-1 text-purple-600 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0.5 dark:text-purple-400">
                  <ArrowUpRight size={18} strokeWidth={2.5} />
                </span>
              </div>

              {/* Bottom Decorative Hover Line */}
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-purple-600 transition-all duration-500 group-hover:w-full dark:bg-purple-500" />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}