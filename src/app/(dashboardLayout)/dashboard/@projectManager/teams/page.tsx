import React from "react";

import { getCurrentUser } from "@/lib/currentUser";
import { getProjects } from "@/services/project.service";
import { TeamBoard } from "@/components/Dashboard/TeamBoard";

export default async function MyTeams() {
  const [projects, user] = await Promise.all([getProjects(), getCurrentUser()]);
  const ownedProjects = (projects ?? []).filter(project => !user || project.createdBy?.id === user.id);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <TeamBoard
        projects={ownedProjects}
        title="My Project Teams"
        description="See the people behind each project, review ownership, and jump into the project detail when you need the full picture."
        roleLabel={user?.role ? `${user.role} panel` : "Project manager workspace"}
      />
    </div>
  );
}
