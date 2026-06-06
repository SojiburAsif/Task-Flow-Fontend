"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useActionState } from "react";
import { CircleDashed, CircleCheckBig, Clock3, TriangleAlert, Plus, X, CalendarDays, Flag, User, LayoutList, FolderGit2, Users2, ArrowUpRight, Filter } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { TaskTable } from "@/components/Dashboard/TaskTable";
import ProjectEditForm from "@/components/Dashboard/ProjectEditForm";
import { createTaskAction } from "@/services/task.actions";
import type { TaskRecord, TaskStatusValue } from "@/services/task.service";
import type { ProjectRecord } from "@/services/project.service";
import type { UserProfile } from "@/services/user.service";

type TaskBoardProps = {
  tasks?: TaskRecord[];
  title: string;
  description: string;
  roleLabel: string;
  returnTo?: string;
  canEdit?: boolean;
  statusEditable?: boolean;
  canCreateTask?: boolean;
  initialProjectId?: string | null;
  projects?: ProjectRecord[];
  users?: UserProfile[];
  allowAssignmentEdit?: boolean;
  allowTaskEdit?: boolean;
  hideTaskSection?: boolean;
};

const normalizeStatus = (status?: string | null): TaskStatusValue => {
  if (status === "InProgress" || status === "Completed") return status;
  return "Todo";
};

const isOverdue = (task: TaskRecord) => normalizeStatus(task.status) !== "Completed" && new Date(task.dueDate).getTime() < Date.now();

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

const getPriorityColor = (priority?: string | null) => {
  if (priority === "High") return "text-rose-600 border-rose-200 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-900/50 dark:text-rose-400";
  if (priority === "Medium") return "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-900/50 dark:text-amber-400";
  return "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400";
};

