"use client";

import React, { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { type ProjectRecord } from "@/services/project.service";
import { deleteProject } from "@/services/project.actions";
import { FolderOpen, Layers, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProjectEditDialog } from "@/components/Dashboard/ProjectEditDialog";
import type { UserProfile } from "@/services/user.service";

interface ProjectListProps {
  projects: ProjectRecord[];
  role: string;
  users: UserProfile[];
  title?: string;
}

export const ProjectList = ({ projects, role, users, title = "Projects" }: ProjectListProps) => {
  const [view, setView] = useState<"card" | "table">("card");
  const router = useRouter();
  const isAdminOrPM = role === "Admin" || role === "ProjectManager";

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      await deleteProject(id);
      toast.success("Project deleted successfully");
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to delete project");
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-zinc-100 pb-6 dark:border-zinc-800/60">
        <div className="space-y-1">
          <h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            <Layers className="text-purple-500" size={28} />
            {title}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {isAdminOrPM 
              ? "Manage and track all system projects from here."
              : "View and track your assigned work projects."}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button size="sm" variant={view === "card" ? "default" : "outline"} onClick={() => setView("card")} className="text-xs">
              Card
            </Button>
            <Button size="sm" variant={view === "table" ? "default" : "outline"} onClick={() => setView("table")} className="text-xs">
              Table
            </Button>
          </div>

          {projects.length > 0 && (
            <div className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-zinc-50/50 px-4 py-2 text-sm font-bold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300">
              <FolderOpen size={16} className="text-purple-500" />
              Total: <span className="text-purple-600 dark:text-purple-400">{projects.length}</span>
            </div>
          )}
          
          {isAdminOrPM && (
            <Link href="/dashboard/CreateProject">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl gap-2 font-bold shadow-lg shadow-purple-200 dark:shadow-none">
                <Plus size={18} />
                New Project
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Projects Grid / Empty State */}
      {projects.length === 0 ? (
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/30 p-10 text-center dark:border-zinc-800 dark:bg-zinc-950/10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 mb-5 shadow-inner">
            <FolderOpen size={26} className="text-zinc-400 dark:text-zinc-500" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No Projects Available</h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
            {isAdminOrPM 
              ? "There are no projects found in the system. Try adding a new project first."
              : "You have not been assigned to any projects yet."}
          </p>
        </div>
      ) : (
        <>
          {view === "card" ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-10">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} role={role} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-fixed border-collapse">
                <thead>
                  <tr className="text-left text-sm text-zinc-500 border-b border-zinc-100">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Deadline</th>
                    <th className="py-3 px-4">Members</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.id} className="border-b last:border-b-0 hover:bg-zinc-50">
                      <td className="py-3 px-4">
                        <Link href={`/dashboard/projects/${p.id}`} className="font-bold text-zinc-900 dark:text-zinc-100">
                          {p.name}
                        </Link>
                        <div className="text-xs text-zinc-500">{p.description ?? ""}</div>
                      </td>
                      <td className="py-3 px-4 text-sm text-zinc-700">{p.status || "N/A"}</td>
                      <td className="py-3 px-4 text-sm text-zinc-700">{p.deadline ? new Date(p.deadline).toLocaleDateString() : "—"}</td>
                      <td className="py-3 px-4 text-sm text-zinc-700">{p.members?.length ?? 0}</td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex items-center gap-2">
                          <ProjectEditDialog project={p} users={users} trigger={<Button size="sm" variant="outline">Edit</Button>} />
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};
