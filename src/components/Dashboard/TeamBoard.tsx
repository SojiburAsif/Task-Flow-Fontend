"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, CalendarDays, CircleDashed, FolderGit2, Users2, X, Edit3, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import type { ProjectRecord } from "@/services/project.service";

type TeamBoardProps = {
  projects: ProjectRecord[];
  title: string;
  description: string;
  roleLabel: string;
  canEdit?: boolean;
  initialProjectId?: string | null;
};

const formatDate = (value?: string | null) => {
  if (!value) return "No deadline";
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const getStatusStyles = (status?: string | null) => {
  switch ((status || "").toLowerCase()) {
    case "completed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-500/10 dark:text-emerald-400";
    case "active":
      return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-500/10 dark:text-blue-400";
    case "onhold":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-500/10 dark:text-amber-400";
    default:
      return "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300";
  }
};

export function TeamBoard({ projects, title, description, roleLabel, canEdit = false, initialProjectId = null }: TeamBoardProps) {
  const stats = {
    total: projects.length,
    members: projects.reduce((count, project) => count + (project.members?.length ?? 0), 0),
    active: projects.filter((project) => (project.status || "").toLowerCase() === "active").length,
    completed: projects.filter((project) => (project.status || "").toLowerCase() === "completed").length,
  };

  const [openViewModal, setOpenViewModal] = useState(Boolean(initialProjectId));
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProjectId);
  const [editOpen, setEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const selectedProject = selectedProjectId ? projects.find((project) => project.id === selectedProjectId) ?? null : null;

  const openProjectDetails = (projectId: string) => {
    setSelectedProjectId(projectId);
    setOpenViewModal(true);
  };

  const closeModals = () => {
    setOpenViewModal(false);
    setEditOpen(false);
  };

  const submitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProject) return;

    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name")?.toString() ?? "").trim();
    const description = (formData.get("description")?.toString() ?? "").trim();
    const deadline = (formData.get("deadline")?.toString() ?? "").trim();
    const status = (formData.get("status")?.toString() ?? "").trim();

    if (!name || !description || !deadline) {
      toast.error("Project name, description and deadline are required.");
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading("Updating project details...");

    try {
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          deadline: new Date(deadline).toISOString(),
          status: status || undefined,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Failed to update project");
      }

      toast.success("Project updated successfully!", { id: loadingToast });
      setEditOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update project", { id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <section className="relative w-full">
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-600 dark:text-purple-400">{roleLabel}</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">{title}</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{description}</p>
          </div>
          <div className="inline-flex items-center justify-center border border-purple-500/20 bg-purple-50 px-5 py-2 text-xs font-bold text-purple-700 dark:bg-purple-500/10 dark:text-purple-300 shrink-0">
            {stats.total} Total Project{stats.total !== 1 && "s"}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { label: "Total Projects", value: stats.total, icon: FolderGit2, tone: "text-purple-600 bg-purple-50 dark:bg-purple-900/20" },
            { label: "Team Members", value: stats.members, icon: Users2, tone: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
            { label: "Active Projects", value: stats.active, icon: CircleDashed, tone: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
            { label: "Completed", value: stats.completed, icon: CalendarDays, tone: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" },
          ].map((item) => (
            <div key={item.label} className="border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center ${item.tone}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{item.label}</p>
                  <p className="text-2xl font-black text-zinc-950 dark:text-white">{item.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-zinc-100 dark:bg-zinc-900">
              <FolderGit2 className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Assigned Projects</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Click on any project card to view full details.</p>
            </div>
          </div>

            {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center border border-dashed border-zinc-300 bg-zinc-50/50 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/20">
              <FolderGit2 size={32} className="mb-3 text-zinc-400 dark:text-zinc-600" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">No projects found</h3>
              <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">When you create or join projects, they will appear here.</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => openProjectDetails(project.id)}
                  className="group cursor-pointer flex flex-col justify-between border border-zinc-200 bg-zinc-50/50 p-6 transition-all hover:border-purple-300 hover:bg-white hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/30 dark:hover:border-purple-900/50 dark:hover:bg-zinc-900"
                >
                  <div>
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <span className={`inline-flex border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${getStatusStyles(project.status)}`}>
                        {project.status || "Unknown"}
                      </span>
                      <ArrowUpRight className="h-5 w-5 text-zinc-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-purple-500" />
                    </div>
                    <h3 className="text-lg font-bold leading-tight text-zinc-900 dark:text-white line-clamp-1">{project.name}</h3>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">{project.description}</p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-zinc-200/80 pt-4 dark:border-zinc-800">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                      <CalendarDays className="h-3.5 w-3.5 text-purple-500" />
                      {formatDate(project.deadline)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                      <Users2 className="h-3.5 w-3.5 text-blue-500" />
                      {project.members?.length ?? 0} Members
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================
          MODAL 1: Project Details (View Mode) 
      ============================================= */}
      <AnimatePresence>
        {openViewModal && selectedProject && !editOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-sm"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="flex w-full max-w-4xl max-h-[90vh] flex-col overflow-hidden bg-white shadow-2xl dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-6 py-5 dark:border-zinc-900 dark:bg-zinc-900/20 md:px-8">
                <div>
                  <span className={`inline-flex border px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${getStatusStyles(selectedProject.status)}`}>
                    {selectedProject.status || "Unknown"} Status
                  </span>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-zinc-900 dark:text-white">{selectedProject.name}</h2>
                </div>
                <button onClick={closeModals} className="bg-zinc-100 p-2 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
                  {/* Left Column: Description & Info */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">Project Description</h4>
                      <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900/50 p-5 border border-zinc-100 dark:border-zinc-800/80">
                        {selectedProject.description || "No detailed description provided for this project."}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-zinc-100 bg-white p-4 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                          <CalendarDays size={14} className="text-purple-500" /> Deadline
                        </div>
                        <p className="text-base font-bold text-zinc-900 dark:text-white">{formatDate(selectedProject.deadline)}</p>
                      </div>
                      <div className="border border-zinc-100 bg-white p-4 shadow-sm dark:border-zinc-900 dark:bg-zinc-950">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                          <Users2 size={14} className="text-blue-500" /> Owner
                        </div>
                        <p className="text-base font-bold text-zinc-900 dark:text-white truncate">{selectedProject.createdBy?.name ?? "System Admin"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Team Members */}
                  <div className="border border-zinc-100 bg-zinc-50/80 p-5 dark:border-zinc-800/80 dark:bg-zinc-900/30 flex flex-col">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Team Roster</h4>
                      <span className="bg-zinc-200 px-2 py-0.5 text-[10px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {selectedProject.members?.length ?? 0}
                      </span>
                    </div>

                    <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
                      {selectedProject.members && selectedProject.members.length > 0 ? (
                        selectedProject.members.map((member) => (
                          <div key={member.id} className="flex items-center gap-3 bg-white p-2.5 shadow-xs border border-zinc-100 dark:bg-zinc-950 dark:border-zinc-800">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-purple-100 font-bold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs">
                              {(member.name || "U").charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-zinc-900 dark:text-zinc-100">{member.name ?? "Unnamed User"}</p>
                              <p className="truncate text-[10px] font-medium text-zinc-500">{member.email}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex h-32 flex-col items-center justify-center border border-dashed border-zinc-300 text-center dark:border-zinc-700">
                          <p className="text-xs text-zinc-500">No members assigned</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer / Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-zinc-100 bg-zinc-50/50 px-6 py-4 dark:border-zinc-900 dark:bg-zinc-900/20 md:px-8">
                <button onClick={closeModals} className="px-5 py-2.5 text-sm font-bold text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  Close
                </button>
                {canEdit && (
                  <button onClick={() => setEditOpen(true)} className="inline-flex items-center gap-2 bg-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-purple-700">
                    <Edit3 size={16} /> Edit Project
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================
          MODAL 2: Edit Project
      ============================================= */}
      <AnimatePresence>
        {editOpen && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-sm"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden bg-white shadow-2xl dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-6 py-5 dark:border-zinc-900 dark:bg-zinc-900/20 md:px-8">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">Edit Project Details</h2>
                  <p className="text-xs text-zinc-500 mt-1">Update information for {selectedProject.name}</p>
                </div>
                <button onClick={closeModals} className="bg-zinc-100 p-2 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={submitEdit} className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5 custom-scrollbar">
                  
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Project Name</label>
                    <input 
                      name="name" 
                      defaultValue={selectedProject.name} 
                      required 
                      className="w-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-purple-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-purple-500" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Description</label>
                    <textarea 
                      name="description" 
                      defaultValue={selectedProject.description || ""} 
                      required rows={4}
                      className="w-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-purple-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-purple-500 resize-none" 
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Deadline</label>
                      <input 
                        type="date" 
                        name="deadline" 
                        defaultValue={selectedProject.deadline ? new Date(selectedProject.deadline).toISOString().slice(0, 10) : ""} 
                        required 
                        className="w-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-purple-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-purple-500 appearance-none" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Status</label>
                      <select 
                        name="status" 
                        defaultValue={selectedProject.status || "Active"} 
                        className="w-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-purple-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-purple-500 appearance-none cursor-pointer"
                      >
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="OnHold">On Hold</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-zinc-100 bg-zinc-50/50 px-6 py-4 dark:border-zinc-900 dark:bg-zinc-900/20 md:px-8">
                  <button type="button" onClick={closeModals} disabled={isSaving} className="px-5 py-2.5 text-sm font-bold text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 disabled:opacity-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 bg-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}