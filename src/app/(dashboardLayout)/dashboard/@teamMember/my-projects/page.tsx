import React from "react";
import { getProjects } from "@/services/project.service";
import { getCurrentUser } from "@/lib/currentUser";
import { getUsers } from "@/services/user.service";
import { ProjectList } from "@/components/Dashboard/ProjectList";

export default async function MyProjectPage() {
  const projects = await getProjects();
  const user = await getCurrentUser();
  const users = await getUsers();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ProjectList 
        projects={projects || []} 
        role={user?.role || "Member"} 
        users={users ?? []}
        title="My Assigned Projects" 
      />
    </div>
  );
}