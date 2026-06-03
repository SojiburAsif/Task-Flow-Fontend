import { AppSidebar } from "@/components/Dashboard/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Bell, CalendarDays, Search } from "lucide-react"
import { Input } from "@/components/ui/input"


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-svh bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.08),_transparent_24%),linear-gradient(180deg,_var(--background),_color-mix(in_oklch,var(--background),black_2%))]">
        <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
          <div className="flex flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Dashboard workspace
                </p>
                <h1 className="text-xl font-semibold text-foreground">Project control center</h1>
              </div>
            </div>

            <div className="flex flex-1 items-center gap-3 lg:max-w-xl lg:justify-end">
              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  aria-label="Search dashboard"
                  placeholder="Search tasks, projects, members..."
                  className="h-10 rounded-full pl-9"
                />
              </div>
              <Button variant="outline" size="icon-sm" aria-label="Notifications">
                <Bell className="size-4" />
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                <CalendarDays className="size-4" />
                Today
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}