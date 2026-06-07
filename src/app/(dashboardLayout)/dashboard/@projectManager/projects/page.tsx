import React from 'react'
import { getCurrentUser } from "@/lib/currentUser";
import { getMyProjects } from "@/services/project.service";
import { getMyTasks } from "@/services/task.service";
import { getUsers } from "@/services/user.service";
import { TeamBoard } from "@/components/Dashboard/TeamBoard";

export default async function Project() {
  const [projects, user, tasks, users] = await Promise.all([getMyProjects(), getCurrentUser(), getMyTasks({ sortBy: "priority", order: "asc" }), getUsers()]);
  const canEdit = user?.role === "Admin" || user?.role === "ProjectManager";

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <TeamBoard
        tasks={tasks ?? []}
        projects={projects ?? []}
        users={users ?? []}
        title="Project Manager Projects"
        description="Track the projects you are working on, the people attached to them, and the current status at a glance."
        roleLabel={user?.role ? `${user.role} panel` : "Project manager workspace"}
        canEdit={canEdit}
          currentUser={user}
        hideTaskSection={true}
      />
    </div>
  )
}
