import React from "react";
import { getProjects } from "@/services/project.service";
import { getCurrentUser } from "@/lib/currentUser";
import { ProjectList } from "@/components/Dashboard/ProjectList";

export default async function ProjectsPage() {
  const projects = await getProjects();
  const user = await getCurrentUser();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ProjectList 
        projects={projects || []} 
        role={user?.role || "ProjectManager"} 
        users={[]}
        title="Project Management" 
      />
    </div>
  );
}