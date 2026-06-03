"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Activity,
  CheckSquare2,
  ClipboardList,
  HomeIcon,
  LayoutDashboard,
  Loader2,
  LogOut,
  Users2,
} from "lucide-react"
import { toast } from "sonner"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site"

type SidebarRoute = {
  title: string
  items: Array<{
    title: string
    url: string
    icon: React.ComponentType<{ className?: string; size?: number }>
  }>
}

const sidebarRoutes: SidebarRoute[] = [
  {
    title: "Workspace",
    items: [
      { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
      { title: "Activity", url: "/dashboard#activity", icon: Activity },
      { title: "Tasks", url: "/dashboard#tasks", icon: CheckSquare2 },
    ],
  },
  {
    title: "Team",
    items: [
      { title: "Members", url: "/dashboard#team", icon: Users2 },
      { title: "Projects", url: "/dashboard#projects", icon: ClipboardList },
    ],
  },
]

export function AppSidebar({
  user,
  ...props
}: {
  user?: { role: string; name?: string }
} & React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    const loadingToast = toast.loading("Logging out...", {
      description: "Please wait while we log you out.",
    })

    try {
      const response = await fetch("/api/auth/logout", { method: "POST" })

      if (!response.ok) throw new Error("Logout failed")

      toast.success("Logged out successfully!", {
        description: "You have been logged out of your account.",
        duration: 3000,
        id: loadingToast,
      })

      setTimeout(() => {
        router.refresh()
        router.push("/login")
      }, 500)
    } catch {
      toast.error("Logout issue", {
        description: "Redirecting you to login.",
        duration: 3000,
        id: loadingToast,
      })

      setTimeout(() => {
        router.push("/login")
      }, 1000)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Sidebar
      {...props}
      className="border-r border-border/60 bg-background transition-colors duration-300"
    >
      <SidebarHeader className="border-b border-border/60 px-4 py-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-2xl px-2 py-1 transition-colors hover:bg-muted"
        >
          <span className="flex size-11 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 via-cyan-500 to-blue-600 text-white shadow-lg shadow-emerald-500/20">
            <HomeIcon size={20} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {siteConfig.name}
            </p>
            <p className="truncate text-base font-semibold text-foreground">{siteConfig.shortName} Dashboard</p>
          </div>
        </Link>

        <div className="mt-4 rounded-2xl border border-border/60 bg-muted/40 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Signed in as
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {user?.name ?? "Team Member"}
          </p>
          <p className="text-xs text-muted-foreground">{user?.role ?? "Collaborator"}</p>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex h-full flex-col justify-between bg-background px-2 py-4">
        <div className="space-y-4">
          {sidebarRoutes.map((group) => (
            <SidebarGroup key={group.title} className="px-2">
              <SidebarGroupLabel className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {group.title}
              </SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {group.items.map((item) => {
                    const isActive =
                      pathname === item.url || pathname === item.url.split("#")[0]
                    const Icon = item.icon

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link
                            href={item.url}
                            className={cn(
                              "flex items-center gap-3 rounded-2xl px-4 py-3 font-medium transition-all duration-200 group",
                              isActive
                                ? "bg-foreground text-background shadow-lg shadow-foreground/10"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            <Icon
                              size={17}
                              className={cn(
                                "transition-transform group-hover:scale-110",
                                isActive
                                  ? "text-background"
                                  : "text-muted-foreground group-hover:text-foreground"
                              )}
                            />
                            <span className="text-sm tracking-wide">{item.title}</span>

                            {isActive && (
                              <div className="ml-auto h-1.5 w-1.5 rounded-full bg-background animate-pulse" />
                            )}
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

        <SidebarFooter className="px-2 pb-2">
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-3">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 rounded-2xl border border-transparent px-4 py-3 font-medium text-rose-600 transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-rose-500/10"
            >
              {isLoggingOut ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <LogOut size={18} />
              )}
              <span className="text-sm">
                {isLoggingOut ? "Logging out..." : "Logout session"}
              </span>
            </button>
          </div>
        </SidebarFooter>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}