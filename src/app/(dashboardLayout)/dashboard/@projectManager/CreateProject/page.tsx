import React from "react";
import { getUsers } from "@/services/user.service";
import { Role } from "@/app/constants/role";
import CreateProjectForm from "@/components/Dashboard/CreateProjectForm";

export default async function CreateProjectPage() {
  const users = await getUsers();
  const teamMembers = (users ?? []).filter((user) => {
    const normalizedRole = user.role.replace(/[_\s-]+/g, "").toLowerCase();
    return normalizedRole === Role.TeamMember.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-12 px-4 transition-colors duration-300 dark:bg-black sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:text-left border-b border-zinc-200 pb-8 dark:border-zinc-800">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-none border border-purple-500/20 bg-purple-600 text-white shadow-none dark:border-purple-500/50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L3 7v7c0 5 4 9 9 9s9-4 9-9V7l-9-5z" fill="#fff"/></svg>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <span className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">
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

        <CreateProjectForm teamMembers={teamMembers} />
      </div>
    </div>
  );
}