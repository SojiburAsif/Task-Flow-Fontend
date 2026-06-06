/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/Dashboard/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/currentUser";
import { normalizeDashboardRole } from "@/lib/roleUtils";

export default async function DashboardLayout(props: any) {
  const { children, admin, projectManager, teamMember, modal } = props as {
    children?: React.ReactNode;
    admin?: React.ReactNode;
    projectManager?: React.ReactNode;
    teamMember?: React.ReactNode;
    modal?: React.ReactNode;
  };
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const rawRole = normalizeDashboardRole(user.role);

  const userInfo = {
    name: user.name,
    role: rawRole,
    email: user.email,
  };

  let renderSlot: React.ReactNode;
  
  switch (rawRole) {
    case "ADMIN":
      renderSlot = admin;
      break;
    case "PROJECT_MANAGER":
      renderSlot = projectManager;
      break;
    case "TEAM_MEMBER":
      renderSlot = teamMember;
      break;
    default:
      renderSlot = children;
  }

  return (
    <SidebarProvider>
      <AppSidebar user={userInfo} />
      <SidebarInset className="min-h-screen overflow-x-hidden bg-zinc-50 text-zinc-950 transition-colors dark:bg-black dark:text-zinc-50">
        <div className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/90 px-4 py-3 backdrop-blur md:hidden dark:border-zinc-800 dark:bg-zinc-950/90">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="h-10 w-10 border border-zinc-200 bg-white text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200" />
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-purple-600 dark:text-purple-400">Dashboard</p>
              <p className="truncate text-sm font-semibold text-zinc-950 dark:text-white">{user.name}</p>
            </div>
          </div>
        </div>

        <main className="min-h-screen">
          {renderSlot}
          {modal}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}