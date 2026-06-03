import React from "react";
import { AppSidebar } from "@/components/Dashboard/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// আপনার প্রোজেক্টের jwtUtils বা getUserInfo ইমপোর্ট করে নেবেন
// import { jwtUtils } from "@/lib/jwtUtils";
// import { getUserInfo } from "@/services/auth.service";

export default async function DashboardLayout({
  children,
  admin,
  projectManager,
  teamMember,
}: {
  children: React.ReactNode;
  admin: React.ReactNode;
  projectManager: React.ReactNode;
  teamMember: React.ReactNode;
}) {
  // ========================================================
  // Authentication & Role Validation Logic
  // ========================================================
  /* 
    আপনার রিয়েল অ্যাপে নিচের কোডগুলো আনকমেন্ট করে ব্যবহার করবেন:
    const user = await getUserInfo();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const decodedToken = accessToken ? jwtUtils.decodedToken(accessToken) : null;
    
    if (!user && !decodedToken) {
      redirect("/login");
    }
    const rawRole = String(user?.role || decodedToken?.role || "").toUpperCase();
  */

  // ডেমো পারপাস (TypeScript কে বোঝানোর জন্য as টাইপ কাস্টিং করা হলো)
  const rawRole = "ADMIN" as "ADMIN" | "TEAM_MEMBER" | "PROJECT_MANAGER";
  
  const userInfo = {
    name: "Md Asif", // user?.name
    role: rawRole, // rawRole
    email: "admin@taskflow.com"
  };

  // ========================================================
  // Parallel Route Slot Selection
  // ========================================================
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
      <SidebarInset className="min-h-svh bg-background">
        <main className="flex-1 px-2 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
          {renderSlot}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}