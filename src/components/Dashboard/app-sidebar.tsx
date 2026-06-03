/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Loader2, LogOut, ShieldCheck, LayoutDashboard } from "lucide-react"
import { toast } from "sonner"

import { AdminRouters } from "@/router/AdminRouter"
import { TeamMemberRouters } from "@/router/TeamMemberRouter"
import { ProjectManagerRouters } from "@/router/ProjectManagerRoute"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import Logo from "../shared/logo/logo"

// রোল অনুযায়ী রাউট ম্যাপ (স্ট্রিং কেস ফ্লেক্সিবিলিটি সহ)
const roleBasedRoutes: Record<string, any> = {
  ADMIN: AdminRouters,
  Admin: AdminRouters,
  TEAM_MEMBER: TeamMemberRouters,
  TeamMember: TeamMemberRouters,
  PROJECT_MANAGER: ProjectManagerRouters,
  ProjectManager: ProjectManagerRouters,
}

export function AppSidebar({
  user,
  ...props
}: {
  user: { name: string; role: string; email: string }
} & React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  
  const currentRoutes = roleBasedRoutes[user.role] || TeamMemberRouters

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    const loadingToast = toast.loading("Logging out of workspace...")

    try {
      const response = await fetch("/api/auth/logout", { method: "POST" })
      if (!response.ok) throw new Error("Logout failed")

      toast.success("Logged out successfully!", { id: loadingToast })
      setTimeout(() => {
        router.refresh()
        router.push("/login")
      }, 500)
    } catch {
      toast.error("Logout completed with connection fallback", { id: loadingToast })
      setTimeout(() => router.push("/login"), 1000)
    } finally {
      setIsLoggingOut(false)
    }
  }

 
  const formatRole = (role: string) => {
    return role
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return (
    <Sidebar
      {...props}
      className="border-r border-slate-200/80 bg-white transition-all duration-300 dark:border-zinc-900 dark:bg-black"
    >
     
      <SidebarHeader className="border-b border-slate-100 px-5 py-6 dark:border-zinc-900/60">
        <Link href="/" className="group flex items-center gap-3">
          <Logo />
        </Link>
        <div className="mt-5 border border-slate-100 bg-slate-50/50 p-4 transition-colors dark:border-zinc-900 dark:bg-zinc-950/50">
          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-zinc-500">Active Profile</p>
          <p className="mt-1.5 truncate text-sm font-bold text-slate-800 dark:text-zinc-100">{user.name}</p>
          <p className="mt-0.5 text-xs font-medium text-purple-600 dark:text-purple-400">{formatRole(user.role)}</p>
        </div>
      </SidebarHeader>


      <SidebarContent className="px-3 py-4 custom-scrollbar">
        <div className="space-y-6">
          {currentRoutes && currentRoutes.map((group: any) => (
            <SidebarGroup key={group.title} className="p-0">
              <SidebarGroupLabel className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">
                {group.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {group.items && group.items.map((item: any) => {
                    const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`)
                    const Icon = item.icon || LayoutDashboard

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link
                            href={item.url}
                            className={cn(
                              "group flex h-12 w-full items-center gap-3 border border-transparent px-3 text-sm font-bold transition-all duration-200 rounded-none overflow-hidden",
                              isActive
                                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/10 dark:bg-purple-700"
                                : "text-slate-600 hover:bg-slate-50 hover:text-purple-600 dark:text-zinc-400 dark:hover:bg-zinc-950/60 dark:hover:text-purple-400"
                            )}
                          >
                            <Icon
                              size={18}
                              className={cn(
                                "transition-transform duration-300 group-hover:scale-110 shrink-0",
                                isActive ? "text-white" : "text-slate-400 group-hover:text-purple-600 dark:text-zinc-500 dark:group-hover:text-purple-400"
                              )}
                            />
                            <span className="truncate tracking-wide">{item.title}</span>

                            {isActive && <div className="ml-auto h-3 w-3 border border-white bg-transparent animate-pulse dark:border-zinc-950" />}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </div>
      </SidebarContent>


      <SidebarFooter className="border-t border-slate-100 p-4 dark:border-zinc-900/60">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="group flex w-full items-center gap-3 border border-transparent px-4 py-3.5 font-bold text-rose-500 transition-all duration-200 rounded-none hover:border-rose-100 hover:bg-rose-50/50 dark:text-rose-500 dark:hover:border-rose-950/30 dark:hover:bg-rose-950/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoggingOut ? (
            <Loader2 size={16} className="animate-spin shrink-0" />
          ) : (
            <LogOut size={16} className="transition-transform duration-300 group-hover:-translate-x-0.5 shrink-0" />
          )}
          <span className="text-xs tracking-wide">{isLoggingOut ? "Logging out..." : "Logout Session"}</span>
        </button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}