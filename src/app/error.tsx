"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, HelpCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      
      {/* Background Subtle Gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.03),transparent_50%)] dark:bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05),transparent_50%)]" />

      {/* Sharp Brutalist 404 Card */}
      <div className="w-full max-w-md border border-zinc-200 bg-white p-8 text-center shadow-none rounded-none transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-950">
        
        {/* Brutalist 404 Badge */}
        <div className="mx-auto inline-flex items-center justify-center border border-purple-200 bg-purple-50 px-5 py-3 text-4xl font-black tracking-[0.1em] text-purple-600 rounded-none dark:border-purple-900/50 dark:bg-purple-900/20 dark:text-purple-400">
          404
        </div>

        <h1 className="mt-6 text-2xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
          Page not found
        </h1>
        
        <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-400">
          The page you are looking for doesn&apos;t exist or has been moved to a new URL.
        </p>

        {/* Action Buttons (Sharp Layout) */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <Button 
            asChild
            className="flex items-center justify-center gap-2 rounded-none border border-purple-600 bg-purple-600 px-6 py-5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-purple-700 active:scale-95 shadow-none dark:border-purple-500 dark:bg-purple-500 dark:hover:bg-purple-600 w-full sm:w-auto"
          >
            <Link href="/">
              <Home size={14} strokeWidth={2.5} />
              Back to Home
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            asChild
            className="flex items-center justify-center gap-2 rounded-none border border-zinc-200 bg-zinc-50 px-6 py-5 text-xs font-bold uppercase tracking-wider text-zinc-600 transition-colors hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600 shadow-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-purple-500/50 dark:hover:bg-purple-900/20 dark:hover:text-purple-400 w-full sm:w-auto"
          >
            <Link href="/contact">
              <HelpCircle size={14} strokeWidth={2.5} />
              Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}