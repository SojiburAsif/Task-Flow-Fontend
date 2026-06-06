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
        className="h-9 w-16 rounded-none border border-zinc-200 bg-zinc-100 opacity-50 cursor-not-allowed"
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
      className={`relative h-9 w-16 overflow-hidden rounded-none border p-0.5 shadow-inner transition-all duration-300 select-none
        ${isDark 
          ? "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-purple-500/50" 
          : "border-zinc-200 bg-zinc-100 text-zinc-500 hover:border-purple-300"
        }`}
      aria-label="Toggle theme"
    >
  
      <span
        className={`absolute top-0.5 bottom-0.5 left-0.5 w-7 rounded-none shadow-md transition-transform duration-300 ease-in-out
          ${isDark ? "translate-x-7 bg-zinc-900 border border-zinc-800" : "translate-x-0 bg-white"}`}
      />

     
      <div className="relative z-10 flex h-full w-full items-center justify-between px-2">
        {/* Sun Icon */}
        <Sun 
          className={`h-3.5 w-3.5 transition-all duration-300 ease-in-out 
            ${isDark ? "scale-70 -rotate-45 opacity-30 text-zinc-600" : "scale-100 rotate-0 opacity-100 text-amber-500"}`} 
        />
        
        {/* Moon Icon */}
        <Moon 
          className={`h-3.5 w-3.5 transition-all duration-300 ease-in-out 
            ${isDark ? "scale-100 rotate-0 opacity-100 text-purple-400" : "scale-70 rotate-45 opacity-30 text-zinc-400"}`} 
        />
      </div>
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}