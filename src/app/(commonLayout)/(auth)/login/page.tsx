"use client";

/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import Logo from '@/components/shared/logo/logo';
import { useTheme } from '@/components/provider/theme-provider';
import { demoLoginAction, loginAction } from '@/services/auth.service';

const initialAuthState = {
  success: false,
  message: '',
};


export default function LoginPage() {
  const [mounted, setMounted] = React.useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = mounted && resolvedTheme === 'dark';
  const [state, formAction, isPending] = React.useActionState(loginAction, initialAuthState);
  const [, demoFormAction, isDemoPending] = React.useActionState(demoLoginAction, initialAuthState);

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={`relative min-h-screen overflow-hidden px-4 pb-6 pt-24 transition-colors duration-300 sm:pt-28 ${isDark ? 'bg-black text-zinc-100' : 'bg-zinc-50 text-zinc-950'}`}>
      <div className={`pointer-events-none absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.16),transparent_42%)]' : 'bg-[radial-gradient(circle_at_top,rgba(147,51,234,0.11),transparent_42%)]'}`} />
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-64 ${isDark ? 'bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_72%)]' : 'bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.12),transparent_72%)]'}`} />

      <div className={`relative mx-auto grid w-full max-w-4xl overflow-hidden border backdrop-blur-xl transition-colors duration-300 lg:grid-cols-[0.92fr_1.08fr] ${isDark ? 'border-zinc-800 bg-zinc-950/85 shadow-black/30' : 'border-purple-100 bg-white/85 shadow-[0_24px_80px_rgba(91,33,182,0.10)]'}`}>
        <aside className="relative flex flex-col justify-between border-b border-zinc-200 bg-zinc-950 px-5 py-7 text-white dark:border-zinc-800 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.30),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_34%)] opacity-95" />
          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-purple-200 backdrop-blur-sm">
              Login Portal
            </div>
            <Logo />
            <div className="max-w-sm space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-purple-300">
                Smart Task System
              </p>
              <h1 className="text-2xl font-black leading-tight sm:text-3xl">
                Welcome back.
              </h1>
              <p className="text-xs leading-6 text-zinc-300 sm:text-sm">
                Sign in to continue managing tasks, teams, and projects.
              </p>
            </div>
          </div>
        </aside>

        <section className={`flex items-center justify-center px-5 py-8 sm:px-8 ${isDark ? 'bg-zinc-950/40' : 'bg-white/40'}`}>
          <div className="w-full max-w-sm space-y-5">
            <div className="space-y-2">
              <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                Sign in
              </p>
              <h2 className={`text-2xl font-black tracking-tight sm:text-[2rem] ${isDark ? 'text-zinc-50' : 'text-zinc-950'}`}>
                Access your account
              </h2>
              <p className={`text-sm leading-6 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Use your email and password to continue.
              </p>
            </div>

            <form action={formAction} className="space-y-3">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4.5 w-4.5 text-zinc-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  className={`block w-full border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-purple-500/20 ${isDark ? 'border-zinc-700 bg-zinc-900 text-zinc-100 focus:border-purple-500 dark:placeholder:text-zinc-500' : 'border-zinc-300 bg-white text-zinc-950 focus:border-purple-500'}`}
                  placeholder="Email Address"
                  required
                />
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4.5 w-4.5 text-zinc-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  className={`block w-full border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-purple-500/20 ${isDark ? 'border-zinc-700 bg-zinc-900 text-zinc-100 focus:border-purple-500 dark:placeholder:text-zinc-500' : 'border-zinc-300 bg-white text-zinc-950 focus:border-purple-500'}`}
                  placeholder="Password"
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-3 text-[11px] sm:text-sm">
                <label className={`flex cursor-pointer items-center gap-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  <input name="rememberMe" type="checkbox" className="size-4 border-zinc-300 text-purple-600 focus:ring-purple-500 dark:border-zinc-700" />
                  Remember me
                </label>
                <a href="#" className={`font-medium transition-colors ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'}`}>
                  Forgot password?
                </a>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className={`w-full border px-4 py-2.5 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 focus:ring-2 focus:ring-purple-500/30 disabled:cursor-not-allowed disabled:opacity-70 ${isDark ? 'border-purple-500 bg-purple-500 text-zinc-950 hover:bg-purple-400' : 'border-purple-600 bg-purple-600 text-white hover:bg-purple-700'}`}
                >
                  {isPending ? 'Signing in...' : 'Sign In'}
                </button>
                <button
                  type="submit"
                  formAction={demoFormAction}
                  disabled={isDemoPending}
                  className={`inline-flex w-full items-center justify-center border px-4 py-2.5 text-sm font-bold transition-all duration-200 hover:border-purple-300 disabled:cursor-not-allowed disabled:opacity-70 ${isDark ? 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-purple-400 dark:hover:border-purple-500/60' : 'border-zinc-300 bg-white text-zinc-700 hover:text-purple-600'}`}
                >
                  {isDemoPending ? 'Loading demo...' : 'Demo Login'}
                </button>
              </div>

              {state.message ? (
                <p className={`text-sm ${state.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {state.message}
                </p>
              ) : null}
            </form>

            <p className={`text-center text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Don't have an account?{' '}
              <Link href="/register" className={`font-semibold transition-colors ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'}`}>
                Create one
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}