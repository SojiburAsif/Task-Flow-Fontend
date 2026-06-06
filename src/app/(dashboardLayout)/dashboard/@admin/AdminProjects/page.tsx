import React from "react";
import { getProjects } from "@/services/project.service";
import { getCurrentUser } from "@/lib/currentUser";
import { getUsers } from "@/services/user.service";
import { TeamBoard } from "@/components/Dashboard/TeamBoard";

export default async function AllProjectsAdmin() {
  const [projects, user, users] = await Promise.all([getProjects(), getCurrentUser(), getUsers()]);
  const canEdit = user?.role === "Admin" || user?.role === "ProjectManager";

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <TeamBoard
        projects={projects ?? []}
        users={users ?? []}
        title="Admin Project Console"
        description="Inspect every project in the workspace, review assigned members, and jump into a project detail view for deeper control."
        roleLabel={user?.role ? `${user.role} panel` : "Admin workspace"}
        canEdit={canEdit}
      />
    </div>
  );
}
