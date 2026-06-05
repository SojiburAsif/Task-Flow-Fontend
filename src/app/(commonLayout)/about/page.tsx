import React from "react";
import { getCurrentUser } from "@/lib/currentUser";
import { 
  Info, 
  Users2, 
  ShieldCheck, 
  Cpu, 
  Code2, 
  Database,
  TerminalSquare
} from "lucide-react";

export default async function AboutPage() {
  const user = await getCurrentUser();

  const corePillars = [
    {
      title: "Built For Teams",
      description: "A centralized hub to collaborate, assign duties, and track work progress with complete transparency.",
      icon: Users2,
      tone: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/50 dark:text-blue-400"
    },
    {
      title: "Privacy & Security",
      description: "Data kept strictly private per workspace settings with robust role-based access controls (RBAC).",
      icon: ShieldCheck,
      tone: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400"
    },
    {
      title: "Highly Extensible",
      description: "Powerful APIs for analytics, real-time activity logs, and seamless third-party integrations.",
      icon: Cpu,
      tone: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/50 dark:text-amber-400"
    }
  ];

  const techStack = [
    { name: "Next.js 14", description: "React Framework for Production", icon: TerminalSquare },
    { name: "Tailwind CSS", description: "Utility-first CSS framework", icon: Code2 },
    { name: "Prisma ORM", description: "Next-generation Node.js/TypeScript ORM", icon: Database }
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
                {user?.role ? `${user.role.replace(/_/g, " ")} View` : "Platform Info"}
              </span>
              <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-5xl flex items-center gap-3">
                About TaskFlow
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                This Task Collaboration System helps modern teams manage projects, track tasks, and monitor real-time activity. Designed with a focus on speed, clarity, and uncompromising brutalist aesthetics.
              </p>
            </div>
            
            <div className="inline-flex items-center gap-3 border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs font-bold text-zinc-700 rounded-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 shrink-0">
              <Info className="h-4 w-4 text-purple-500" />
              v1.0.0 Stable
            </div>
          </div>
        </div>

        {/* =========================================
            CORE PILLARS (Sharp Cards)
        ============================================= */}
        <div className="grid gap-6 md:grid-cols-3">
          {corePillars.map((pillar, idx) => (
            <div 
              key={idx} 
              className="group flex flex-col justify-between border border-zinc-200 bg-white p-6 shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-purple-400 hover:shadow-xl rounded-none dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-purple-500/50"
            >
              <div>
                <div className={`mb-5 flex h-12 w-12 items-center justify-center border rounded-none ${pillar.tone}`}>
                  <pillar.icon className="h-5 w-5" />
                </div>
                
                <h3 className="text-lg font-bold text-zinc-900 transition-colors group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {pillar.description}
                </p>
              </div>
              <div className="mt-6 h-0.5 w-0 bg-purple-600 transition-all duration-500 group-hover:w-full dark:bg-purple-500" />
            </div>
          ))}
        </div>

        {/* =========================================
            TECH STACK SECTION
        ============================================= */}
        <div className="border border-zinc-200 bg-white p-8 shadow-none rounded-none dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-6 flex items-center gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
            <div className="flex h-10 w-10 items-center justify-center border border-zinc-200 bg-zinc-50 rounded-none dark:border-zinc-700 dark:bg-zinc-900">
              <Code2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Technology Stack</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Built with modern web technologies.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {techStack.map((tech, idx) => (
              <div key={idx} className="flex items-center gap-4 border border-zinc-200 bg-zinc-50 p-4 transition-colors hover:border-purple-300 rounded-none dark:border-zinc-800 dark:bg-zinc-900/30 dark:hover:border-purple-800">
                <tech.icon className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{tech.name}</h4>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}