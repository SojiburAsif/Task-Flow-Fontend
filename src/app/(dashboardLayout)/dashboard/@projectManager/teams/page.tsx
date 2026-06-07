import React from "react";

import { getCurrentUser } from "@/lib/currentUser";
import { getMyProjects } from "@/services/project.service";
import { TeamBoard } from "@/components/Dashboard/TeamBoard";

export default async function MyTeams() {
  const [projects, user] = await Promise.all([getMyProjects(), getCurrentUser()]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <TeamBoard
        projects={projects ?? []}
        title="My Project Teams"
        description="See the people behind each project, review ownership, and jump into the project detail when you need the full picture."
        roleLabel={user?.role ? `${user.role} panel` : "Project manager workspace"}
          currentUser={user}
      />
    </div>
  );
}
