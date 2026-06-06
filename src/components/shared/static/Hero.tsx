"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Search, TrendingUp, Zap, FileText, ShoppingBag, Users, DollarSign, Package, FolderGit2, CheckSquare, X, LucideIcon } from 'lucide-react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/provider/theme-provider';
import type { SearchResultItem } from '@/types/search';
import DashboardModalLink from '@/components/shared/DashboardModalLink';

interface FloatingIconProps {
  icon: LucideIcon;
  x: string;
  y: string;
  size: number;
  color: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.1, staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 16 },
  },
};

const FloatingBackground: React.FC = () => {
  const icons: FloatingIconProps[] = [
    { icon: FileText, x: "8%", y: "15%", size: 36, color: "text-purple-600/20 dark:text-purple-400/10" },
    { icon: ShoppingBag, x: "88%", y: "12%", size: 40, color: "text-indigo-600/20 dark:text-indigo-400/10" },
    { icon: Users, x: "12%", y: "72%", size: 44, color: "text-purple-500/20 dark:text-purple-500/10" },
    { icon: DollarSign, x: "82%", y: "78%", size: 38, color: "text-fuchsia-600/20 dark:text-fuchsia-400/10" },
    { icon: Package, x: "50%", y: "35%", size: 32, color: "text-violet-600/20 dark:text-violet-400/10" },
    { icon: TrendingUp, x: "6%", y: "48%", size: 42, color: "text-indigo-500/20 dark:text-indigo-500/10" },
    { icon: Zap, x: "92%", y: "52%", size: 34, color: "text-purple-600/20 dark:text-purple-400/10" },
  ];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {icons.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <motion.div
            key={index}
            className={`absolute ${item.color}`}
            style={{ left: item.x, top: item.y }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: [0, 15, 0], rotate: [0, 10, -10, 0] }}
            transition={{
              y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 },
              rotate: { duration: 10, repeat: Infinity, ease: "linear" },
              opacity: { duration: 0.5 }
            }}
          >
            <IconComponent size={item.size} strokeWidth={1.5} />
          </motion.div>
        );
      })}
    </div>
  );
};

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  
  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const isDark = mounted && resolvedTheme === "dark";

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  // Handle click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();

    if (query.length < 2) {
      const frame = window.requestAnimationFrame(() => {
        setIsLoading(false);
        setSearchResults([]);
        setIsSearching(false);
      });
      return () => window.cancelAnimationFrame(frame);
    }
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error("Search failed");
        }

        const payload = await response.json() as { success?: boolean; data?: SearchResultItem[] };
        setSearchResults(payload.success && Array.isArray(payload.data) ? payload.data : []);
      } catch {
        if (!controller.signal.aborted) {
          setSearchResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length >= 2) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setSearchResults([]);
  };

  return (
    <section className={`relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-24 ${isDark ? "bg-black text-white" : "bg-zinc-50 text-zinc-950"}`}>
      
      {/* Background Gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(147,51,234,0.12),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(147,51,234,0.15),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[linear-gradient(to_bottom,rgba(168,85,247,0.1)_0%,transparent_100%)]" />
      
      <FloatingBackground />

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 w-full text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Sub Badge (Sharp Brutalist) */}
        <motion.div variants={itemVariants} className={`mb-8 inline-flex items-center gap-2 border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] rounded-none ${isDark ? "border-purple-500/30 bg-purple-500/10 text-purple-400" : "border-purple-200 bg-purple-50 text-purple-700"}`}>
          <Zap size={13} className="text-purple-500" /> Automate Your Workflow
        </motion.div>

        {/* Main Heading with Looping Highlight */}
        <motion.h1 className="mb-6 text-4xl font-black leading-[1.15] tracking-tight sm:text-6xl md:text-7xl" variants={itemVariants}>
          Simplify Billing and <br className="hidden sm:block" />
          <motion.span 
            className={`relative inline-block px-4 py-1 mx-2 mt-2 sm:mt-0 bg-purple-600 text-white rounded-none border border-purple-700 ${isDark ? 'shadow-[4px_4px_0px_0px_rgba(168,85,247,0.5)]' : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]'}`}
            animate={{ 
              rotate: [-2, 2, -2],
              y: [0, -3, 0],
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          >
            Track Profits
          </motion.span>
          {" "}Instantly
        </motion.h1>

        {/* Description */}
        <motion.p className={`mx-auto mb-12 max-w-2xl text-sm font-medium leading-relaxed sm:text-base ${isDark ? "text-zinc-400" : "text-zinc-500"}`} variants={itemVariants}>
          No more manual math. The ultimate SaaS solution to manage your workspace&#39;s <br className="hidden md:block" />
          projects, staff tasks, and profit analytics in one secure dashboard.
        </motion.p>

        {/* =========================================
            COMMAND SEARCH BAR & DROPDOWN (Sharp)
        ============================================= */}
        <motion.div className="mx-auto mb-16 max-w-2xl relative z-50" variants={itemVariants} ref={searchRef}>
          <div className={`relative flex items-center border-2 transition-all p-1.5 ${isDark ? "border-zinc-800 bg-zinc-950 focus-within:border-purple-500" : "border-zinc-200 bg-white focus-within:border-purple-500 shadow-sm"}`}>
            <div className={`pl-4 ${isDark ? "text-purple-400" : "text-purple-600"}`}>
              <Search size={20} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => searchQuery.trim().length > 0 && setIsSearching(true)}
              placeholder="Search projects, tasks, or reports..."
              className={`w-full bg-transparent px-4 py-3.5 text-sm font-bold outline-none placeholder:text-zinc-400 placeholder:font-medium ${isDark ? "text-white" : "text-zinc-900"}`}
            />
            {searchQuery && (
              <button type="button" onClick={clearSearch} className="mr-2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                <X size={16} />
              </button>
            )}
            <motion.button
              type="button"
              className="bg-purple-600 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-purple-700 rounded-none border border-purple-700 shrink-0 hidden sm:flex items-center gap-2"
              whileTap={{ scale: 0.98 }}
            >
              Search <ArrowRight size={14} />
            </motion.button>
          </div>

          {/* SEARCH RESULTS DROPDOWN (Brutalist Panel) */}
          <AnimatePresence>
            {isSearching && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`absolute top-full left-0 right-0 mt-2 border text-left rounded-none shadow-2xl overflow-hidden ${isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"}`}
              >
                <div className={`border-b px-4 py-2 text-[10px] font-black uppercase tracking-widest ${isDark ? "border-zinc-800 bg-zinc-900/50 text-zinc-500" : "border-zinc-200 bg-zinc-50 text-zinc-400"}`}>
                  Search Results
                </div>
                
                <div className="max-h-75 overflow-y-auto custom-scrollbar">
                  {searchResults.length > 0 ? (
                    searchResults.map((item) => (
                      <DashboardModalLink 
                        key={item.id} 
                        href={item.link}
                          target={item.target ?? "_self"}
                          rel={item.target === "_blank" ? "noreferrer noopener" : undefined}
                          modalTarget={item.type === "project" || item.type === "task" ? { type: item.type, id: item.id } : null}
                          onClick={clearSearch}
                        className={`flex items-center justify-between border-b last:border-b-0 p-4 transition-colors ${isDark ? "border-zinc-800 hover:bg-zinc-900" : "border-zinc-100 hover:bg-zinc-50"}`}
                        >
                        <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center border rounded-none ${item.type === "project" ? "border-purple-200 bg-purple-50 text-purple-600 dark:border-purple-900/50 dark:bg-purple-900/20 dark:text-purple-400" : item.type === "task" ? "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400" : "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"}`}>
                              {item.type === "project" ? <FolderGit2 size={16} /> : item.type === "task" ? <CheckSquare size={16} /> : <Search size={16} />}
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>{item.title}</p>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mt-0.5">{item.subtitle || item.type}</p>
                          </div>
                        </div>
                          <span className={`border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-none ${item.type === "site" ? "bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800" : item.status === "Active" || item.status === "Completed" ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400" : "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400"}`}>
                            {item.status || item.type}
                        </span>
                      </DashboardModalLink>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                        <p className={`text-sm font-bold ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>{isLoading ? "Searching..." : `No results found for "${searchQuery}"`}</p>
                        <p className="text-xs text-zinc-500 mt-1">Try searching for &quot;Project&quot;, &quot;Task&quot;, or &quot;Dashboard&quot;</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Shortcuts */}
          <p className={`mt-4 text-xs font-bold uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            Shortcuts:{" "}
            <span className={`cursor-pointer transition-colors ${isDark ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-700"}`}>Daily Sales</span> •
            <span className={`ml-2 cursor-pointer transition-colors ${isDark ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-700"}`}>Active Projects</span> •
            <span className={`ml-2 cursor-pointer transition-colors ${isDark ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-700"}`}>Staff Logs</span>
          </p>
        </motion.div>

        {/* =========================================
            STATS GRID (Brutalist)
        ============================================= */}
        <div className="relative z-10 grid w-full grid-cols-1 items-center gap-6 border-t pt-12 md:grid-cols-3 dark:border-zinc-800 border-zinc-200">
          <motion.div className="text-center md:text-left p-4 border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 rounded-none shadow-none" variants={itemVariants}>
            <h3 className={`text-4xl font-black tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>12K+</h3>
            <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">Active Workspaces</p>
          </motion.div>

          <motion.div className="flex flex-col gap-3 justify-center" variants={itemVariants}>
            <button className="flex items-center justify-center gap-2 border border-purple-600 bg-purple-600 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-purple-700 rounded-none shadow-none active:scale-95">
              <Zap size={14} fill="white" /> Get Started Now
            </button>
            <button className={`border px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all rounded-none shadow-none active:scale-95 ${isDark ? "border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white" : "border-zinc-300 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 hover:border-zinc-400"}`}>
              Watch Demo
            </button>
          </motion.div>

          <motion.div className="text-center md:text-right p-4 border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 rounded-none shadow-none" variants={itemVariants}>
            <h3 className={`text-4xl font-black tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>$2M+</h3>
            <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">Processed Monthly</p>
          </motion.div>
        </div>
      </motion.div>

      {/* =========================================
          INFINITY MARQUEE BAR (Sharp Design)
      ============================================= */}
      <div className={`absolute bottom-0 z-10 w-full overflow-hidden border-t py-3.5 backdrop-blur-md ${isDark ? "border-zinc-800 bg-black/80" : "border-purple-200 bg-purple-50/80"}`}>
        <div className="flex whitespace-nowrap animate-marquee-fixed gap-8">
          <span className={`text-[10px] font-black uppercase tracking-[0.35em] ${isDark ? "text-purple-400" : "text-purple-700"}`}>
            • NO CREDIT CARD REQUIRED • SECURE CLOUD STORAGE • REAL-TIME ANALYTICS • MULTI-USER ACCESS • CUSTOMER SUPPORT 24/7 • NO CREDIT CARD REQUIRED • SECURE CLOUD STORAGE • REAL-TIME ANALYTICS • MULTI-USER ACCESS
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes marqueeFixed {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee-fixed {
          display: flex;
          width: 300%;
          animation: marqueeFixed 30s linear infinite;
        }
      `}</style>
    </section>
  );
}