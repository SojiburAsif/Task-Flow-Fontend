"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Activity, ArrowUpRight, Clock3, FolderGit2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";

import type { ActivityRecord } from "@/services/activity.service";

type ActivityTimelineProps = {
  activities: ActivityRecord[];
  title: string;
  description: string;
  roleLabel: string;
};

// টাইমস্ট্যাম্প ফরম্যাট হেল্পার
const formatWhen = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / (60 * 1000));
  
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

// রোল ফরম্যাট হেল্পার
const formatRoleLabel = (role?: string) => {
  if (!role) return "User";
  if (role === "ProjectManager") return "Manager";
  if (role === "TeamMember") return "Member";
  return role.replace(/_/g, " ");
};

// অ্যানিমেশন ভ্যারিয়্যান্টস
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export function ActivityTimeline({ activities, title, description, roleLabel }: ActivityTimelineProps) {
  const [openProject, setOpenProject] = useState<ActivityRecord["project"] | null>(null);

  return (
    <section className="relative w-full">
      {/* হেডার সেকশন */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-600 dark:text-purple-400">{roleLabel}</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">{title}</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{description}</p>
        </div>
        <div className="inline-flex items-center justify-center border border-purple-500/20 bg-purple-50 px-5 py-2 text-xs font-bold text-purple-700 dark:bg-purple-500/10 dark:text-purple-300 shrink-0">
          {activities.length} Recent Activit{activities.length === 1 ? "y" : "ies"}
        </div>
      </div>

      {/* মেইন কন্টেইনার */}
      <div className="border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950 sm:p-8">
        
        {/* কন্টেইনার হেডার */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center bg-zinc-100 dark:bg-zinc-900 shrink-0">
            <Activity className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Activity Stream</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Live audit trail of operations visible to your role.</p>
          </div>
        </div>

        {/* টাইমলাইন বডি */}
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-zinc-300 bg-zinc-50/50 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/20">
            <Activity size={32} className="mb-3 text-zinc-400 dark:text-zinc-600" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">No recent activities</h3>
            <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">New logs will appear here after project and task updates.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
            className="relative ml-3 border-l-2 border-zinc-100 dark:border-zinc-800/80 pb-4 space-y-8"
          >
            {activities.map((activity) => (
              <motion.article 
                key={activity.id} 
                variants={itemVariants}
                className="relative pl-6 sm:pl-8"
              >
                {/* টাইমলাইনের ডট (Dot) */}
                <span className="absolute -left-3 top-2 sm:top-5 flex h-5 w-5 items-center justify-center bg-white dark:bg-zinc-950 ring-2 ring-zinc-200 dark:ring-zinc-800">
                  <div className="h-2 w-2 bg-purple-500 dark:bg-purple-400" />
                </span>

                {/* অ্যাক্টিভিটি কার্ড */}
                <div className="border border-zinc-200/80 bg-zinc-50/50 p-4 sm:p-5 shadow-sm transition hover:border-purple-300 hover:bg-white hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/30 dark:hover:border-purple-900/50 dark:hover:bg-zinc-900">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* বাম পাশ: লগের টেক্সট ও মেম্বার ইনফো */}
                    <div className="space-y-3 flex-1 min-w-0">
                      
                      {/* টাইম ও মেম্বার ব্যাজ */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1">
                          <Clock3 size={12} className="text-purple-500" />
                          {formatWhen(activity.createdAt)}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-900/50 px-2 py-0.5">
                          {formatRoleLabel(activity.performedBy.role)}
                        </span>
                      </div>
                      
                      {/* মূল অ্যাক্টিভিটি টেক্সট */}
                      <p className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        {activity.text}
                      </p>

                      {/* পারফর্মার ইনফো */}
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex h-6 w-6 items-center justify-center bg-zinc-200 dark:bg-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-300">
                          {(activity.performedBy.name || activity.performedBy.email || "U").charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 truncate">
                          {activity.performedBy.name || activity.performedBy.email}
                        </span>
                      </div>
                    </div>

                    {/* ডান পাশ: প্রজেক্ট শর্টকাট লিংক */}
                    <button
                      type="button"
                      onClick={() => setOpenProject(activity.project)}
                      className="inline-flex items-center gap-2 bg-white border border-zinc-200 px-3.5 py-2 text-xs font-bold text-zinc-700 transition hover:border-purple-300 hover:text-purple-600 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-purple-500/60 dark:hover:text-purple-400 shrink-0 self-start md:self-auto mt-2 md:mt-0"
                    >
                      <FolderGit2 size={14} className="text-zinc-400" />
                      <span className="truncate max-w-32">{activity.project.name}</span>
                      <ArrowUpRight size={14} />
                    </button>

                  </div>
                </div>
                </motion.article>
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {openProject ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-sm"
            onClick={() => setOpenProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="flex w-full max-w-3xl max-h-[90vh] flex-col overflow-hidden bg-white shadow-2xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/60 px-6 py-5 dark:border-zinc-900 dark:bg-zinc-900/20 md:px-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-purple-600 dark:text-purple-400">Project Details</p>
                  <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">{openProject.name}</h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">This activity belongs to the selected project.</p>
                </div>
                <button onClick={() => setOpenProject(null)} className="bg-zinc-100 p-2 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white">
                  <Activity size={20} className="rotate-45" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Project ID</p>
                    <p className="mt-2 break-all text-sm font-bold text-zinc-950 dark:text-white">{openProject.id}</p>
                  </div>
                  <div className="border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Latest Activity</p>
                    <p className="mt-2 text-sm font-bold text-zinc-950 dark:text-white">{activities.find((activity) => activity.project.id === openProject.id)?.text ?? "No activity found"}</p>
                  </div>
                  <div className="border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Activity Count</p>
                    <p className="mt-2 text-sm font-bold text-zinc-950 dark:text-white">{activities.filter((activity) => activity.project.id === openProject.id).length}</p>
                  </div>
                </div>

                <div className="border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950/80">
                  <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Project Feed</h3>
                  <div className="mt-4 space-y-3">
                    {activities.filter((activity) => activity.project.id === openProject.id).length > 0 ? (
                      activities
                        .filter((activity) => activity.project.id === openProject.id)
                        .slice(0, 5)
                        .map((activity) => (
                          <div key={activity.id} className="border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
                            <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">{activity.text}</p>
                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                              {activity.performedBy.name || activity.performedBy.email} • {formatWhen(activity.createdAt)}
                            </p>
                          </div>
                        ))
                    ) : (
                      <div className="border border-dashed border-zinc-300 bg-white p-4 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
                        No project activity available.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-zinc-100 bg-zinc-50/60 px-0 pt-4 dark:border-zinc-900 dark:bg-zinc-900/10">
                  <Link href={`/dashboard/projects?view=${openProject.id}`} className="inline-flex items-center gap-2 bg-purple-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-purple-700">
                    Open Project Page
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}