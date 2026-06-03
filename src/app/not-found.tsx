"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, HelpCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 py-24 text-center">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.08),transparent_50%)]" />

      <div className="max-w-md w-full rounded-3xl border border-zinc-200/80 bg-white p-8 text-center shadow-xl shadow-purple-500/5 transition-colors duration-300 dark:border-zinc-800/80 dark:bg-black">
        
        {/* Premium 404 Badge */}
        <div className="mx-auto inline-flex items-center justify-center rounded-2xl bg-purple-50 px-4 py-2 text-3xl font-black tracking-wider text-purple-600 shadow-sm dark:bg-purple-950/30 dark:text-purple-400">
          404
        </div>

        <h1 className="mt-6 text-2xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
          Page not found
        </h1>
        
        <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
          The page you are looking for doesn&apos;t exist or has been moved to a new URL.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <Button 
            asChild
            className="flex items-center justify-center gap-2 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all active:scale-95"
          >
            <Link href="/">
              <Home size={15} />
              Back to Home
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            asChild
            className="flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Link href="/contact">
              <HelpCircle size={15} />
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}