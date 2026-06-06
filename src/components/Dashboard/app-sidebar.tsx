/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Loader2, LogOut, LayoutDashboard } from "lucide-react"
import { useActionState } from "react"
import { toast } from "sonner"

import { AdminRouters } from "@/router/AdminRouter"
import { TeamMemberRouters } from "@/router/TeamMemberRouter"
import { ProjectManagerRouters } from "@/router/ProjectManagerRoute"
import { logoutAction, type AuthActionState } from "@/services/auth.service"

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
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import Logo from "../shared/logo/logo"


const roleBasedRoutes: Record<string, any> = {
  ADMIN: AdminRouters,
  Admin: AdminRouters,
  TEAM_MEMBER: TeamMemberRouters,
  TeamMember: TeamMemberRouters,
  PROJECT_MANAGER: ProjectManagerRouters,
  ProjectManager: ProjectManagerRouters,
}

function SidebarLogoutButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="group flex w-full items-center gap-3 border border-purple-200 bg-linear-to-r from-purple-600 to-fuchsia-600 px-4 py-3.5 font-bold text-white transition-all duration-200 rounded-none shadow-[0_12px_30px_rgba(168,85,247,0.20)] hover:from-purple-700 hover:to-fuchsia-700 dark:border-purple-500/40 dark:from-purple-500 dark:to-violet-600 dark:text-zinc-950 dark:hover:from-purple-400 dark:hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? (
        <Loader2 size={16} className="animate-spin shrink-0 text-white dark:text-zinc-950" />
      ) : (
        <LogOut size={16} className="transition-transform duration-300 group-hover:-translate-x-0.5 shrink-0 text-white dark:text-zinc-950" />
      )}
      <span className="text-xs tracking-wide">{pending ? "Logging out..." : "Logout Session"}</span>
    </button>
  )
}

export function AppSidebar({
  user,
  ...props
}: {
  user: { name: string; role: string; email: string }
} & React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [logoutState, logoutFormAction, logoutPending] = useActionState<AuthActionState, FormData>(logoutAction, {
    success: false,
    message: "",
  })

  React.useEffect(() => {
    if (logoutState?.success) {
      toast.success(logoutState.message || "Logged out successfully")
      const id = window.setTimeout(() => {
        window.location.assign("/login")
      }, 0)

      return () => window.clearTimeout(id)
    }

    return undefined
  }, [logoutState?.success, logoutState?.message])

  const currentRoutes = roleBasedRoutes[user.role] || TeamMemberRouters

  return (
    <Sidebar
      {...props}
      className="sticky top-0 h-dvh overflow-hidden border-r border-zinc-200/80 bg-white/95 text-zinc-950 shadow-[0_24px_80px_rgba(91,33,182,0.08)] transition-all duration-300 before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.10),transparent_42%)] before:content-[''] dark:border-zinc-800 dark:bg-zinc-950/95 dark:text-zinc-50 dark:shadow-black/30 dark:before:bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.16),transparent_42%)]"
    >
     
      <SidebarHeader className="border-b border-zinc-100 bg-white/90 px-4 py-4 text-zinc-950 backdrop-blur sm:px-5 sm:py-6 dark:border-zinc-800 dark:bg-zinc-950/90 dark:text-zinc-50">
        <div className="flex items-center justify-between gap-3 md:hidden">
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.24em] text-purple-600 dark:text-purple-400">Dashboard</p>
            <p className="truncate text-sm font-semibold text-zinc-950 dark:text-white">Menu</p>
          </div>
          <SidebarTrigger className="h-10 w-10 border border-zinc-200 bg-white text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200" />
        </div>

        <div className="group hidden items-center gap-3 md:flex">
          <Logo />
        </div>
      </SidebarHeader>


      <SidebarContent className="bg-white/90 px-2 py-3 text-zinc-950 sm:px-3 sm:py-4 dark:bg-zinc-950/90 dark:text-zinc-50">
        <div className="space-y-4 pb-4 sm:space-y-6 sm:pb-6">
          {currentRoutes && currentRoutes.map((group: any) => (
            <SidebarGroup key={group.title} className="p-0">
              <SidebarGroupLabel className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-700 sm:px-3 sm:text-[10px] dark:text-zinc-300">
                {group.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {group.items && group.items.map((item: any) => {
                    const isHomeItem = item.url === "/dashboard"
                    const isActive = isHomeItem
                      ? pathname === item.url
                      : pathname === item.url || pathname.startsWith(`${item.url}/`)
                    const Icon = item.icon || LayoutDashboard

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link
                            href={item.url}
                            className={cn(
                              "group flex h-11 w-full items-center gap-3 border border-transparent px-3 text-[13px] font-bold transition-all duration-200 rounded-none overflow-hidden sm:h-12 sm:text-sm",
                              isActive
                                ? "bg-linear-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/20 dark:from-purple-500 dark:to-violet-600 dark:text-zinc-950"
                                : "text-zinc-700 hover:bg-zinc-50 hover:text-purple-600 dark:text-zinc-200 dark:hover:bg-zinc-900 dark:hover:text-purple-300"
                            )}
                          >
                            <Icon
                              size={18}
                              className={cn(
                                "transition-transform duration-300 group-hover:scale-110 shrink-0",
                                isActive ? "text-white dark:text-zinc-950" : "text-zinc-700 dark:text-zinc-200"
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


      <SidebarFooter className="border-t border-zinc-100 bg-white/90 p-3 sm:p-4 dark:border-zinc-900/60 dark:bg-zinc-950/90">
        <form action={logoutFormAction}>
          <SidebarLogoutButton pending={logoutPending} />
        </form>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}