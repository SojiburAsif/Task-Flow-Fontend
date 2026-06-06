"use client";

import React, { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { createProjectAction } from "@/services/project.actions";
import type { UserProfile } from "@/services/user.service";
import { CalendarDays, UserPlus, FolderKanban, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ActionState = { success: boolean; message: string; data?: Record<string, unknown> | null };

export default function CreateProjectForm({ teamMembers, returnTo = "/dashboard/projects" }: { teamMembers: UserProfile[]; returnTo?: string }) {
    const [state, action, pending] = useActionState<ActionState, FormData>(createProjectAction, { success: false, message: "" });
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const toggleMember = (id: string, checked: boolean) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (checked) next.add(id);
            else next.delete(id);
            return next;
        });
    };

    useEffect(() => {
        if (!state) return;
        if (state.success) {
            toast.success(state.message || "Project created successfully!");
            const id = state.data?.id as string | undefined;
            window.setTimeout(() => {
                if (id) {
                    window.location.assign(`/dashboard/projects?view=${id}`);
                } else {
                    window.location.assign(returnTo);
                }
            }, 500);
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state, returnTo]);

    return (
        <form action={action} className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
            {/* Left Column: Project Information */}
            <div className="lg:col-span-2 space-y-6">
                <div className="border border-zinc-200 bg-white shadow-none rounded-none dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="border-b border-zinc-200 bg-zinc-50/50 p-6 rounded-none dark:border-zinc-800 dark:bg-zinc-900/30">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <FolderKanban size={18} className="text-purple-600 dark:text-purple-400" />
                            Project Information
                        </h2>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Basic details about the project goals and workflow scope.</p>
                    </div>
                    
                    <div className="p-6 space-y-5">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Project Name</label>
                          <input 
                            id="name" 
                            name="name" 
                            type="text"
                            placeholder="e.g. Website Redesign" 
                            required 
                            className="h-11 w-full border border-zinc-300 bg-zinc-50/50 px-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-purple-500 focus:bg-white rounded-none dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="description" className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Description</label>
                          <textarea 
                            id="description" 
                            name="description" 
                            placeholder="Describe the project objectives, parameters, and deliverables..." 
                            rows={6} 
                            required 
                            className="w-full border border-zinc-300 bg-zinc-50/50 p-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-purple-500 focus:bg-white rounded-none resize-none dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label htmlFor="deadline" className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Deadline</label>
                                <div className="relative">
                                    <input 
                                        id="deadline" 
                                        name="deadline" 
                                        type="date" 
                                        required 
                                        className="h-11 w-full border border-zinc-300 bg-zinc-50/50 pl-10 pr-4 text-sm text-zinc-900 outline-none transition-all focus:border-purple-500 focus:bg-white rounded-none appearance-none dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900"
                                    />
                                    <CalendarDays className="absolute left-3 top-3 text-purple-500" size={18} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="status" className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Initial Status</label>
                                <div className="relative">
                                    <select 
                                        id="status" 
                                        name="status" 
                                        className="h-11 w-full border border-zinc-300 bg-zinc-50/50 px-4 text-sm text-zinc-900 outline-none transition-all focus:border-purple-500 focus:bg-white rounded-none appearance-none cursor-pointer dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Completed">Completed</option>
                                        <option value="OnHold">On Hold</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Member Assignment */}
            <div className="space-y-6 flex flex-col w-full">
                <div className="border border-zinc-200 bg-white shadow-none rounded-none dark:border-zinc-800 dark:bg-zinc-950 flex-1 flex flex-col">
                    <div className="border-b border-zinc-200 bg-zinc-50/50 p-6 rounded-none dark:border-zinc-800 dark:bg-zinc-900/30">
                        <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2 dark:text-white">
                            <UserPlus size={18} className="text-purple-500" />
                            Assign Members
                        </h2>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Select team members for this workspace deployment.</p>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar flex-1">
                            {teamMembers.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full border border-dashed border-zinc-300 bg-zinc-50/50 p-6 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
                                    <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">No active contributors found</p>
                                </div>
                            ) : (
                                teamMembers.map(user => {
                                    const isChecked = selectedIds.has(user.id);
                                    return (
                                        <label 
                                            key={user.id} 
                                            className={cn(
                                                "flex items-center gap-3 p-3 border cursor-pointer transition-all rounded-none select-none",
                                                isChecked
                                                    ? "border-purple-500 bg-purple-50/40 dark:bg-purple-900/20 dark:border-purple-500"
                                                    : "border-zinc-200 bg-white hover:border-purple-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-purple-800/60"
                                            )}
                                        >
                                            <input 
                                                type="checkbox" 
                                                name={`member-${user.id}`} 
                                                checked={isChecked}
                                                className="h-4 w-4 rounded-none border-zinc-300 text-purple-600 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-900 dark:checked:bg-purple-600 cursor-pointer"
                                                onChange={(e) => toggleMember(user.id, e.currentTarget.checked)} 
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{user.name || "Unnamed User"}</p>
                                                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate uppercase font-black tracking-wider mt-0.5">{user.role.replace(/_/g, " ")}</p>
                                            </div>
                                        </label>
                                    );
                                })
                            )}
                        </div>

                        <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800/80">
                            {/* disabled mapping optimized — button remains active even if 0 members are assigned */}
                            <button 
                                type="submit" 
                                disabled={pending}
                                className="w-full inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-black h-12 rounded-none transition-colors uppercase tracking-wider text-xs focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {pending ? (
                                    <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Processing...</span>
                                ) : (
                                    "Create Project Deploy"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}