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
      <SidebarInset className="min-h-screen overflow-x-hidden bg-background text-foreground transition-colors">
        <div className="sticky top-0 z-30 border-b border-border/70 bg-background/90 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="h-10 w-10 border border-border bg-background text-foreground shadow-sm" />
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary">Dashboard</p>
              <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
            </div>
          </div>
        </div>

        <main className="min-h-screen bg-background text-foreground">
          {renderSlot}
          {modal}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}