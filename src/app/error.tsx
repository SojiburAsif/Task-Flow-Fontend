"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // আপনি চাইলে এখানে console.error(error) করে রাখতে পারেন tracking এর জন্য
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-24 text-center">
      {/* Background Gradient Effect */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.06),transparent_50%)]" />

      <div className="max-w-md w-full rounded-3xl border border-zinc-200/80 bg-white p-8 text-center shadow-xl shadow-purple-500/5 transition-colors duration-300 dark:border-zinc-800/80 dark:bg-black">
        {/* Animated Error Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
          <AlertTriangle size={28} className="animate-pulse" />
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">
          Unexpected Error
        </p>
        
        <h1 className="mt-3 text-2xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
          Something went wrong
        </h1>
        
        <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
          An unexpected error occurred. Please try again. If the problem persists, feel free to contact support.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <Button 
            onClick={reset}
            className="flex items-center justify-center gap-2 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all active:scale-95"
          >
            <RefreshCw size={15} />
            Try again
          </Button>
          
          <Button 
            variant="outline" 
            asChild
            className="flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Link href="/dashboard">
              <ArrowLeft size={15} />
              Go to dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}