import React from "react";

import { TaskBoard } from "@/components/Dashboard/TaskBoard";
import { getCurrentUser } from "@/lib/currentUser";
import { getTasks } from "@/services/task.service";

export default async function AdminAllTasks() {
  const [tasks, user] = await Promise.all([getTasks(), getCurrentUser()]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <TaskBoard
        tasks={tasks ?? []}
        title="All Tasks"
        description="Review and manage the full task queue across the system with deadline, priority, and project context."
        roleLabel={user?.role ? `${user.role} panel` : "Admin workspace"}
        returnTo="/dashboard/AdminTasks"
        statusEditable
      />
    </div>
  );
}
