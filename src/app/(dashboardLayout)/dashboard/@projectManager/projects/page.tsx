import React from 'react'
import { getCurrentUser } from "@/lib/currentUser";
import { getMyProjects } from "@/services/project.service";
import { TeamBoard } from "@/components/Dashboard/TeamBoard";

export default async function Project() {
  const [projects, user] = await Promise.all([getMyProjects(), getCurrentUser()]);
  const canEdit = user?.role === "Admin" || user?.role === "ProjectManager";

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <TeamBoard
        projects={projects ?? []}
        title="Project Manager Projects"
        description="Track the projects you are working on, the people attached to them, and the current status at a glance."
        roleLabel={user?.role ? `${user.role} panel` : "Project manager workspace"}
        canEdit={canEdit}
      />
    </div>
  )
}
