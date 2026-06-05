import React from "react";
import { getUsers } from "@/services/user.service";
import { getCurrentUser } from "@/lib/currentUser";
import type { UserProfile } from "@/services/user.service";
import MemberRow from "@/components/Admin/MemberRow";
import { Users2 } from "lucide-react";
import { cn } from "@/lib/utils";

// রোলের জন্য সুন্দর রঙের ব্যাজ কনফিগ
const roleBadges: Record<string, string> = {
  ADMIN: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200/50 dark:border-purple-900/30",
  ProjectManager: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/30",
  TeamMember: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-900/30",
};

export default async function AllMemberPage() {
  const users = (await getUsers()) || [];
  const currentUser = await getCurrentUser();


  const filteredUsers = users.filter(u => u.id !== currentUser?.id);

  return (
    <div className="p-6 space-y-6 bg-zinc-50 dark:bg-black min-h-screen pt-24 transition-colors duration-300 text-zinc-950 dark:text-white">
      {/* হেডার সেকশন */}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left w-full max-w-5xl mx-auto mb-6">
        {/* আইকন কন্টেইনার */}
        <div className="p-2.5 bg-purple-600 text-white rounded-xl shadow-md shadow-purple-500/10 shrink-0">
          <Users2 size={22} />
        </div>

        {/* টেক্সট কন্টেইনার */}
        <div className="flex flex-col items-center sm:items-start">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400 block">
            Admin Controls
          </span>
          <h1 className="text-2xl font-black tracking-tight mt-0.5 text-zinc-950 dark:text-white">
            Workspace Members
          </h1>
        </div>
      </div>

      <div className="space-y-3 max-w-5xl mx-auto">
        {filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-[2rem] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-900 text-zinc-400">
            <Users2 size={36} className="stroke-[1.5] mb-2" />
            <p className="text-sm font-bold">No registered workspace members found.</p>
          </div>
        )}

        {filteredUsers.map((u: UserProfile) => (
          <div
            key={u.id}
            className="p-4 sm:p-5 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-900/80 rounded-[2rem] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-800"
          >
            {/* বাম পাশ: মেম্বার প্রোফাইল ইনফো ও অ্যাভাটার আইকন */}
            <div className="flex items-center gap-4 min-w-0 w-full md:w-auto">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-sm font-black text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                {(u.name || u.email).substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 space-y-1">
                <p className="font-extrabold text-sm text-zinc-900 dark:text-white truncate">{u.name || "No Name Provided"}</p>
                <p className="text-xs font-semibold text-zinc-400 truncate">{u.email}</p>

                {/* রোলের লাইভ ব্যাজ ট্যাগ প্রিভিউ */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className={cn("text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border", roleBadges[u.role] || "bg-zinc-50 border-zinc-200")}>
                    {u.role === "ProjectManager" ? "Project Manager" : u.role === "TeamMember" ? "Team Member" : u.role}
                  </span>
                  <span className={cn("text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border",
                    u.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30"
                      : "bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30"
                  )}>
                    {u.status}
                  </span>
                </div>
              </div>
            </div>

            {/* ডান পাশ: অ্যাকশন কন্ট্রোল ইন্টারঅ্যাক্টিভ রো */}
            <MemberRow user={u} />

          </div>
        ))}
      </div>
    </div>
  );
}