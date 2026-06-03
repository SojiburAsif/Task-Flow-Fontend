"use client";

import { useEffect, useState } from "react";
import { LogIn, LogOut, LayoutDashboard, UserPlus } from "lucide-react";
import Logo from "../logo/logo";
import { ModeToggle } from "../Theme/Toogle";
import { useTheme } from "@/components/provider/theme-provider";


const IS_USER_LOGGED_IN = true; 

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Analytics", href: "#analytics" },
  { label: "Activities", href: "#activities" },

];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  

  const [isLoggedIn, setIsLoggedIn] = useState(IS_USER_LOGGED_IN);

  
  const isDark = mounted && resolvedTheme === "dark";

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    alert("Logged out (Static state changed)!");
  };

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${
        isScrolled
          ? isDark
            ? "border-zinc-800/80 bg-black/80 shadow-lg shadow-black/40 py-3"
            : "border-purple-100 bg-white/80 shadow-md shadow-purple-500/5 py-3"
          : isDark
            ? "border-transparent bg-transparent py-5"
            : "border-transparent bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Logo />

        {/* Navigation Items */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`text-sm font-medium transition-colors duration-200 ${
                isDark 
                  ? "text-zinc-400 hover:text-purple-400" 
                  : "text-zinc-600 hover:text-purple-600"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Dynamic Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <ModeToggle />
          
          {isLoggedIn ? (
            <>
              {/* If User is Logged In */}
              <a
                href="/dashboard"
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  isDark 
                    ? "border-zinc-800 bg-zinc-900 text-purple-400 hover:bg-zinc-800 hover:border-purple-500/50" 
                    : "border-purple-100 bg-purple-50/50 text-purple-700 hover:bg-purple-100"
                }`}
              >
                <LayoutDashboard size={15} />
                <span className="hidden sm:inline">Dashboard</span>
              </a>
              
              <button
                onClick={handleLogout}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  isDark 
                    ? "border-zinc-800 bg-black text-zinc-300 hover:border-red-500/50 hover:text-red-400" 
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-red-200 hover:text-red-600"
                }`}
              >
                <LogOut size={15} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              {/* If User is Not Logged In */}
              <a
                href="/login"
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  isDark 
                    ? "border-zinc-800 bg-black text-zinc-300 hover:border-purple-500/50 hover:text-purple-400" 
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-purple-300 hover:text-purple-600"
                }`}
              >
                <LogIn size={15} /> Login
              </a>
              
              <a
                href="/register"
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-md transition-all duration-200 hover:-translate-y-0.5 ${
                  isDark 
                    ? "bg-purple-600 text-black shadow-purple-900/20 hover:bg-purple-500" 
                    : "bg-purple-600 text-white shadow-purple-600/10 hover:bg-purple-700"
                }`}
              >
                <UserPlus size={15} /> Get Started
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}