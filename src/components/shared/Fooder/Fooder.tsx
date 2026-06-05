"use client"

import * as React from "react"
import Link from "next/link"
import { Globe, Mail, MessageSquare, Zap, ArrowUpRight } from "lucide-react"
import { siteConfig } from "@/lib/site"
import { useTheme } from "@/components/provider/theme-provider"

const productLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pricing", label: "Pricing Plans" },
  { href: "/about", label: "Features Preview" },
]

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/contact", label: "Contact Support" },
]

export default function Footer() {
  const [mounted, setMounted] = React.useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = mounted && resolvedTheme === "dark"

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  return (
    <footer className={`border-t-4 transition-colors duration-300 ${isDark ? "border-t-purple-500 border-zinc-900 bg-black text-zinc-400" : "border-t-purple-600 border-zinc-200 bg-zinc-50 text-zinc-600"}`}>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-16">
          
          {/* =========================================
              BRAND & DESCRIPTION COLUMN
          ============================================= */}
          <div className="space-y-6 md:col-span-2">
            <Link href="/" className={`group flex items-center gap-3 text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-zinc-950"}`}>
              {/* Sharp Logo Box */}
              <span className="flex h-10 w-10 items-center justify-center border border-purple-700 bg-purple-600 text-white rounded-none shadow-none transition-transform group-hover:-translate-y-1">
                <Zap size={18} fill="white" className="transition-transform group-hover:rotate-12" />
              </span>
              <span className="uppercase tracking-widest">
                {siteConfig.shortName}
              </span>
            </Link>
            
            <p className={`max-w-sm text-sm font-medium leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              {siteConfig.description} Built for modern engineering teams and enterprise retail networks.
            </p>
            
            {/* Sharp Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                className={`flex h-10 w-10 items-center justify-center border transition-all rounded-none ${isDark ? "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-purple-500 hover:bg-purple-600 hover:text-white" : "border-zinc-300 bg-white text-zinc-600 hover:border-purple-600 hover:bg-purple-600 hover:text-white"}`}
                aria-label="GitHub"
              >
                <span className="text-[10px] font-black tracking-[0.2em]">GH</span>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer" 
                className={`flex h-10 w-10 items-center justify-center border transition-all rounded-none ${isDark ? "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-purple-500 hover:bg-purple-600 hover:text-white" : "border-zinc-300 bg-white text-zinc-600 hover:border-purple-600 hover:bg-purple-600 hover:text-white"}`}
                aria-label="X (Twitter)"
              >
                <span className="text-[10px] font-black tracking-[0.2em]">X</span>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className={`flex h-10 w-10 items-center justify-center border transition-all rounded-none ${isDark ? "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-purple-500 hover:bg-purple-600 hover:text-white" : "border-zinc-300 bg-white text-zinc-600 hover:border-purple-600 hover:bg-purple-600 hover:text-white"}`}
                aria-label="LinkedIn"
              >
                <span className="text-[10px] font-black tracking-[0.2em]">IN</span>
              </a>
            </div>
          </div>

          {/* =========================================
              PRODUCT LINKS COLUMN
          ============================================= */}
          <div>
            <h3 className={`text-[10px] font-black uppercase tracking-[0.25em] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
              Platform
            </h3>
            <ul className="mt-6 space-y-4 text-sm font-bold">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className={`group flex items-center gap-1.5 transition-colors hover:text-purple-600 ${isDark ? "text-zinc-300 hover:text-purple-400" : "text-zinc-700"}`}
                  >
                    <ArrowUpRight size={14} className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-purple-500" />
                    <span className="transition-transform group-hover:translate-x-1">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* =========================================
              CONTACT & SUPPORT COLUMN
          ============================================= */}
          <div>
            <h3 className={`text-[10px] font-black uppercase tracking-[0.25em] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
              Connect
            </h3>
            <div className={`mt-6 space-y-4 text-sm font-bold ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
              <a className={`group flex items-center gap-3 transition-colors hover:text-purple-600 ${isDark ? "hover:text-purple-400" : ""}`} href={`mailto:${siteConfig.supportEmail}`}>
                <div className={`flex h-8 w-8 items-center justify-center border rounded-none transition-colors group-hover:border-purple-500 group-hover:text-purple-500 ${isDark ? "bg-zinc-900 border-zinc-800 text-zinc-400" : "bg-white border-zinc-200 text-zinc-500"}`}>
                  <Mail size={12} strokeWidth={2.5} />
                </div>
                Support Email
              </a>
              <a className={`group flex items-center gap-3 transition-colors hover:text-purple-600 ${isDark ? "hover:text-purple-400" : ""}`} href="https://github.com" target="_blank" rel="noreferrer">
                <div className={`flex h-8 w-8 items-center justify-center border rounded-none transition-colors group-hover:border-purple-500 group-hover:text-purple-500 ${isDark ? "bg-zinc-900 border-zinc-800 text-zinc-400" : "bg-white border-zinc-200 text-zinc-500"}`}>
                  <Globe size={12} strokeWidth={2.5} />
                </div>
                Global Status
              </a>
              <a className={`group flex items-center gap-3 transition-colors hover:text-purple-600 ${isDark ? "hover:text-purple-400" : ""}`} href="/contact">
                <div className={`flex h-8 w-8 items-center justify-center border rounded-none transition-colors group-hover:border-purple-500 group-hover:text-purple-500 ${isDark ? "bg-zinc-900 border-zinc-800 text-zinc-400" : "bg-white border-zinc-200 text-zinc-500"}`}>
                  <MessageSquare size={12} strokeWidth={2.5} />
                </div>
                Help Center
              </a>
            </div>
          </div>

        </div>

        {/* =========================================
            BOTTOM COPYRIGHT SECTION (Sharp Borders)
        ============================================= */}
        <div className={`mt-16 border-t pt-8 ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
          <div className={`flex flex-col gap-4 text-xs font-bold uppercase tracking-wider sm:flex-row sm:items-center sm:justify-between ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            <p>&copy; {new Date().getFullYear()} {siteConfig.copyright}</p>
            <div className="flex gap-x-6 gap-y-2 flex-wrap">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors hover:text-purple-600 ${isDark ? "hover:text-purple-400" : ""}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}