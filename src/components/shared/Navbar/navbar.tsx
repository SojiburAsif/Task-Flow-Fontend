"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LogIn, LogOut, LayoutDashboard, UserPlus, X, Key, Mail, Lock, LineChart, Star, Activity, Info, HomeIcon, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Logo from "../logo/logo";
import { ModeToggle } from "../Theme/Toogle";
import { useTheme } from "@/components/provider/theme-provider";
import { changePasswordAction, logoutAction, updateProfileAction, type AuthActionState } from "@/services/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { CurrentUser } from "@/lib/currentUser";
import { useActionState } from "react";
import { Role } from "@/app/constants/role";
import type { NotificationRecord } from "@/types/notification";
import { queueDashboardModalTarget } from "@/components/shared/DashboardModalLink";
import { getRoleDashboardHref } from "@/lib/dashboard-links";

const navItems = [
  {label: "Home", href: "/", icon: HomeIcon}, 
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Analytics", href: "/analytics", icon: LineChart },
  { label: "Features", href: "/features", icon: Star },
  { label: "Activities", href: "/activities", icon: Activity },
  { label: "About", href: "/about", icon: Info },
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

const formatNotificationTime = (value: string) => {
  const createdAt = new Date(value).getTime();
  const diffMinutes = Math.max(1, Math.floor((Date.now() - createdAt) / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const hours = Math.floor(diffMinutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  return `${Math.floor(hours / 24)}d ago`;
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
          <div className="absolute inset-x-0 top-0 h-1 bg-transparent" />

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
          <div className="absolute inset-x-0 top-0 h-1 bg-transparent" />

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
                  <div className={`flex h-20 w-20 items-center justify-center ${isDark ? 'bg-zinc-700 text-white' : 'bg-zinc-200 text-zinc-900'} text-xl font-bold shadow-md`}>
                    {user?.name?.charAt(0) ?? "U"}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input name="name" defaultValue={user?.name ?? ""} className="block w-full border py-2.5 px-3 text-sm outline-none focus:border-purple-500" placeholder="Full name" required />
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
              <button type="submit" disabled={profilePending} className={`w-full border px-4 py-2.5 text-sm font-bold transition hover:-translate-y-0.5 ${isDark ? 'border-purple-500 bg-purple-500 text-zinc-950 hover:bg-purple-400' : 'border-purple-600 bg-purple-600 text-white hover:bg-purple-700'}`}>
                {profilePending ? 'Updating...' : 'Update Profile'}
              </button>
              <button type="button" onClick={() => onOpenChange(false)} className={`inline-flex w-full items-center justify-center border px-4 py-2.5 text-sm font-bold transition hover:border-purple-300 ${isDark ? 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white' : 'border-zinc-300 bg-white text-zinc-700 hover:text-purple-600'}`}>
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

// 👈 EMPTY SHARP NOTIFICATION MODAL COMPONENT ADDED
type NotificationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDark: boolean;
};

function NotificationModal({ open, onOpenChange, isDark, user, notifications, loading, onRefresh }: NotificationModalProps & { user?: CurrentUser | null; notifications: NotificationRecord[]; loading: boolean; onRefresh: () => Promise<void> }) {
  const router = useRouter();

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readAll: true }),
      });
      await onRefresh();
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to update notifications");
    }
  };

  const handleOpenNotification = async (notification: NotificationRecord) => {
    try {
      if (!notification.isRead) {
        await fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: notification.id }),
        });
        await onRefresh();
      }
    } catch {
      toast.error("Failed to update notification state");
    } finally {
      onOpenChange(false);
      const modalTarget = notification.task?.id
        ? { type: "task" as const, id: notification.task.id }
        : notification.project?.id
          ? { type: "project" as const, id: notification.project.id }
          : null;

      if (modalTarget) {
        queueDashboardModalTarget(modalTarget);
        router.push(getRoleDashboardHref(user?.role, modalTarget.type));
      } else {
        router.push("/dashboard/notifications");
      }
    }
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-60 grid place-items-center overflow-y-auto px-4 py-6 sm:px-6">
      <button
        type="button"
        aria-label="Close notification modal"
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      <div className={`relative z-61 w-full max-w-lg overflow-hidden border shadow-2xl transition-all ${isDark ? "border-zinc-800 bg-zinc-950/95 text-zinc-100" : "border-purple-200 bg-white/95 text-zinc-950"}`}>
        <div className="relative p-6">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-purple-500" />
              <h3 className="text-sm font-black uppercase tracking-widest">Notifications</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleMarkAllRead}
                className={`inline-flex items-center gap-2 border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-colors ${isDark ? "border-purple-500/40 bg-purple-500/10 text-purple-300 hover:border-purple-400" : "border-purple-200 bg-purple-50 text-purple-700 hover:border-purple-300"}`}
              >
                <Bell size={12} /> Mark all read
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className={`inline-flex h-8 w-8 items-center justify-center border transition-colors ${isDark ? "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-purple-500" : "border-zinc-300 bg-white text-zinc-500 hover:border-purple-300"}`}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="mx-auto h-12 w-12 animate-pulse border border-dashed border-zinc-300 dark:border-zinc-700" />
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center border border-dashed border-zinc-300 dark:border-zinc-700 mx-auto text-zinc-400">
                <Bell size={20} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Your inbox is clean</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">No new workspace alerts or task notifications.</p>
              </div>
            </div>
          ) : (
            <div className="max-h-105 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
              {notifications.map((notification) => {
                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleOpenNotification(notification)}
                    className={`w-full border p-4 text-left transition hover:border-purple-300 hover:bg-purple-50/40 dark:hover:border-purple-500/40 dark:hover:bg-purple-500/5 ${notification.isRead ? "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950" : "border-purple-200 bg-purple-50/30 dark:border-purple-500/30 dark:bg-purple-500/5"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border ${notification.isRead ? "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300" : "border-purple-200 bg-purple-100 text-purple-700 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300"}`}>
                        <Bell size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-zinc-950 dark:text-white">{notification.title}</p>
                            <p className="mt-1 text-xs leading-5 text-zinc-600 dark:text-zinc-400 line-clamp-2">{notification.message}</p>
                          </div>
                          <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">
                            {formatNotificationTime(notification.createdAt)}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-wider">
                          <span className="border border-zinc-200 bg-zinc-50 px-2 py-1 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">{notification.type}</span>
                          {notification.project?.name ? <span className="border border-purple-200 bg-purple-50 px-2 py-1 text-purple-700 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300">{notification.project.name}</span> : null}
                          {notification.task?.title ? <span className="border border-blue-200 bg-blue-50 px-2 py-1 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">{notification.task.title}</span> : null}
                          {notification.isRead ? null : <span className="border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">Unread</span>}
                          <span className="border border-zinc-200 bg-white px-2 py-1 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">Open</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-200 pt-4 text-xs dark:border-zinc-800">
            <p className="text-zinc-500 dark:text-zinc-400">Open the dashboard inbox for the full feed.</p>
            <Link href="/dashboard/notifications" className="font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
              View all notifications
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function Navbar({ user }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [passwordSheetOpen, setPasswordSheetOpen] = useState(false);
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false); // 👈 Notification Modal State
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const previousUnreadCountRef = useRef<number | null>(null);
  const notificationsLoadedRef = useRef(false);

  const isDark = mounted && resolvedTheme === "dark";
  // Logout action state (hooks must be at top-level of component)
  const [logoutState, logoutFormAction, logoutPending] = useActionState<AuthActionState, FormData>(logoutAction, {
    success: false,
    message: "",
  });

  const router = useRouter();

  const loadNotifications = useCallback(async (options?: { notifyOnIncrease?: boolean }) => {
    setNotificationsLoading(true);

    try {
      const [listResponse, unreadResponse] = await Promise.all([
        fetch("/api/notifications?limit=10", { cache: "no-store" }),
        fetch("/api/notifications?limit=1000&read=unread", { cache: "no-store" }),
      ]);

      const [listPayload, unreadPayload] = await Promise.all([
        listResponse.json().catch(() => null) as Promise<{ success?: boolean; data?: NotificationRecord[] } | null>,
        unreadResponse.json().catch(() => null) as Promise<{ success?: boolean; data?: NotificationRecord[] } | null>,
      ]);

      const nextNotifications = listResponse.ok && listPayload?.success && Array.isArray(listPayload.data) ? listPayload.data : [];
      const nextUnreadCount = unreadResponse.ok && unreadPayload?.success && Array.isArray(unreadPayload.data) ? unreadPayload.data.length : 0;

      if (notificationsLoadedRef.current && previousUnreadCountRef.current !== null && nextUnreadCount > previousUnreadCountRef.current && options?.notifyOnIncrease !== false) {
        const delta = nextUnreadCount - previousUnreadCountRef.current;
        toast.info(`${delta} new notification${delta === 1 ? "" : "s"}. You have ${nextUnreadCount} unread.`);
      }

      setNotifications(nextNotifications);
      setUnreadCount(nextUnreadCount);
      previousUnreadCountRef.current = nextUnreadCount;
      notificationsLoadedRef.current = true;
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      const timer = window.setTimeout(() => {
        void loadNotifications({ notifyOnIncrease: false });
      }, 0);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [mounted, loadNotifications]);

  useEffect(() => {
    if (notificationOpen) {
      const timer = window.setTimeout(() => {
        void loadNotifications({ notifyOnIncrease: false });
      }, 0);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [notificationOpen, loadNotifications]);

  useEffect(() => {
    if (!mounted || !user) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      void loadNotifications();
    }, 30000);

    return () => window.clearInterval(interval);
  }, [mounted, user, loadNotifications]);

  useEffect(() => {
    if (logoutState?.success) {
      toast.success(logoutState.message || "Logged out");
      setTimeout(() => router.push("/login"), 0);
    }
  }, [logoutState?.success, logoutState?.message, router]);

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
          {(() => {
            const itemsToShow = user
              ? navItems
              : navItems.filter(i => ['Home', 'Features', 'About'].includes(i.label));

            return itemsToShow.map((item) => {
            const isActive = pathname && (pathname === item.href || pathname.startsWith(item.href + "/") || (item.href !== "/" && pathname.startsWith(item.href)));
            const baseClass = isDark ? "text-zinc-400 hover:text-purple-400" : "text-zinc-600 hover:text-purple-600";
            
            // 👈 Active Classes Applied Here
                const activeClass = isDark 
              ? "text-purple-400 font-bold bg-purple-500/10 px-3 py-1.5 border border-purple-500/20" 
              : "text-purple-700 font-bold bg-purple-50 px-3 py-1.5 border border-purple-200";

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`inline-flex items-center gap-2 text-sm font-medium transition-all duration-200 ${isActive ? activeClass : baseClass}`}
                >
                  {/* Dynamic Icons */}
                  <item.icon size={16} className={isActive ? "text-purple-500" : "opacity-70"} />
                  {item.label}
                </Link>
              );
            });
          })()}
        </nav>

        {/* Dynamic Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <ModeToggle />

          {/* 👈 SHARP NOTIFICATION TRIGGER BUTTON */}
          <button
            type="button"
            onClick={() => setNotificationOpen(true)}
            className={`relative flex h-9 w-9 items-center justify-center border transition-colors ${
              isDark 
                ? "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-purple-500 hover:text-purple-400" 
                : "border-zinc-200 bg-white text-zinc-600 hover:border-purple-300 hover:text-purple-600"
            }`}
          >
            <Bell size={16} />
            {unreadCount > 0 ? (
              <span className={`absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center border border-white px-1 text-[10px] font-black leading-none text-white ${isDark ? "bg-purple-500" : "bg-purple-600"}`}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            ) : null}
          </button>

          {user ? (
            <div className="hidden items-center gap-3 sm:flex">
              <div className="group relative">
                {/* Dropdown Trigger Button */}
                <button
                  type="button"
                  className={`flex max-w-44 items-center gap-2 border px-3 py-1.5 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${isDark
                    ? "border-zinc-800 bg-zinc-950 text-zinc-100 hover:border-purple-500/40 hover:bg-zinc-900"
                    : "border-zinc-200 bg-white text-zinc-900 hover:border-purple-200 hover:bg-purple-50/40"
                    }`}
                >
                  {user?.image ? (
                    <Image src={user.image} alt={user.name || "Avatar"} width={28} height={28} className="object-cover shadow-sm" />
                  ) : (
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center ${isDark ? 'bg-zinc-700 text-white' : 'bg-zinc-200 text-zinc-900'} text-[9px] font-bold uppercase shadow-sm`}>
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
                  className={`invisible absolute right-0 top-[calc(100%+0.5rem)] z-50 w-72 translate-y-2 border p-3 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 ${isDark
                    ? "border-zinc-800 bg-zinc-950 shadow-black/50"
                    : "border-zinc-200 bg-white shadow-gray-200/50"
                    }`}
                >
                  {/* User Email Card */}
                  <div
                    className={`border p-4 mb-3 ${isDark ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-100 bg-zinc-50"
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
                      className={`flex w-full items-center justify-start gap-3 border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${isDark
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
                      className={`flex w-full items-center justify-start gap-3 border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${isDark
                        ? "border-transparent bg-zinc-900 text-zinc-200 hover:border-purple-500/50 hover:text-purple-300 hover:bg-zinc-800"
                        : "border-transparent bg-zinc-50 text-zinc-700 hover:border-purple-200 hover:text-purple-600 hover:bg-purple-50"
                        }`}
                    >
                      <Key size={16} />
                      Change Password
                    </button>

                    {/* Logout form (uses logout hooks declared at component top) */}
                    <form action={logoutFormAction}>
                      <button
                        type="submit"
                        disabled={logoutPending}
                        className={`flex w-full items-center justify-start gap-3 border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${isDark
                          ? "border-transparent bg-zinc-900 text-red-400 hover:border-red-500/50 hover:bg-red-950/30"
                          : "border-transparent bg-red-50 text-red-600 hover:border-red-200 hover:bg-red-100"
                          }`}
                      >
                        <LogOut size={16} />
                        {logoutPending ? "Logging out..." : "Logout"}
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
                className={`inline-flex items-center gap-2 border px-4 py-2 text-sm font-semibold transition-all duration-200 ${isDark
                  ? "border-zinc-800 bg-black text-zinc-300 hover:border-purple-500/50 hover:text-purple-400"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-purple-300 hover:text-purple-600"
                  }`}
              >
                <LogIn size={15} /> Login
              </Link>

              <Link
                href="/register"
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold shadow-md transition-all duration-200 hover:-translate-y-0.5 ${isDark
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

      {/* 👈 Notification Modal Linked to State inside JSX */}
      <NotificationModal open={notificationOpen} onOpenChange={setNotificationOpen} isDark={isDark} user={user} notifications={notifications} loading={notificationsLoading} onRefresh={loadNotifications} />
    </header>
  );
}