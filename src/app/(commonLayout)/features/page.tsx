import React from "react";
import { 
  FolderGit2, 
  CheckSquare, 
  ShieldCheck, 
  Activity, 
  BarChart3, 
  Users2, 
  Lock, 
  Zap, 
  Sparkles 
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      title: "Project Workspaces",
      description: "Create and manage dedicated project environments with strict deadlines, status tracking, and structured team assignments.",
      icon: FolderGit2,
      category: "Management",
      tone: "text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-900/50 dark:text-purple-400"
    },
    {
      title: "Advanced Task Board",
      description: "Break down projects into actionable tasks. Set priorities (High, Medium, Low), deadlines, and assign specific team members.",
      icon: CheckSquare,
      category: "Core",
      tone: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/50 dark:text-blue-400"
    },
    {
      title: "Role-Based Access (RBAC)",
      description: "Strict permission controls for Admins, Project Managers, and Team Members ensuring secure and focused dashboard views.",
      icon: ShieldCheck,
      category: "Security",
      tone: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400"
    },
    {
      title: "Live Activity Audit",
      description: "A centralized, chronological timeline tracking every project update, task creation, and status change across the workspace.",
      icon: Activity,
      category: "Tracking",
      tone: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/50 dark:text-amber-400"
    },
    {
      title: "KPI Analytics & Reports",
      description: "Visual charts and counter metrics showing project completion rates, urgent task distributions, and overall team momentum.",
      icon: BarChart3,
      category: "Analytics",
      tone: "text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-900/50 dark:text-rose-400"
    },
    {
      title: "Team Collaboration",
      description: "Seamlessly add members to workspaces, manage active/inactive statuses, and track individual workloads efficiently.",
      icon: Users2,
      category: "Team",
      tone: "text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-900/50 dark:text-indigo-400"
    },
    {
      title: "Secure Authentication",
      description: "Robust credential management with the ability to instantly revoke active sessions across multiple devices for ultimate security.",
      icon: Lock,
      category: "Security",
      tone: "text-cyan-600 bg-cyan-50 border-cyan-200 dark:bg-cyan-900/20 dark:border-cyan-900/50 dark:text-cyan-400"
    },
    {
      title: "Real-time State Sync",
      description: "Optimized server actions and seamless UI updates ensuring your team always sees the latest task statuses instantly.",
      icon: Zap,
      category: "Performance",
      tone: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200 dark:bg-fuchsia-900/20 dark:border-fuchsia-900/50 dark:text-fuchsia-400"
    },
    {
      title: "Brutalist Modern UI",
      description: "A sharp, enterprise-grade dark and light mode interface designed for maximum readability and zero distractions.",
      icon: Sparkles,
      category: "Design",
      tone: "text-zinc-600 bg-zinc-100 border-zinc-300 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-300"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-16 px-4 transition-colors duration-300 dark:bg-black sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-12">
        
        {/* =========================================
            HEADER SECTION (Sharp Design)
        ============================================= */}
        <div className="relative overflow-hidden border border-zinc-200 bg-white/90 p-8 shadow-none backdrop-blur rounded-none dark:border-zinc-800 dark:bg-zinc-950/90">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-zinc-500/5 dark:from-purple-500/10 dark:to-transparent" />
          
          <div className="relative flex flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <span className="inline-flex border border-purple-500/30 bg-purple-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-purple-700 rounded-none dark:border-purple-500/40 dark:bg-purple-500/10 dark:text-purple-400">
                System Capabilities
              </span>
              <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-5xl">
                Platform Features
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Explore the powerful tools and modules built into TaskFlow to streamline your workspace, track progress, and manage teams efficiently.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================
            FEATURES GRID (Sharp Cards)
        ============================================= */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="group flex flex-col justify-between border border-zinc-200 bg-white p-6 shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-purple-400 hover:shadow-xl rounded-none dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-purple-500/50"
            >
              <div>
                <div className="flex items-start justify-between mb-5">
                  <div className={`flex h-12 w-12 items-center justify-center border rounded-none ${feature.tone}`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <span className="border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-zinc-500 rounded-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                    {feature.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-zinc-900 transition-colors group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </div>

              {/* Bottom Decorative Line */}
              <div className="mt-6 h-0.5 w-0 bg-purple-600 transition-all duration-500 group-hover:w-full dark:bg-purple-500" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}