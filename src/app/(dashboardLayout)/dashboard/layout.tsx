import React from "react";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/Dashboard/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/currentUser";
import { normalizeDashboardRole } from "@/lib/roleUtils";

export default async function DashboardLayout({
  children,
  admin,
  projectManager,
  teamMember,
  modal,
}: {
  children: React.ReactNode;
  admin: React.ReactNode;
  projectManager: React.ReactNode;
  teamMember: React.ReactNode;
  modal: React.ReactNode;
}) {
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
      <SidebarInset className="min-h-screen overflow-auto bg-zinc-50 text-zinc-950 transition-colors dark:bg-black dark:text-zinc-50">
        <main className="">
          {/* Welcome card removed per design request */}

          {renderSlot}
          {modal}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}