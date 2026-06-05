import Link from "next/link";
import { Activity, ArrowUpRight, Clock3, FolderGit2, UserCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityRecord } from "@/services/activity.service";

type ActivityTimelineProps = {
  activities: ActivityRecord[];
  title: string;
  description: string;
  roleLabel: string;
};

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

export function ActivityTimeline({ activities, title, description, roleLabel }: ActivityTimelineProps) {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-purple-400/80 to-transparent" />

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-500 dark:text-purple-400">{roleLabel}</p>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">{title}</h1>
          <p className="max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">{description}</p>
        </div>
        <div className="rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-700 dark:text-purple-300">
          {activities.length} recent activit{activities.length === 1 ? "y" : "ies"}
        </div>
      </div>

      <Card className="border border-zinc-200/80 bg-white/90 shadow-[0_24px_80px_rgba(91,33,182,0.10)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <CardHeader className="border-b border-zinc-200/70 dark:border-zinc-800">
          <CardTitle className="flex items-center gap-2 text-xl text-zinc-950 dark:text-zinc-50">
            <Activity className="h-5 w-5 text-purple-500" />
            Activity stream
          </CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">
            Live audit trail of project and task operations visible to your role.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {activities.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/40 p-10 text-center dark:border-zinc-800 dark:bg-zinc-950/20">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
                <Activity size={26} className="text-zinc-400 dark:text-zinc-500" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No recent activities</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                New logs will appear here after project and task updates.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map(activity => (
                <article key={activity.id} className="rounded-3xl border border-zinc-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/50">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100">{activity.text}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                          {activity.performedBy.role}
                        </Badge>
                        <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                          <UserCircle2 className="h-4 w-4 text-purple-500" />
                          {activity.performedBy.name || activity.performedBy.email}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                          <Clock3 className="h-4 w-4 text-purple-500" />
                          {formatWhen(activity.createdAt)}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/dashboard/projects?view=${activity.project.id}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-purple-300 hover:text-purple-600 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-purple-500/60 dark:hover:text-purple-300"
                    >
                      <FolderGit2 className="h-4 w-4" />
                      {activity.project.name}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