export function TeamBoard({
  tasks = [],
  title,
  description,
  roleLabel,
  returnTo = "/dashboard/projects",
  canEdit = false,
  statusEditable = false,
  canCreateTask = false,
  initialProjectId = null,
  projects,
  users,
  allowAssignmentEdit = false,
  allowTaskEdit = false,
  hideTaskSection = false,
}: TaskBoardProps) {
  const stats = {
    total: tasks.length,
    todo: tasks.filter(task => normalizeStatus(task.status) === "Todo").length,
    inProgress: tasks.filter(task => normalizeStatus(task.status) === "InProgress").length,
    completed: tasks.filter(task => normalizeStatus(task.status) === "Completed").length,
    overdue: tasks.filter(isOverdue).length,
  };

  const projectStats = useMemo(() => {
    if (!projects?.length) return { total: 0, members: 0 };
    return {
      total: projects.length,
      members: projects.reduce((count, project) => count + (project.members?.length ?? 0), 0),
    };
  }, [projects]);

  const [openTaskModal, setOpenTaskModal] = useState<TaskRecord | null>(null);
  const [openProjectModal, setOpenProjectModal] = useState<ProjectRecord | null>(null);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [projectFilter, setProjectFilter] = useState("All");
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [createTaskProjectId, setCreateTaskProjectId] = useState<string | null>(null);

  // Filter and Sort Projects (Completed at the bottom)
  const displayProjects = useMemo(() => {
    if (!projects) return [];
    
    let filtered = projects;
    if (projectFilter !== "All") {
      const filterMap: Record<string, string> = { "Active": "Active", "Completed": "Completed", "On Hold": "OnHold" };
      filtered = projects.filter(p => p.status === filterMap[projectFilter]);
    }

    return filtered.sort((a, b) => {
      const aIsCompleted = a.status === "Completed" ? 1 : 0;
      const bIsCompleted = b.status === "Completed" ? 1 : 0;
      return aIsCompleted - bIsCompleted;
    });
  }, [projects, projectFilter]);

  const closeModals = () => {
    setOpenTaskModal(null);
    setOpenProjectModal(null);
    setIsEditingProject(false);
    setCreateTaskOpen(false);
  };

  const openTaskCreator = (projectId?: string | null) => {
    setCreateTaskProjectId(projectId ?? null);
    setCreateTaskOpen(true);
  };

  useEffect(() => {
    // If initialProjectId was provided by the server page, open that project modal when projects are loaded
    if (!projects || projects.length === 0) return;
    if (initialProjectId) {
      const found = projects.find(p => p.id === initialProjectId);
      if (found) {
        // schedule on next frame to avoid synchronous setState inside effect
        const rafId = window.requestAnimationFrame(() => setOpenProjectModal(found));
        return () => window.cancelAnimationFrame(rafId);
      }
    }
  }, [projects, initialProjectId]);

  return (
    <>
      <section className="relative w-full space-y-8">
        
        {/* =========================================
            PAGE HEADER (Sharp Design)
        ============================================= */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end border-b border-zinc-200 pb-8 dark:border-zinc-800">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-600 dark:text-purple-400">{roleLabel}</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">{title}</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="inline-flex items-center justify-center border border-purple-500/20 bg-purple-50 px-5 py-2.5 text-xs font-bold text-purple-700 rounded-none dark:bg-purple-500/10 dark:text-purple-300">
              {stats.total} Task{stats.total !== 1 && "s"} Tracked
            </div>
            {canCreateTask ? <NewTaskModal key={`${createTaskOpen ? "open" : "closed"}-${createTaskProjectId ?? "none"}`} open={createTaskOpen} projectId={createTaskProjectId} projects={projects} onOpenChange={setCreateTaskOpen} /> : null}
          </div>
        </div>

        {/* =========================================
            PROJECT SUMMARY CARDS
        ============================================= */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex items-center justify-between border border-zinc-200 bg-white p-5 shadow-none rounded-none dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center border border-purple-200 bg-purple-50 text-purple-600 rounded-none dark:border-purple-900/50 dark:bg-purple-900/20 dark:text-purple-400">
                <FolderGit2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Total Projects</p>
                <p className="text-3xl font-black text-zinc-950 dark:text-white">{projectStats.total}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border border-zinc-200 bg-white p-5 shadow-none rounded-none dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center border border-blue-200 bg-blue-50 text-blue-600 rounded-none dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400">
                <Users2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Project Members</p>
                <p className="text-3xl font-black text-zinc-950 dark:text-white">{projectStats.members}</p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            TASK KPI GRID
        ============================================= */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[
            { label: "To Do", value: stats.todo, icon: CircleDashed, tone: "text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-900/50" },
            { label: "In Progress", value: stats.inProgress, icon: Clock3, tone: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/50" },
            { label: "Completed", value: stats.completed, icon: CircleCheckBig, tone: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900/50" },
            { label: "Overdue", value: stats.overdue, icon: TriangleAlert, tone: "text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-900/50" },
          ].map((item) => (
            <div key={item.label} className="border border-zinc-200 bg-white p-5 shadow-none rounded-none dark:border-zinc-800 dark:bg-zinc-950 transition hover:border-purple-300 dark:hover:border-purple-900/50">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center border rounded-none ${item.tone}`}>
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

        {/* =========================================
            ASSIGNED PROJECTS GRID (With Filters)
        ============================================= */}
        <div className="border border-zinc-200 bg-white p-6 shadow-none rounded-none dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border border-zinc-200 bg-zinc-50 rounded-none dark:border-zinc-700 dark:bg-zinc-900">
                <FolderGit2 className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Assigned Projects</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Projects sorted with completed items at the bottom.</p>
              </div>
            </div>

            {/* Filter Options */}
            <div className="flex items-center gap-2 border border-zinc-200 p-1 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <Filter className="h-3.5 w-3.5 ml-2 text-zinc-400" />
              {["All", "Active", "On Hold", "Completed"].map((f) => (
                <button
                  key={f}
                  onClick={() => setProjectFilter(f)}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors rounded-none ${
                    projectFilter === f 
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm" 
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {displayProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center border border-dashed border-zinc-300 bg-zinc-50/50 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/20 rounded-none">
              <FolderGit2 size={32} className="mb-3 text-zinc-400 dark:text-zinc-600" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">No projects found</h3>
              <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">Change filter or create a new project.</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {displayProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setOpenProjectModal(project)}
                  className={`group cursor-pointer flex flex-col justify-between border border-zinc-200 bg-white p-6 transition-all hover:border-purple-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-purple-500/50 rounded-none ${
                    project.status === "Completed" ? "opacity-70 hover:opacity-100 bg-zinc-50 dark:bg-zinc-900/30" : ""
                  }`}
                >
                  <div>
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <span className={`inline-flex border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-none ${getStatusStyles(project.status)}`}>
                        {project.status || "Unknown"}
                      </span>
                      <ArrowUpRight className="h-5 w-5 text-zinc-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-purple-500" />
                    </div>
                    <h3 className="text-lg font-bold leading-tight text-zinc-900 dark:text-white line-clamp-1">{project.name}</h3>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">{project.description}</p>
                  </div>

                  <div className="mt-6 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
                        <CalendarDays className="h-3.5 w-3.5 text-purple-500" />
                        {formatDate(project.deadline)}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
                        <Users2 className="h-3.5 w-3.5 text-blue-500" />
                        {project.members?.length ?? 0} Members
                      </div>
                    </div>

                    {canCreateTask ? (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openTaskCreator(project.id);
                        }}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 border border-purple-600 bg-purple-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-purple-700"
                      >
                        <Plus className="h-4 w-4" /> Add Task
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* =========================================
            TASK TABLE CONTAINER
        ============================================= */}
        {!hideTaskSection && (
          <div className="border border-zinc-200 bg-white p-6 shadow-none rounded-none dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border border-zinc-200 bg-zinc-50 rounded-none dark:border-zinc-700 dark:bg-zinc-900">
                <LayoutList className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Task Board</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Manage and update your tasks below.</p>
              </div>
            </div>
            
            <TaskTable
              tasks={tasks}
              returnTo={returnTo}
              statusEditable={statusEditable}
              allowAssignmentEdit={allowAssignmentEdit}
              allowTaskEdit={allowTaskEdit}
            />
          </div>
        )}
        {hideTaskSection && (
          <div className="border border-zinc-200 bg-white p-6 shadow-none rounded-none dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
            <TaskTable
              tasks={tasks}
              returnTo={returnTo}
              statusEditable={statusEditable}
              allowAssignmentEdit={allowAssignmentEdit}
              allowTaskEdit={allowTaskEdit}
            />
          </div>
        )}
      </section>

      {/* =========================================
          MODAL: View Task Details 
      ============================================= */}
      <AnimatePresence>
        {openTaskModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 sm:p-6 backdrop-blur-sm"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden bg-white shadow-2xl rounded-none dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50/50 px-6 py-5 rounded-none dark:border-zinc-800 dark:bg-zinc-900/30 md:px-8">
                <div>
                  <span className={`inline-flex border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-none ${getStatusStyles(openTaskModal.status || "")}`}>
                    {openTaskModal.status || "Unknown"}
                  </span>
                  <h2 className="mt-2 text-xl font-black tracking-tight text-zinc-950 dark:text-white line-clamp-1">{openTaskModal.title}</h2>
                </div>
                <button onClick={closeModals} className="border border-zinc-200 bg-white p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 rounded-none dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">Description</h4>
                  <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900/30 p-5 border border-zinc-200 rounded-none dark:border-zinc-800">
                    {openTaskModal.description || "No description provided."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-zinc-200 bg-white p-4 shadow-none rounded-none dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                      <CalendarDays size={14} className="text-purple-500" /> Due Date
                    </div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">{formatDate(openTaskModal.dueDate)}</p>
                  </div>
                  <div className="border border-zinc-200 bg-white p-4 shadow-none rounded-none dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                      <Flag size={14} className="text-blue-500" /> Priority
                    </div>
                    {/* 👇 Smaller text size for Priority as requested */}
                    <p className={`inline-flex px-2 py-0.5 border text-[10px] font-black uppercase tracking-wider rounded-none ${getPriorityColor(openTaskModal.priority)}`}>
                      {openTaskModal.priority || "Medium"}
                    </p>
                  </div>
                </div>

                <div className="border border-zinc-200 bg-zinc-50 p-4 shadow-none rounded-none dark:border-zinc-800 dark:bg-zinc-900/30">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
                    <User size={14} className="text-emerald-500" /> Assigned To
                  </div>
                  {openTaskModal.assignedTo ? (
                    <div className="flex items-center gap-3 border border-emerald-200 bg-emerald-50 p-2.5 rounded-none dark:border-emerald-900/50 dark:bg-emerald-500/10">
                      <div className="flex h-8 w-8 items-center justify-center border border-emerald-300 bg-emerald-100 font-bold text-emerald-700 rounded-none dark:border-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-400 text-xs shrink-0">
                        {(openTaskModal.assignedTo.name || "U").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{openTaskModal.assignedTo.name}</p>
                        <p className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 truncate">{openTaskModal.assignedTo.email}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 pl-1">Unassigned</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================
          MODAL: View Project Details 
      ============================================= */}
      <AnimatePresence>
        {openProjectModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 sm:p-6 backdrop-blur-sm"
            onClick={closeModals}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="flex w-full max-w-3xl max-h-[90vh] flex-col overflow-hidden bg-white shadow-2xl border border-zinc-200 rounded-none dark:border-zinc-800 dark:bg-zinc-950"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50/60 px-6 py-5 rounded-none dark:border-zinc-800 dark:bg-zinc-900/30 md:px-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-purple-600 dark:text-purple-400">Project Details</p>
                  <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">{openProjectModal.name}</h2>
                </div>
                <div className="flex items-center gap-2">
                  {canEdit ? (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setIsEditingProject(true); }}
                      className="inline-flex items-center gap-2 border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-700 transition hover:border-purple-300 hover:text-purple-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-purple-500/60 dark:hover:text-purple-300"
                    >
                      Edit project
                    </button>
                  ) : null}
                  {canCreateTask ? (
                    <button
                      type="button"
                      onClick={() => openTaskCreator(openProjectModal.id)}
                      className="inline-flex items-center gap-2 border border-purple-600 bg-purple-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4" /> Add Task
                    </button>
                  ) : null}
                  <button onClick={closeModals} className="border border-zinc-200 bg-white p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 rounded-none dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
                {isEditingProject ? (
                  // Render the edit form in-place inside the modal
                  <ProjectEditForm
                    project={openProjectModal}
                    teamMembers={(users ?? []).filter(u => (u.role || "").replace(/[_\s-]+/g, "").toLowerCase() === "teammember")}
                    onClose={() => { setIsEditingProject(false); setOpenProjectModal(null); }}
                    returnTo={`/dashboard/projects?view=${openProjectModal.id}`}
                  />
                ) : (
                  <>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="border border-zinc-200 bg-zinc-50 p-4 rounded-none dark:border-zinc-800 dark:bg-zinc-900/30">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Status</p>
                        <p className={`mt-2 inline-flex px-2 py-0.5 border text-[10px] font-black uppercase tracking-wider rounded-none ${getStatusStyles(openProjectModal.status)}`}>
                          {openProjectModal.status || "Active"}
                        </p>
                      </div>
                      <div className="border border-zinc-200 bg-zinc-50 p-4 rounded-none dark:border-zinc-800 dark:bg-zinc-900/30">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Deadline</p>
                        <p className="mt-2 text-sm font-bold text-zinc-950 dark:text-white">{formatDate(openProjectModal.deadline)}</p>
                      </div>
                      <div className="border border-zinc-200 bg-zinc-50 p-4 rounded-none dark:border-zinc-800 dark:bg-zinc-900/30">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Members</p>
                        <p className="mt-2 text-sm font-bold text-zinc-950 dark:text-white">{openProjectModal.members?.length ?? 0}</p>
                      </div>
                    </div>

                    <div className="border border-zinc-200 bg-white p-5 rounded-none dark:border-zinc-800 dark:bg-zinc-950">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Description</h3>
                      <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                        {openProjectModal.description || "No project description available."}
                      </p>
                    </div>

                    <div className="border border-zinc-200 bg-zinc-50 p-5 rounded-none dark:border-zinc-800 dark:bg-zinc-900/20">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Team Members</h3>
                      </div>
                      {openProjectModal.members && openProjectModal.members.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {openProjectModal.members.map((member) => (
                            <div key={member.id} className="flex items-center gap-3 border border-zinc-200 bg-white p-3 rounded-none dark:border-zinc-700 dark:bg-zinc-950">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-blue-200 bg-blue-50 font-bold text-blue-700 rounded-none dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400 text-xs">
                                {(member.name || "U").charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-zinc-950 dark:text-zinc-100">{member.name || "Unnamed User"}</p>
                                <p className="truncate text-[10px] font-medium text-zinc-500 dark:text-zinc-400">{member.email}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="border border-dashed border-zinc-300 bg-white p-4 text-sm text-zinc-500 rounded-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
                          No team members assigned to this project.
                        </div>
                      )}
                    </div>

                    {canCreateTask ? (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => openTaskCreator(openProjectModal.id)}
                          className="inline-flex items-center gap-2 border border-purple-600 bg-purple-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-purple-700"
                        >
                          <Plus className="h-4 w-4" /> Add Task for This Project
                        </button>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* =========================================
   COMPONENT: Create New Task Modal (Sharp)
============================================= */
function NewTaskModal({
  open,
  projectId,
  projects,
  onOpenChange,
}: {
  open: boolean;
  projectId: string | null;
  projects?: ProjectRecord[];
  onOpenChange: (open: boolean) => void;
}) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projectId ?? (projects && projects.length > 0 ? projects[0].id : null));
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);

  const [actionState, formAction, isPending] = useActionState(createTaskAction, { success: false, message: "" });

  useEffect(() => {
    if (!actionState) return;

    if (actionState.success) {
      toast.success(actionState.message || "Task created successfully!");
      const raf = window.requestAnimationFrame(() => {
        onOpenChange(false);
        setSelectedAssignee(null);
      });
      return () => window.cancelAnimationFrame(raf);
    } else if (actionState.message) {
      toast.error(actionState.message);
    }
  }, [actionState, onOpenChange]);

  return (
    <>
      <button type="button" onClick={() => onOpenChange(true)} className="inline-flex items-center gap-1.5 border border-purple-600 bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-none transition hover:bg-purple-700 active:scale-95 rounded-none">
        <Plus size={14} /> New Task
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 sm:p-6 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="flex w-full max-w-xl max-h-[90vh] flex-col overflow-hidden bg-white shadow-2xl rounded-none dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50/50 px-6 py-5 rounded-none dark:border-zinc-800 dark:bg-zinc-900/30">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">Create New Task</h2>
                  <p className="text-xs text-zinc-500 mt-1">Assign a task to a project member</p>
                </div>
                <button type="button" onClick={() => onOpenChange(false)} className="border border-zinc-200 bg-white p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 rounded-none dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form
                action={formAction}
                onSubmit={(e) => {
                  // Prevent creating a task without a selected assignee
                  if (!selectedAssignee) {
                    e.preventDefault();
                    toast.error("Please assign a member before creating the task.");
                  }
                }}
                className="flex flex-col flex-1 overflow-hidden"
              >
                <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Task Title</label>
                    <input name="title" placeholder="e.g. Design Homepage" required className="w-full border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-purple-500 rounded-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Project Selection</label>
                    {projects && projects.length > 0 ? (
                      <select name="projectId" value={selectedProjectId ?? ""} onChange={(e) => { setSelectedProjectId(e.target.value || null); setSelectedAssignee(null); }} required className="w-full border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-purple-500 rounded-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white cursor-pointer appearance-none">
                        <option value="">Select project</option>
                        {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    ) : (
                      <input name="projectId" placeholder="Project ID" required className="w-full border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-purple-500 rounded-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Description</label>
                    <textarea name="description" placeholder="Short description" rows={3} className="w-full border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-purple-500 rounded-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white resize-none" />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Due Date</label>
                      <input name="dueDate" type="date" required className="w-full border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-purple-500 rounded-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white appearance-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Priority</label>
                      <select name="priority" className="w-full border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-purple-500 rounded-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white appearance-none cursor-pointer">
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Assign Member</label>
                    <input type="hidden" name="assignedToId" value={selectedAssignee ?? ""} />
                    {projects && selectedProjectId ? (
                      (() => {
                        const members = projects.find(p => p.id === selectedProjectId)?.members ?? [];
                        if (members.length > 0) {
                          return (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                              {members.map(member => (
                                <button key={member.id} type="button" onClick={() => setSelectedAssignee(member.id)} className={`flex items-center gap-2 p-2 border transition-all text-left rounded-none ${selectedAssignee === member.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-500/50' : 'border-zinc-200 bg-white hover:border-purple-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-purple-700/50'}`}>
                                  <div className="flex h-6 w-6 shrink-0 items-center justify-center border border-zinc-200 bg-zinc-50 font-bold text-zinc-600 rounded-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 text-[10px]">{(member.name || "U").charAt(0)}</div>
                                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">{member.name || member.id}</span>
                                </button>
                              ))}
                            </div>
                          );
                        }
                        return <p className="text-xs text-zinc-500 italic pl-1">No members found in this project.</p>;
                      })()
                    ) : (
                      <p className="text-xs text-zinc-500 italic pl-1">Select a project first to view members.</p>
                    )}
                  </div>

                </div>

                  <div className="flex items-center justify-end gap-3 border-t border-zinc-200 bg-zinc-50/50 px-6 py-4 rounded-none dark:border-zinc-800 dark:bg-zinc-900/30">
                  <button type="button" onClick={() => onOpenChange(false)} disabled={isPending} className="border border-zinc-200 bg-white px-5 py-2.5 text-sm font-bold text-zinc-600 transition hover:bg-zinc-50 rounded-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 disabled:opacity-50">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending || !selectedAssignee}
                    className="inline-flex items-center gap-2 border border-purple-600 bg-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-none transition hover:bg-purple-700 rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? "Creating..." : "Create Task"}
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

export { TeamBoard as TaskBoard };