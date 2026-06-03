"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/provider/theme-provider"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = mounted && resolvedTheme === "dark"

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  
  if (!mounted) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-11 w-20 rounded-full border border-zinc-200 bg-zinc-100 opacity-50 cursor-not-allowed"
        disabled
      />
    )
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative h-11 w-20 overflow-hidden rounded-full border p-1 shadow-inner transition-all duration-300 select-none
        ${isDark 
          ? "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-purple-500/50" 
          : "border-zinc-200 bg-zinc-100 text-zinc-500 hover:border-purple-300"
        }`}
      aria-label="Toggle theme"
    >
      {/* স্লাইডিং ব্যাকগ্রাউন্ড সার্কেল (The Pill Slider) */}
      <span
        className={`absolute top-1 bottom-1 left-1 w-9 rounded-full shadow-md transition-transform duration-300 ease-in-out
          ${isDark ? "translate-x-9 bg-zinc-900 border border-zinc-800" : "translate-x-0 bg-white"}`}
      />

      {/* আইকন কন্টেইনার - যা আইকন দুটিকে দুই পাশে সমান দূরত্বে সুন্দরভাবে ধরে রাখবে */}
      <div className="relative z-10 flex h-full w-full items-center justify-between px-2.5">
        {/* Sun Icon */}
        <Sun 
          className={`h-4 w-4 transition-all duration-300 ease-in-out 
            ${isDark ? "scale-70 -rotate-45 opacity-30 text-zinc-600" : "scale-100 rotate-0 opacity-100 text-amber-500"}`} 
        />
        
        {/* Moon Icon */}
        <Moon 
          className={`h-4 w-4 transition-all duration-300 ease-in-out 
            ${isDark ? "scale-100 rotate-0 opacity-100 text-purple-400" : "scale-70 rotate-45 opacity-30 text-zinc-400"}`} 
        />
      </div>
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}