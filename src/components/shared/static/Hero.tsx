"use client";

import React from 'react';
import { ArrowRight, Search, TrendingUp, Zap, FileText, ShoppingBag, Users, DollarSign, Package, LucideIcon } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { useTheme } from '@/components/provider/theme-provider';

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
  const [mounted, setMounted] = React.useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = mounted && resolvedTheme === "dark";

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <section className={`relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-24 ${isDark ? "bg-black text-white" : "bg-[linear-gradient(180deg,#faf5ff_0%,#ffffff_42%,#f8fafc_100%)] text-zinc-950"}`}>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(147,51,234,0.12),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_70%)]" />
      
      <FloatingBackground />

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Sub Badge */}
        <motion.div variants={itemVariants} className={`mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide backdrop-blur-sm ${isDark ? "border-purple-900/40 bg-purple-950/40 text-purple-300" : "border-purple-200/60 bg-purple-50/70 text-purple-700"}`}>
          <Zap size={14} className="fill-purple-600/20" /> Automate Your Workflow
        </motion.div>

        {/* Main Heading */}
        <motion.h1 className="mb-6 text-5xl font-extrabold leading-[1.15] tracking-tight md:text-7xl" variants={itemVariants}>
          Simplify Billing and <br />
          <span className="relative inline-block px-5 py-1 mx-1">
            <span className="absolute inset-0 rounded-2xl bg-purple-600 transform -rotate-1 shadow-md shadow-purple-600/20" />
            <span className="relative text-white italic font-black">Track Profits</span>
          </span>
          {" "}Instantly
        </motion.h1>

        {/* Description */}
        <motion.p className={`mx-auto mb-10 max-w-2xl text-sm font-medium leading-relaxed md:text-base ${isDark ? "text-zinc-400" : "text-zinc-500"}`} variants={itemVariants}>
          No more manual math. The ultimate SaaS solution to manage your shop&apos;s <br className="hidden md:block" />
          invoices, staff reports, and net profit analytics in one secure dashboard.
        </motion.p>

        {/* Command Search Bar */}
        <motion.div className="mx-auto mb-16 max-w-2xl" variants={itemVariants}>
          <div className={`relative flex items-center rounded-2xl border p-2 shadow-xl backdrop-blur-sm transition-all focus-within:border-purple-500 ${isDark ? "border-black/60 bg-black/80 shadow-none" : "border-purple-200/70 bg-white/90 shadow-purple-200/30"}`}>
            <div className={`pl-3 ${isDark ? "text-purple-400" : "text-purple-600"}`}>
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search invoices, products, or reports..."
              className={`w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-zinc-400 ${isDark ? "text-white" : "text-zinc-900"}`}
            />
            <motion.button
              className="rounded-xl bg-purple-600 p-2.5 text-white shadow-lg shadow-purple-600/20 transition-all hover:bg-purple-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight size={16} />
            </motion.button>
          </div>
          
          <p className={`mt-3 text-xs font-medium ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            Shortcuts:{" "}
            <span className={`cursor-pointer hover:underline ${isDark ? "text-purple-400" : "text-purple-600"}`}>Daily Sales</span>,
            <span className={`ml-2 cursor-pointer hover:underline ${isDark ? "text-purple-400" : "text-purple-600"}`}>Stock Alerts</span>,
            <span className={`ml-2 cursor-pointer hover:underline ${isDark ? "text-purple-400" : "text-purple-600"}`}>Staff Logs</span>
          </p>
        </motion.div>

        {/* Stats Grid Component */}
        <div className="relative z-10 grid w-full grid-cols-1 items-center gap-8 border-t border-purple-200/50 pt-10 md:grid-cols-3 dark:border-zinc-800/60">
          <motion.div className="text-center md:text-left" variants={itemVariants}>
            <h3 className={`text-4xl font-black tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>12K+</h3>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-zinc-400">Active Shops</p>
          </motion.div>

          <motion.div className="flex flex-col sm:flex-row gap-3 justify-center" variants={itemVariants}>
            <button className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all">
              <Zap size={14} fill="white" /> Get Started
            </button>
            <button className={`rounded-xl border px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all ${isDark ? "border-black/60 bg-black text-zinc-300 hover:bg-zinc-900" : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"}`}>
              Watch Demo
            </button>
          </motion.div>

          <motion.div className="text-center md:text-right" variants={itemVariants}>
            <h3 className={`text-4xl font-black tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>$2M+</h3>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-zinc-400">Processed Monthly</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Infinity Marquee Bar */}
      <div className={`absolute bottom-0 z-10 w-full overflow-hidden border-t py-3.5 backdrop-blur-sm ${isDark ? "border-black/60 bg-black/80" : "border-purple-200/50 bg-purple-50/30"}`}>
        <div className="flex whitespace-nowrap animate-marquee-fixed gap-8">
          <span className={`text-[9px] font-bold uppercase tracking-[0.35em] ${isDark ? "text-purple-300/80" : "text-purple-700"}`}>
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