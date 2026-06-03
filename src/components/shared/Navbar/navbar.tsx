"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LogIn, LogOut, LayoutDashboard, UserPlus, X, Key, Mail, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../logo/logo";
import { ModeToggle } from "../Theme/Toogle";
import { useTheme } from "@/components/provider/theme-provider";
import { changePasswordAction, logoutAction, updateProfileAction, type AuthActionState } from "@/services/auth.service";
import { toast } from "sonner";
import type { CurrentUser } from "@/lib/currentUser";
import { useActionState } from "react";
import { Role } from "@/app/constants/role";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Analytics", href: "#analytics" },
  { label: "Activities", href: "#activities" },

];

type NavbarProps = {
  user?: CurrentUser | null;
};

const formatRoleLabel = (role?: string | null) => {
  switch (role) {
    case Role.ADMIN:
      return "Admin";
    case Role.ProjectManager:
      return "Project Manager";
    case Role.TeamMember:
      return "Team Member";
    default:
      return "User";
  }
};

type PasswordChangeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDark: boolean;
};

function PasswordChangeModal({ open, onOpenChange, isDark }: PasswordChangeModalProps) {
  const [passwordState, passwordFormAction, passwordPending] = useActionState<AuthActionState, FormData>(changePasswordAction, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (passwordState.success) {
      const frame = window.requestAnimationFrame(() => onOpenChange(false));
      return () => window.cancelAnimationFrame(frame);
    }

    return undefined;
  }, [passwordState.success, onOpenChange]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-60 grid place-items-center overflow-y-auto px-4 py-6 sm:px-6">
      <button
        type="button"
        aria-label="Close password modal"
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      <div className={`relative z-61 w-full max-w-lg overflow-hidden border backdrop-blur-xl ${isDark ? "border-zinc-800 bg-zinc-950/95 text-zinc-100 shadow-2xl shadow-black/50" : "border-purple-100 bg-white/95 text-zinc-950 shadow-[0_24px_80px_rgba(91,33,182,0.16)]"}`}>
        <div className="relative px-6 py-5 sm:px-8 sm:py-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-purple-500 via-fuchsia-500 to-cyan-400" />

          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className={`inline-flex items-center border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] ${isDark ? "border-zinc-800 bg-zinc-900 text-purple-200" : "border-purple-100 bg-purple-50 text-purple-700"}`}>
                Secure update
              </div>
              <Logo />
              <div className="space-y-1.5 pt-1">
                <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                  Change password
                </p>
                <h2 className={`text-2xl font-black tracking-tight sm:text-[2rem] ${isDark ? "text-zinc-50" : "text-zinc-950"}`}>
                  Update credentials
                </h2>
                <p className={`text-sm leading-6 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                  Same clean form style as login, centered in the screen.
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close"
              onClick={() => onOpenChange(false)}
              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center border transition-colors ${isDark ? "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-purple-500/60 hover:text-white" : "border-zinc-300 bg-white text-zinc-500 hover:border-purple-300 hover:text-zinc-900"}`}
            >
              <X size={16} />
            </button>
          </div>

          <form action={passwordFormAction} className="mt-5 space-y-3">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-4.5 w-4.5 text-zinc-400" />
              </div>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                className={`block w-full border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-purple-500/20 ${isDark ? "border-zinc-700 bg-zinc-900 text-zinc-100 focus:border-purple-500 dark:placeholder:text-zinc-500" : "border-zinc-300 bg-white text-zinc-950 focus:border-purple-500"}`}
                placeholder="Current password"
                required
              />
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-4.5 w-4.5 text-zinc-400" />
              </div>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                className={`block w-full border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-purple-500/20 ${isDark ? "border-zinc-700 bg-zinc-900 text-zinc-100 focus:border-purple-500 dark:placeholder:text-zinc-500" : "border-zinc-300 bg-white text-zinc-950 focus:border-purple-500"}`}
                placeholder="New password"
                required
              />
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-4.5 w-4.5 text-zinc-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className={`block w-full border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-purple-500/20 ${isDark ? "border-zinc-700 bg-zinc-900 text-zinc-100 focus:border-purple-500 dark:placeholder:text-zinc-500" : "border-zinc-300 bg-white text-zinc-950 focus:border-purple-500"}`}
                placeholder="Confirm new password"
                required
              />
            </div>

            <div className="flex items-center justify-between gap-3 text-[11px] sm:text-sm">
              <label className={`flex cursor-pointer items-center gap-2 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                <input
                  type="checkbox"
                  name="revokeOtherSessions"
                  className="size-4 border-zinc-300 text-purple-600 focus:ring-purple-500 dark:border-zinc-700"
                />
                Revoke other sessions
              </label>
            </div>

            {passwordState.message ? (
              <p className={`text-sm ${passwordState.success ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {passwordState.message}
              </p>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="submit"
                disabled={passwordPending}
                className={`w-full border px-4 py-2.5 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 focus:ring-2 focus:ring-purple-500/30 disabled:cursor-not-allowed disabled:opacity-70 ${isDark ? "border-purple-500 bg-purple-500 text-zinc-950 hover:bg-purple-400" : "border-purple-600 bg-purple-600 text-white hover:bg-purple-700"}`}
              >
                {passwordPending ? "Updating..." : "Update password"}
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className={`inline-flex w-full items-center justify-center border px-4 py-2.5 text-sm font-bold transition-all duration-200 hover:border-purple-300 disabled:cursor-not-allowed disabled:opacity-70 ${isDark ? "border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-purple-400 dark:hover:border-purple-500/60" : "border-zinc-300 bg-white text-zinc-700 hover:text-purple-600"}`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function ProfileModal({ open, onOpenChange, isDark, user }: PasswordChangeModalProps & { user?: CurrentUser | null }) {
  const [profileState, profileFormAction, profilePending] = useActionState<AuthActionState, FormData>(updateProfileAction, {
    success: false,
    message: "",
  });
  const [preview, setPreview] = useState<string | null>(user?.image ?? null);
  useEffect(() => {
    // reset preview when modal opens or user changes — defer setState
    const id = window.requestAnimationFrame(() => setPreview(user?.image ?? null));
    return () => window.cancelAnimationFrame(id);
  }, [open, user?.image]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (profileState.success) {
      toast.success(profileState.message || "Profile updated");
      const frame = window.requestAnimationFrame(() => onOpenChange(false));
      return () => window.cancelAnimationFrame(frame);
    }

    if (profileState.message && !profileState.success) {
      toast.error(profileState.message);
    }

    return undefined;
  }, [profileState.success, profileState.message, onOpenChange]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-60 grid place-items-center overflow-y-auto px-4 py-6 sm:px-6">
      <button type="button" aria-label="Close profile modal" className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} />

      <div className={`relative z-61 w-full max-w-lg overflow-hidden border backdrop-blur-xl ${isDark ? "border-zinc-800 bg-zinc-950/95 text-zinc-100 shadow-2xl shadow-black/50" : "border-purple-100 bg-white/95 text-zinc-950 shadow-[0_24px_80px_rgba(91,33,182,0.16)]"}`}>
        <div className="relative px-6 py-5 sm:px-8 sm:py-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-purple-500 via-fuchsia-500 to-cyan-400" />

          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className={`inline-flex items-center border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] ${isDark ? "border-zinc-800 bg-zinc-900 text-purple-200" : "border-purple-100 bg-purple-50 text-purple-700"}`}>
                Update profile
              </div>
              <Logo />
              <div className="space-y-1.5 pt-1">
                <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                  Profile
                </p>
                <h2 className={`text-2xl font-black tracking-tight sm:text-[2rem] ${isDark ? "text-zinc-50" : "text-zinc-950"}`}>
                  Update your information
                </h2>
                <p className={`text-sm leading-6 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                  Change display name or avatar.
                </p>
                <div className={`inline-flex items-center border px-3 py-1 text-[11px] font-semibold ${isDark ? "border-purple-500/30 bg-purple-500/10 text-purple-300" : "border-purple-200 bg-purple-50 text-purple-700"}`}>
                  {formatRoleLabel(user?.role)}
                </div>
              </div>
            </div>

            <button type="button" aria-label="Close" onClick={() => onOpenChange(false)} className={`inline-flex h-9 w-9 shrink-0 items-center justify-center border transition-colors ${isDark ? "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-purple-500/60 hover:text-white" : "border-zinc-300 bg-white text-zinc-500 hover:border-purple-300 hover:text-zinc-900"}`}>
              <X size={16} />
            </button>
          </div>

          <form action={profileFormAction} className="mt-5 space-y-3">
            <div className="flex items-center gap-4">
                  <div className="shrink-0">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt={user?.name ?? "Avatar"} className="h-20 w-20 object-cover shadow-md" />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center bg-linear-to-br from-purple-500 to-fuchsia-500 text-white text-xl font-bold shadow-md">
                    {user?.name?.charAt(0) ?? "U"}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input name="name" defaultValue={user?.name ?? ""} className="block w-full border py-2.5 px-3 text-sm" placeholder="Full name" required />
                <p className="mt-2 text-sm text-zinc-400">Change display name or avatar.</p>
              </div>
            </div>

            <div>
              <input
                name="avatar"
                type="file"
                accept="image/*"
                className="block w-full text-sm"
                onChange={(e) => {
                  const file = e.currentTarget.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setPreview((prev) => {
                      // revoke previous object URL if one was created
                      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
                      return url;
                    });
                  } else {
                    setPreview((prev) => {
                      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
                      return user?.image ?? null;
                    });
                  }
                }}
              />
            </div>

            {profileState.message ? (
              <p className={`text-sm ${profileState.success ? 'text-emerald-600' : 'text-rose-600'}`}>{profileState.message}</p>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <button type="submit" disabled={profilePending} className={`w-full border px-4 py-2.5 text-sm font-bold ${isDark ? 'border-purple-500 bg-purple-500 text-zinc-950' : 'border-purple-600 bg-purple-600 text-white'}`}>
                {profilePending ? 'Updating...' : 'Update Profile'}
              </button>
              <button type="button" onClick={() => onOpenChange(false)} className={`inline-flex w-full items-center justify-center border px-4 py-2.5 text-sm font-bold ${isDark ? 'border-zinc-700 bg-zinc-900 text-zinc-300' : 'border-zinc-300 bg-white text-zinc-700'}`}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function Navbar({ user }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [passwordSheetOpen, setPasswordSheetOpen] = useState(false);
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const { resolvedTheme } = useTheme();


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

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${isScrolled
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
            item.label === "Dashboard" ? (
              user ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${isDark
                      ? "text-zinc-400 hover:text-purple-400"
                      : "text-zinc-600 hover:text-purple-600"
                    }`}
                >
                  <LayoutDashboard size={15} />
                  {item.label}
                </Link>
              ) : null
            ) : (
              <a
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${isDark
                    ? "text-zinc-400 hover:text-purple-400"
                    : "text-zinc-600 hover:text-purple-600"
                  }`}
              >
                {item.label}
              </a>
            )
          ))}
        </nav>

        {/* Dynamic Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <ModeToggle />

          {user ? (
            <div className="hidden items-center gap-3 sm:flex">
              <div className="group relative">
                {/* Dropdown Trigger Button */}
                <button
                  type="button"
                  className={`flex max-w-44 items-center gap-2 rounded-full border px-3 py-1.5 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${isDark
                      ? "border-zinc-800 bg-zinc-950 text-zinc-100 hover:border-purple-500/40 hover:bg-zinc-900"
                      : "border-zinc-200 bg-white text-zinc-900 hover:border-purple-200 hover:bg-purple-50/40"
                    }`}
                >
                  {user?.image ? (
                    <Image src={user.image} alt={user.name || "Avatar"} width={28} height={28} className="rounded-full object-cover shadow-sm" />
                  ) : (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-fuchsia-500 text-[9px] font-bold uppercase text-white shadow-sm">
                      {user?.name?.charAt(0) || "U"}
                    </span>
                  )}

                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-xs font-semibold leading-tight">
                      {user?.name || "User"}
                    </span>
                    <span className={`truncate text-[10px] font-medium uppercase tracking-[0.24em] ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                      {formatRoleLabel(user?.role)}
                    </span>
                  </span>
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`invisible absolute right-0 top-[calc(100%+0.5rem)] z-50 w-72 translate-y-2 rounded-2xl border p-3 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 ${isDark
                      ? "border-zinc-800 bg-zinc-950 shadow-black/50"
                      : "border-zinc-200 bg-white shadow-gray-200/50"
                    }`}
                >
                  {/* User Email Card */}
                  <div
                    className={`rounded-xl border p-4 mb-3 ${isDark ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-100 bg-zinc-50"
                      }`}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-2">
                      Account Email
                    </p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-purple-500 shrink-0" />
                      <span
                        className={`truncate text-xs font-medium ${isDark ? "text-zinc-300" : "text-zinc-700"
                          }`}
                      >
                        {user?.email}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setProfileSheetOpen(true)}
                      className={`flex w-full items-center justify-start gap-3 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${isDark
                          ? "border-transparent bg-zinc-900 text-zinc-200 hover:border-purple-500/50 hover:text-purple-300 hover:bg-zinc-800"
                          : "border-transparent bg-zinc-50 text-zinc-700 hover:border-purple-200 hover:text-purple-600 hover:bg-purple-50"
                        }`}
                    >
                      <UserPlus size={16} />
                      Update Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => setPasswordSheetOpen(true)}
                      className={`flex w-full items-center justify-start gap-3 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${isDark
                          ? "border-transparent bg-zinc-900 text-zinc-200 hover:border-purple-500/50 hover:text-purple-300 hover:bg-zinc-800"
                          : "border-transparent bg-zinc-50 text-zinc-700 hover:border-purple-200 hover:text-purple-600 hover:bg-purple-50"
                        }`}
                    >
                      <Key size={16} />
                      Change Password
                    </button>

                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className={`flex w-full items-center justify-start gap-3 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${isDark
                            ? "border-transparent bg-zinc-900 text-red-400 hover:border-red-500/50 hover:bg-red-950/30"
                            : "border-transparent bg-red-50 text-red-600 hover:border-red-200 hover:bg-red-100"
                          }`}
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              <PasswordChangeModal open={passwordSheetOpen} onOpenChange={setPasswordSheetOpen} isDark={isDark} />
              <ProfileModal open={profileSheetOpen} onOpenChange={setProfileSheetOpen} isDark={isDark} user={user} />
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 ${isDark
                    ? "border-zinc-800 bg-black text-zinc-300 hover:border-purple-500/50 hover:text-purple-400"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-purple-300 hover:text-purple-600"
                  }`}
              >
                <LogIn size={15} /> Login
              </Link>

              <Link
                href="/register"
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-md transition-all duration-200 hover:-translate-y-0.5 ${isDark
                    ? "bg-purple-600 text-black shadow-purple-900/20 hover:bg-purple-500"
                    : "bg-purple-600 text-white shadow-purple-600/10 hover:bg-purple-700"
                  }`}
              >
                <UserPlus size={15} /> Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}