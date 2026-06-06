import React from "react";

import { getCurrentUser } from "@/lib/currentUser";
import { getMyProjects } from "@/services/project.service";
import { getUsers } from "@/services/user.service";
import { TeamBoard } from "@/components/Dashboard/TeamBoard";

export default async function MyProjectPage() {
  const [projects, user, users] = await Promise.all([getMyProjects(), getCurrentUser(), getUsers()]);
  const canEdit = user?.role === "Admin" || user?.role === "ProjectManager";

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <TeamBoard
        projects={projects ?? []}
        users={users ?? []}
        title="My Projects"
        description="Projects you own or belong to are collected here with quick access to the full project view."
        roleLabel={user?.role ? `${user.role} workspace` : "Team member workspace"}
        canEdit={canEdit}
      />
    </div>
  );
}