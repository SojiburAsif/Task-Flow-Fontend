import React from "react";
import Image from "next/image";
import { getUsers } from "@/services/user.service";
import { getCurrentUser } from "@/lib/currentUser";
import type { UserProfile } from "@/services/user.service";
import MemberRow from "@/components/Admin/MemberRow";
import { Users2, ShieldAlert, UserCheck, UserX } from "lucide-react";
import { cn } from "@/lib/utils";

// রোলের জন্য শার্প বেগুনি ও ব্লু রঙের ব্যাজ কনফিগ (No rounded classes)
const roleBadges: Record<string, string> = {
  ADMIN: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/50",
  ProjectManager: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50",
  TeamMember: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/50",
};

export default async function AllMemberPage() {
  const users = (await getUsers()) || [];
  const currentUser = await getCurrentUser();

  // কারেন্ট অ্যাডমিনকে লিস্ট থেকে বাদ দেওয়ার লজিক
  const otherUsers = users.filter(u => u.id !== currentUser?.id);

  // ইউজারদের স্ট্যাটাস অনুযায়ী দুটি আলাদা লিস্টে ভাগ করা
  const activeUsers = otherUsers.filter(u => u.status === "ACTIVE");
  const inactiveUsers = otherUsers.filter(u => u.status === "INACTIVE");

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-12 px-4 transition-colors duration-300 dark:bg-black sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-10">
        
        {/* =========================================
            সেন্ট্রাল হেডার সেকশন (Sharp Purple Thimed)
        ============================================= */}
        <div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:text-left border-b border-zinc-200 pb-8 dark:border-zinc-800">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-none border border-purple-500/20 bg-purple-600 text-white shadow-none dark:border-purple-500/50">
            <Users2 size={24} strokeWidth={2.5} />
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <span className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">
              <ShieldAlert size={12} />
              Admin Controls
            </span>
            <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
              Workspace Members
            </h1>
            <p className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Manage roles, permissions, and account status for your team.
            </p>
          </div>
        </div>

        {/* ওয়ান ক্যাচ: এম্পটি স্টেট */}
        {otherUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-none border border-dashed border-zinc-300 bg-white/50 py-20 text-center dark:border-zinc-800 dark:bg-zinc-950/30">
            <div className="mb-4 flex h-16 w-16 items-center justify-center border border-zinc-200 bg-zinc-100 rounded-none dark:border-zinc-700 dark:bg-zinc-900">
              <Users2 size={28} className="text-zinc-400 dark:text-zinc-600" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No members found</h3>
            <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
              There are no registered workspace members to manage right now.
            </p>
          </div>
        )}

        {/* =========================================
            ACTIVE USERS SECTION (Purple Accent Highlight)
        ============================================= */}
        {activeUsers.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-purple-600 pl-3 dark:border-purple-500">
              <UserCheck size={18} className="text-purple-600 dark:text-purple-400" />
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Active Members</h2>
              <span className="ml-2 bg-purple-50 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-none border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-900/50">
                {activeUsers.length}
              </span>
            </div>

            <div className="grid gap-4">
              {activeUsers.map((u: UserProfile) => (
                <UserCard key={u.id} user={u} isActive={true} />
              ))}
            </div>
          </div>
        )}

        {/* =========================================
            INACTIVE / BANNED USERS SECTION
        ============================================= */}
        {inactiveUsers.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 border-l-4 border-rose-500 pl-3">
              <UserX size={18} className="text-rose-600 dark:text-rose-500" />
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Inactive & Banned</h2>
              <span className="ml-2 bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-none border border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800">
                {inactiveUsers.length}
              </span>
            </div>

            <div className="grid gap-4 opacity-80 hover:opacity-100 transition-opacity">
              {inactiveUsers.map((u: UserProfile) => (
                <UserCard key={u.id} user={u} isActive={false} />
              ))}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}

/* =========================================
   USER CARD SUB-COMPONENT (Sharp Purple Design)
============================================= */
function UserCard({ user, isActive }: { user: UserProfile, isActive: boolean }) {
  return (
    <div className={cn(
      "flex flex-col justify-between gap-5 rounded-none border bg-white p-5 shadow-none transition-all hover:shadow-sm dark:bg-zinc-950 md:flex-row md:items-center",
      isActive 
        ? "border-zinc-200 hover:border-purple-400 dark:border-zinc-800 dark:hover:border-purple-900/50" 
        : "border-rose-200/60 bg-rose-50/20 hover:border-rose-300 dark:border-rose-900/30 dark:bg-rose-950/10 dark:hover:border-rose-900/60"
    )}>
      
      {/* বাম পাশ: প্রোফাইল ইনফো */}
      <div className="flex min-w-0 w-full items-center gap-4 md:w-auto">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || user.email}
            width={48}
            height={48}
            unoptimized
            className={cn(
              "h-12 w-12 shrink-0 object-cover rounded-none border",
              isActive
                ? "border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
                : "border-rose-200 bg-rose-100 dark:border-rose-900/50 dark:bg-rose-900/30"
            )}
          />
        ) : null}
        
        <div className="min-w-0 space-y-1.5">
          <div>
            <p className={cn("truncate text-base font-bold", isActive ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-zinc-300")}>
              {user.name || "No Name Provided"}
            </p>
            <p className="truncate text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {user.email}
            </p>
          </div>

          {/* শার্প ট্যাগ ব্যাজেস */}
          <div className="flex flex-wrap gap-2">
            <span className={cn("inline-flex rounded-none border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider", roleBadges[user.role] || "bg-zinc-50 border-zinc-200")}>
              {user.role === "ProjectManager" ? "Project Manager" : user.role === "TeamMember" ? "Team Member" : user.role}
            </span>
            <span className={cn("inline-flex rounded-none border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider",
              isActive
                ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-900/50"
                : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50"
            )}>
              {user.status}
            </span>
          </div>
        </div>
      </div>

     
      <MemberRow user={user} />
    </div>
  );
}