"use client"

import * as React from "react"
import Link from "next/link"
import { Globe, Mail, MessageSquare, Zap, ArrowUpRight } from "lucide-react"
import { siteConfig } from "@/lib/site"
import { useTheme } from "@/components/provider/theme-provider"

const productLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pricing", label: "Pricing plans" },
  { href: "/about", label: "Features preview" },
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
    <footer className={`border-t transition-colors duration-300 ${isDark ? "border-zinc-900 bg-black text-zinc-400" : "border-zinc-200/60 bg-white text-zinc-600"}`}>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-16">
          
          {/* Brand & Description Column */}
          <div className="space-y-6 md:col-span-2">
            <Link href="/" className={`group flex items-center gap-2.5 text-xl font-black tracking-tight ${isDark ? "text-white" : "text-zinc-950"}`}>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/20 transition-transform group-hover:scale-105">
                <Zap size={16} fill="white" className="transition-transform group-hover:rotate-12" />
              </span>
              <span className={`bg-linear-to-r bg-clip-text ${isDark ? "from-white to-zinc-400" : "from-zinc-950 to-zinc-700"}`}>
                {siteConfig.shortName}
              </span>
            </Link>
            
            <p className={`max-w-sm text-sm font-medium leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              {siteConfig.description}
            </p>
            
            {/* Social Icons Link with Better UI */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 ${isDark ? "border-zinc-800 text-zinc-400 hover:border-purple-500/30 hover:bg-purple-950/30 hover:text-purple-400" : "border-zinc-200 text-zinc-500"}`}
                aria-label="GitHub"
              >
                <span className="text-[10px] font-black tracking-[0.2em]">GH</span>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer" 
                className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 ${isDark ? "border-zinc-800 text-zinc-400 hover:border-purple-500/30 hover:bg-purple-950/30 hover:text-purple-400" : "border-zinc-200 text-zinc-500"}`}
                aria-label="X (Twitter)"
              >
                <span className="text-[10px] font-black tracking-[0.2em]">X</span>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 ${isDark ? "border-zinc-800 text-zinc-400 hover:border-purple-500/30 hover:bg-purple-950/30 hover:text-purple-400" : "border-zinc-200 text-zinc-500"}`}
                aria-label="LinkedIn"
              >
                <span className="text-[10px] font-black tracking-[0.2em]">in</span>
              </a>
            </div>
          </div>

          {/* Product Links Column */}
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-[0.15em] ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
              Product Platform
            </h3>
            <ul className="mt-5 space-y-3.5 text-sm font-medium">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className={`group flex items-center gap-1 transition-colors hover:text-purple-600 ${isDark ? "text-zinc-400 hover:text-purple-400" : "text-zinc-500"}`}
                  >
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 -translate-y-0.5 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support Column */}
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-[0.15em] ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
              Contact & Links
            </h3>
            <div className={`mt-5 space-y-3.5 text-sm font-medium ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              <a className={`flex items-center gap-2.5 transition-colors hover:text-purple-600 ${isDark ? "hover:text-purple-400" : ""}`} href={`mailto:${siteConfig.supportEmail}`}>
                <Mail size={14} className={isDark ? "text-zinc-500" : "text-zinc-400"} />
                {siteConfig.supportEmail}
              </a>
              <a className={`flex items-center gap-2.5 transition-colors hover:text-purple-600 ${isDark ? "hover:text-purple-400" : ""}`} href="https://github.com" target="_blank" rel="noreferrer">
                <Globe size={14} className={isDark ? "text-zinc-500" : "text-zinc-400"} />
                Global Status
              </a>
              <a className={`flex items-center gap-2.5 transition-colors hover:text-purple-600 ${isDark ? "hover:text-purple-400" : ""}`} href="/contact">
                <MessageSquare size={14} className={isDark ? "text-zinc-500" : "text-zinc-400"} />
                Support Center
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Section */}
        <div className={`mt-16 border-t pt-8 ${isDark ? "border-zinc-900/60" : "border-zinc-100"}`}>
          <div className={`flex flex-col gap-4 text-xs font-medium sm:flex-row sm:items-center sm:justify-between ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            <p>&copy; {new Date().getFullYear()} {siteConfig.copyright}</p>
            <div className="flex gap-x-5 gap-y-2 flex-wrap">
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