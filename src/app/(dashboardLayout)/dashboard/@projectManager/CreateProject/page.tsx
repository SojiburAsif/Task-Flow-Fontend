/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { redirect } from "next/navigation";
import { createProject } from "@/services/project.service";
import { getUsers } from "@/services/user.service";
import { Role } from "@/app/constants/role";
import { Briefcase, Calendar as CalendarIcon, FolderPlus, UserPlus } from "lucide-react";

export const createProjectAction = async (formData: FormData) => {
  'use server';
  const name = formData.get("name")?.toString() ?? "";
  const description = formData.get("description")?.toString() ?? "";
  const deadline = formData.get("deadline")?.toString() ?? undefined;
  const status = formData.get("status")?.toString() ?? undefined;
  
  // Get all keys starting with member-
  const memberIds: string[] = [];
  for (const [key, value] of (formData as any).entries()) {
    if (key.startsWith("member-") && value === "on") {
      memberIds.push(key.replace("member-", ""));
    }
  }

  if (!name.trim() || !description.trim() || !deadline) {
    throw new Error("Please provide project name, description and a valid deadline.");
  }

  const d = new Date(deadline);
  if (Number.isNaN(d.getTime())) {
    throw new Error("Deadline must be a valid date.");
  }

  try {
    await createProject({ 
      name: name.trim(), 
      description: description.trim(), 
      deadline: d.toISOString(), 
      status: status || null, 
      memberIds: memberIds.length > 0 ? memberIds : undefined 
    });
  } catch (error: any) {
    console.error("Failed to create project:", error.message);
    throw error;
  }
  
  redirect("/dashboard/projects");
};

export default async function CreateProjectPage() {
  const users = await getUsers();
  const teamMembers = (users ?? []).filter((user) => {
    const normalizedRole = user.role.replace(/[_\s-]+/g, "").toLowerCase();
    return normalizedRole === Role.TeamMember.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-12 px-4 transition-colors duration-300 dark:bg-black sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* =========================================
            HEADER SECTION (Sharp Design)
        ============================================= */}
        <div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:text-left border-b border-zinc-200 pb-8 dark:border-zinc-800">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-none border border-purple-500/20 bg-purple-600 text-white shadow-none dark:border-purple-500/50">
            <Briefcase size={24} strokeWidth={2.5} />
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <span className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">
              <FolderPlus size={12} />
              Project Management
            </span>
            <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
              Create New Project
            </h1>
            <p className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Define project scope, set deadlines and assign team members.
            </p>
          </div>
        </div>

        {/* =========================================
            FORM SECTION
        ============================================= */}
        <form action={createProjectAction} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Project Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-zinc-200 bg-white shadow-none rounded-none dark:border-zinc-800 dark:bg-zinc-950">
              <div className="border-b border-zinc-200 bg-zinc-50/50 p-6 rounded-none dark:border-zinc-800 dark:bg-zinc-900/30">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Project Information</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Basic details about the project goals.</p>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Project Name</label>
                  <input 
                    id="name" 
                    name="name" 
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
                    placeholder="Describe the project objectives and scope..." 
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
                      <CalendarIcon className="absolute left-3 top-3 text-purple-500" size={18} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="status" className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Initial Status</label>
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

          {/* Right Column: Member Assignment */}
          <div className="space-y-6 flex flex-col">
            <div className="border border-zinc-200 bg-white shadow-none rounded-none dark:border-zinc-800 dark:bg-zinc-950 flex-1 flex flex-col">
              <div className="border-b border-zinc-200 bg-zinc-50/50 p-6 rounded-none dark:border-zinc-800 dark:bg-zinc-900/30">
                <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2 dark:text-white">
                  <UserPlus size={18} className="text-purple-500" />
                  Assign Members
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Select team members for this project.</p>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar flex-1">
                  {teamMembers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full border border-dashed border-zinc-300 bg-zinc-50/50 p-6 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
                      <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">No team members found</p>
                    </div>
                  ) : (
                    teamMembers.map(user => (
                      <label 
                        key={user.id} 
                        className="flex items-center gap-3 p-3 border border-zinc-200 bg-white hover:border-purple-400 cursor-pointer transition-colors rounded-none dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-purple-600/50 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 dark:has-[:checked]:bg-purple-900/20"
                      >
                        <input 
                          type="checkbox" 
                          name={`member-${user.id}`} 
                          className="h-4 w-4 rounded-none border-zinc-300 text-purple-600 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-900 dark:checked:bg-purple-600 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                            {user.name || "Unnamed User"}
                          </p>
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate uppercase font-medium mt-0.5">
                            {user.role}
                          </p>
                        </div>
                        <span className="border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-zinc-600 rounded-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 shrink-0">
                          {user.status}
                        </span>
                      </label>
                    ))
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800/80">
                  <button 
                    type="submit" 
                    className="w-full inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold h-12 rounded-none transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
                  >
                    Create Project
                  </button>
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}