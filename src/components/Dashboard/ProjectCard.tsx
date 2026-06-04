"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Clock, User, ArrowUpRight, Edit2, Trash2 } from "lucide-react";
import { type ProjectRecord } from "@/services/project.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  project: ProjectRecord;
  role: string;
  onDelete?: (id: string) => Promise<void>;
}

const getStatusColor = (status: string | null | undefined) => {
  const s = (status || "").toLowerCase();
  if (s === "completed") 
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-500/20";
  if (s === "active" || s === "in progress") 
    return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200/60 dark:border-blue-500/20";
  if (s === "pending" || s === "onhold") 
    return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/60 dark:border-amber-500/20";
  return "bg-zinc-50 text-zinc-700 dark:bg-zinc-500/10 dark:text-zinc-400 border-zinc-200 dark:border-zinc-500/20";
};

export const ProjectCard = ({ project, role, onDelete }: ProjectCardProps) => {
  const canEdit = role === "Admin" || role === "ProjectManager";

  return (
    <div className="group flex h-full flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-500/30 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/40 dark:hover:border-purple-500/20 dark:hover:shadow-black/40">
      <div>
        <div className="mb-5 flex items-center justify-between gap-2">
          <Badge className={`uppercase tracking-wider text-[10px] font-bold ${getStatusColor(project.status)}`} variant="outline">
            {project.status || "N/A"}
          </Badge>
          
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 dark:text-zinc-500" title="Created by">
            <User size={13} />
            <span className="truncate max-w-27.5">{project.createdBy?.name ?? "System"}</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <Link href={`/dashboard/projects/${project.id}`}>
            <h3 className="flex items-start justify-between gap-1 text-lg font-bold text-zinc-900 transition-colors group-hover:text-purple-600 dark:text-zinc-100 dark:group-hover:text-purple-400">
              <span className="line-clamp-1">{project.name}</span>
              <ArrowUpRight size={16} className="text-zinc-400 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
            </h3>
          </Link>
          <p className="line-clamp-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            {project.description ?? "No description provided for this project."}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
           {/* Deadline Info */}
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            {project.deadline ? (
              <>
                <Calendar size={14} className="text-purple-500" />
                <span>
                  {new Date(project.deadline).toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </span>
              </>
            ) : (
              <>
                <Clock size={14} className="text-zinc-400" />
                <span className="text-zinc-400 font-medium">No deadline</span>
              </>
            )}
          </div>

          {/* Members */}
          <div className="flex items-center -space-x-2">
            {project.members && project.members.length > 0 ? (
              project.members.slice(0, 3).map((m, i) => (
                <div 
                  key={m.id || i}
                  className="h-7 w-7 rounded-full bg-purple-100 dark:bg-purple-900/30 border-2 border-white dark:border-zinc-950 flex items-center justify-center text-[10px] font-bold text-purple-600 dark:text-purple-400 capitalize"
                >
                  {(m.name || 'U').charAt(0)}
                </div>
              ))
            ) : null}
            {project.members && project.members.length > 3 && (
              <div className="h-7 w-7 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-white dark:border-zinc-950 flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                +{project.members.length - 3}
              </div>
            )}
          </div>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800/60">
            <Button asChild variant="outline" size="sm" className="flex-1 text-xs gap-1.5 h-8">
              <Link href={`/dashboard/projects/${project.id}/edit`}>
                <Edit2 size={12} /> Edit
              </Link>
            </Button>
            {onDelete && (
              <Button 
                variant="destructive" 
                size="sm" 
                className="h-8 w-8 p-0 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 border-none"
                onClick={() => onDelete(project.id)}
              >
                <Trash2 size={12} />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
